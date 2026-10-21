+++
title = "Patching and mitigating PHP2Shell"
date = 2026-10-21T18:00:00+05:30
draft = false
math = false
author = "Krishnatejaswi S"
description = "What PHP's two PHP2Shell advisories say, who is exposed, the fixed versions, config and proxy mitigations, and compromise checks for PHP servers."
tags = ["security", "php", "php-fpm", "cve", "incident"]
+++

Updated 16:45 UTC, 21 Oct: the fix is out. PHP shipped [8.5.12, 8.4.27, 8.3.36 and 8.2.35](https://www.php.net/releases/feed.php) and published advisories for both bugs, [CVE-2026-109618](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w) and [CVE-2026-109619](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp). Both say updating is the only complete mitigation. An earlier version of this post was written before the release, and the root-cause theory going around then was only partly right.

Two PHP bugs rated CVSS 9.2 leaked on Hacker News on 20 Oct, and attacks were reported the next morning. Upgrade now and restart every PHP worker. If a host can't be upgraded today, turn off `session.upload_progress.enabled`, apply the other switches below, and reject multipart bodies at the proxy on routes that don't take uploads.

## Timeline

All times are UTC.

- 20 Oct, 15:20: Hacker News user petecooper posts ["Tell HN: 2x PHP RCE CVEs with CVSS 10.0 Incoming"](https://news.ycombinator.com/item?id=50167754), citing "a reliable source" ("source: trust me, bro"). It names CVE-2026-109618 and CVE-2026-109619 and puts the announcement at 22 Oct 18:00 CEST. The poster [later wrote](https://news.ycombinator.com/item?id=50176946) that the source "lied when I asked if it was under responsible disclosure/co-ordinated disclosure".
- 20 Oct, afternoon: watchTowr tells [BleepingComputer](https://www.bleepingcomputer.com/news/security/php-warns-admins-of-two-critical-flaws-emergency-patches-coming-tomorrow/) the leak is real and that they reproduced CVE-2026-109618.
- 20 Oct, 19:32: Jakub Zelenka posts PHP's [advance notice](https://externals.io/message/132883). Two vulnerabilities, "both rated CVSS v4.0 9.2", release on 21 Oct at 14:00 UTC. That's a day ahead of the leaked date, so the leak moved the release up.
- 21 Oct, 07:34: [Patchstack](https://patchstack.com/articles/php-major-vulnerability-alert-10-2026/) reports "multiple active exploitation incidents" from hosting partners, with no IoCs.
- 21 Oct, 07:43: Cloudflare CTO Dane Knecht says they're "seeing early attacks emerging" (quoted by Tenable).
- 21 Oct, 09:18: [Aikido](https://www.aikido.dev/blog/critical-vulnerabilities-in-php-php2shell) reports exploitation in the wild.
- 21 Oct, 13:34: PHP publishes both GitHub advisories. The CVE records go public at 13:48 and 13:54, and the four releases land on php.net.

The name PHP2Shell comes from leaked exploit material credited to Calif.IO and LCFR ([Tenable's FAQ](https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote) has the background). PHP's advisories don't use it.

## What runs before your script

Take a WordPress site where `/wp-admin/` needs a login cookie. A multipart POST there with no cookie still has its whole body parsed before WordPress is loaded. In [`main/main.c`](https://github.com/php/php-src/blob/PHP-8.4/main/main.c), request startup builds the superglobals, and building `$_POST` for `multipart/form-data` runs the multipart parser in [`main/rfc1867.c`](https://github.com/php/php-src/blob/PHP-8.4/main/rfc1867.c). ext/session hooks a callback into that parser to track upload progress. Only after that does PHP compile your script.

That means auth checks, framework middleware and `disable_functions` all come too late. Both advisories describe bugs that can fire in this window, and the first one says that on mod_php it "happens entirely before any application-specific code begins execution".

## The two bugs

### CVE-2026-109618, RCE via OOM corruption

PHP handles running out of memory by jumping straight out of whatever it was doing with `longjmp()`. Some code briefly leaves request memory half set up, and if an allocation fails right then, the jump leaves that memory in a broken state. The allocation that fails doesn't have to be related to the broken memory. Request shutdown then reads it.

The advisory lists several ways a multipart body can push a request past `memory_limit` while staying under `post_max_size`. So an attacker doesn't need a bug in your app to get the out-of-memory error. They can cause it during body parsing.

Apache mod_php always runs request shutdown, even when startup failed. That's the case PHP confirmed as unauthenticated RCE, with default memory and input limits and a normal prefork setup. FPM kills the child when startup fails, so that path doesn't survive there. PHP says source analysis still makes FPM susceptible after normal startup, but no complete FPM exploit has been shown. FrankenPHP behaves like mod_php and is "likely susceptible".

The fix removes `longjmp()` for out-of-memory. PHP now stops the request at the next safe point, and exits the process outright if memory goes past a second, higher limit.

### CVE-2026-109619, RCE via stale global state

A PHP worker keeps some global state (errors, sessions, objects, extensions) that points into one request's memory. That state has to be reset before the request's memory is freed. If a fatal error interrupts an operation before its reset, the next request on the same worker can read the stale pointer before normal setup replaces it. That's a use-after-free (C code using memory after it was handed back).

PHP confirms two cases:

- PHP 8.5 with `fatal_error_backtraces` on. The backtrace state is never reset at shutdown. This is the confirmed mod_php RCE.
- Session upload progress. An upload can set up session state before normal initialization, a fatal error can strand it, and the next upload on that worker reads it. PHP validated RCE against mod_php and FPM, though the FPM path "depends on a suitable application operation".

There's a second consumer too. A warning raised while PHP applies INI settings before request startup reads the stale error state, even if the warning is never shown or logged. On mod_php that's `.htaccess` and Apache `php_value` settings. On FPM it's only when the web server passes `PHP_VALUE` or `PHP_ADMIN_VALUE`. `error_reporting`, `@` and `display_errors=0` don't help.

### How the early theory held up

Before the release, most posts blamed a use-after-free in the session upload progress callback. One detailed writeup (on jackalsyn.com, not linked because it ships exploit code) retracted its first chain on the morning of 21 Oct and settled on stale state carried between requests on prefork servers. That's close to CVE-2026-109619, though PHP rates it RCE and also confirms an FPM path. The out-of-memory bug wasn't in anyone's public theory.

## Geek fact

Upload progress came from Arnaud Le Blanc's [2008 RFC](https://wiki.php.net/rfc/session_upload_progress) and shipped in PHP 5.4. It had a memory bug before ([CVE-2020-7062](https://cveawg.mitre.org/api/cve/CVE-2020-7062), a NULL pointer dereference fixed in 7.4.3). The 109619 advisory calls it a "hardly-used and hardly-tested feature" and suggests keeping it off even after you patch. Arnaud Le Blanc is in the credits for both fixes.

## Am I exposed

Every release below 8.5.12, 8.4.27, 8.3.36 and 8.2.35 is affected on the supported branches. The advisories say nothing about end-of-life branches.

Commands from here on use Debian/Ubuntu names. On RHEL-family the binary and service are `php-fpm` and pools live in `/etc/php-fpm.d/`.

- Check the version the web server runs (`php-fpm8.3 -v`, or `phpinfo()` through the pool). `php -v` is the CLI binary and can differ.
- mod_php and FrankenPHP are the most exposed. FPM is exposed to the session path, and PHP calls it susceptible to the out-of-memory bug.
- CLI and cron scripts don't parse request bodies, so the startup path doesn't reach them.

[Mallory](https://mallory.ai/blog/php-rce-rapid-response) counted Shodan banners on 20 Oct. 2,237,277 hosts send an `X-Powered-By: PHP` header, 1,495,986 of them include a version, and 883,717 of those are on 8.1 or older. That's the 59% going around, so it's 59% of hosts that print a version. Against all 2.24M it's about 39.5%. A patched distro build that still says 8.1.2 counts here too.

| Branch | Hosts (Mallory, rounded) | Upstream security support |
|---|---|---|
| 5.x | 368k | none |
| 7.x | 329k | none |
| 8.0 | 79k | none |
| 8.1 | 107k | ended 31 Dec 2025 |
| 8.2 | 225k | until 31 Dec 2026 |
| 8.3 | 242k | until 31 Dec 2027 |
| 8.4 | 84k | until 31 Dec 2028 |
| 8.5 | 61k | until 31 Dec 2029 |

For 8.1 and older there's no upstream fix. Distros can backport without changing the version string (Ubuntu 22.04 ships 8.1.2), and [CloudLinux](https://blog.cloudlinux.com/php-cve-2026-109618-and-cve-2026-109619) says alt-php backports are being prepared. Otherwise move to a supported branch, or take the host off the public internet (VPN, IP allowlist) as [CERT-EU](https://www.cert.europa.eu/publications/security-advisories/2026-018/) advises. If you're on 8.2, plan the move to 8.3 or later while you patch, since 8.2 has about ten weeks of security support left.

## Patching

Upgrade to 8.5.12, 8.4.27, 8.3.36 or 8.2.35. For distro packages, look for the CVE IDs in the package changelog, because a backport keeps the old version string:

```bash
apt changelog php8.3-fpm | grep -E 'CVE-2026-10961(8|9)'
rpm -q --changelog php-fpm | grep -E 'CVE-2026-10961(8|9)'
```

Then restart every FPM master, Apache if you use mod_php, and any long-running workers (FrankenPHP, RoadRunner, Swoole). Old workers keep the old code, and 109619 lives in exactly that per-worker state. Compare the master's start time with the package install time:

```bash
ps -eo pid,lstart,cmd | grep '[p]hp-fpm: master'
grep ' upgrade php' /var/log/dpkg.log | tail -3
# RHEL-family
rpm -q --last php-fpm
```

For Docker, pull the new base image, rebuild, redeploy and run `php -v` inside the running container.

## If you can't patch today

None of these is a complete fix. PHP says so in both advisories. Set each one administratively (php.ini or `php_admin_*` in the FPM pool) so the app and `.user.ini` can't override it, then restart every worker.

Upload progress, for the session path of 109619. Nothing breaks unless your app reads upload progress from `$_SESSION` (grep your code for `PHP_SESSION_UPLOAD_PROGRESS` and `upload_progress`):

```ini
; /etc/php/8.3/fpm/pool.d/www.conf, repeat for every pool
php_admin_flag[session.upload_progress.enabled] = off
```

On PHP 8.5, also turn off fatal error backtraces, which removes the producer in the confirmed mod_php case:

```ini
php_admin_flag[fatal_error_backtraces] = off
```

For mod_php put both in php.ini.

For 109618 PHP's main config mitigation is `memory_limit=-1`, which takes away the predictable per-request limit the exploit relies on. That trades one risk for another, because now a single request can eat the box's memory. If you do it, put a container or cgroup memory limit (`memory.max`) around the workers, ideally one per worker so the kernel kills a child and not the whole pool. Don't use `RLIMIT_AS` or `RLIMIT_DATA` for this. The advisory says those make `mmap()` fail and land you back in the vulnerable `longjmp()` path. Keep `post_max_size` small and lower `max_input_nesting_level` and `max_input_vars` too.

If performance doesn't matter for a pool, `pm.max_requests = 1` gives every request a fresh worker, so no stale state carries over. Expect a big CPU cost.

Clean up INI diagnostics. Any deprecated or invalid directive in `.htaccess`, Apache `php_value` lines, or `PHP_VALUE` passed from nginx can be the trigger for 109619. Move settings into php.ini or the pool config and delete obsolete ones. Make sure the FPM socket isn't reachable from the network, since a FastCGI client can pass `PHP_VALUE` and `PHP_ADMIN_VALUE` and undo all of the above.

Check through the SAPI that serves requests. `php -i` reads the CLI php.ini, so it only tells you about the CLI:

```bash
sudo systemctl reload php8.3-fpm
# dumps each pool's php_value / php_admin_value lines
sudo php-fpm8.3 -tt 2>&1 | grep -E 'upload_progress|fatal_error_backtraces|memory_limit'
```

For mod_php, or to be sure, serve a throwaway `phpinfo()` through each pool or vhost, check the Local Value column, and delete the file.

## Edge rules

PHP's 109618 advisory says to block multipart requests at the frontend if your app doesn't use them, and to enforce the request size there too. Sansec, ma.ttias.be and Patchstack suggested the same before the release. PHP lowercases the Content-Type before matching it, so match `multipart` case-insensitively anywhere in the header.

Nginx (the maps and `log_format` go in `http {}`, the rest in every server block that proxies to PHP):

```nginx
map $http_content_type $is_multipart {
    default          0;
    "~*multipart"    1;
}

# your real upload routes, matched as prefixes
map $uri $upload_ok {
    default          0;
    "~^/api/upload"  1;
}

map "$is_multipart:$upload_ok" $block_multipart {
    default          0;
    "1:0"            1;
}

log_format multipart '$time_iso8601 $remote_addr "$request" $status ct="$content_type" block=$block_multipart';

server {
    # ...
    # keep this at or below post_max_size
    client_max_body_size 8m;

    # a server-level access_log replaces the inherited one, so keep yours
    access_log /var/log/nginx/access.log;
    access_log /var/log/nginx/multipart.log multipart if=$is_multipart;

    # uncomment once the log shows nothing legit with block=1
    # if ($block_multipart) {
    #     return 403;
    # }
}
```

Run it with the `if` commented out for a few hours, then see which paths would have been blocked:

```bash
grep 'block=1' /var/log/nginx/multipart.log | awk '{print $4}' | sort | uniq -c | sort -rn
```

On WordPress the allowlist needs at least `/wp-admin/async-upload.php`, `/wp-admin/media-new.php`, `/wp-admin/update.php`, `/wp-json/wp/v2/media` and `/wp-admin/admin-ajax.php`, plus whatever your form plugins post to.

Apache 2.4, also a prefix match:

```apache
<If "req('Content-Type') =~ /multipart/i \
     && %{REQUEST_URI} !~ m#^/api/upload#">
    Require all denied
</If>
```

Both rules have gaps. They let `/api/upload/avatar` through, every allowlisted route still reaches the parser, and a proxy doesn't parse multipart the same way PHP does.

Cloudflare pushed [emergency rules](https://developers.cloudflare.com/changelog/post/2026-10-21-emergency-waf-release-cfmr/) on 21 Oct, [Free plan](https://developers.cloudflare.com/changelog/post/2026-10-21-emergency-waf-release-free/) included, and Knecht called them a stopgap. The setup in my [Cloudflare origin certificates post](/blog/infra/reverse_proxy) opens 80 and 443 to everyone, so a request sent straight to the origin skips those rules. Allow only [Cloudflare's IP ranges](https://www.cloudflare.com/ips/) at the origin firewall.

## Checking for compromise

[Huntress](https://www.huntress.com/blog/php2shell-leaked-critical-php-vulnerabilities) suggests alerting when php-fpm, php-cgi, httpd or apache2 spawn sh, bash, curl, wget, python or perl, and on `whoami`, `id` or `uname -a` running as the web user.

Both bugs need memory errors, fatal errors or crashes along the way, so the error logs are the place to start. The 109619 advisory lists what to look for: out-of-memory errors, fatal and parse errors, `Maximum execution time exceeded`, and warnings repeated before scripts run. It also warns that clean logs aren't proof, since a worker can die before PHP writes anything.

```bash
# out-of-memory and fatal errors
grep -E 'Allowed memory size of|PHP Fatal error|Maximum execution time' /var/log/php8.3-fpm.log /var/log/apache2/error.log
# worker crashes
grep -iE 'SIGSEGV|exited on signal 11' /var/log/php8.3-fpm.log
grep -i 'segmentation fault' /var/log/apache2/error.log
# PHP and config files written since the leak
sudo find /var/www /tmp /var/tmp -type f \( -name '*.php*' -o -name '*.phtml' -o -name '*.phar' -o -name '.htaccess' -o -name '.user.ini' \) -newermt '2026-10-20'
# cron entries for the web users
for u in www-data apache nginx; do sudo crontab -l -u "$u"; done
# WordPress admins, look for ones you didn't create
wp user list --role=administrator --fields=user_login,user_registered --path=/var/www/html
```

Default access logs record the method and path only, so an attack looks like any other POST. The `multipart.log` from the edge rule gives you the Content-Type from now on. A deploy since 20 Oct shows up in that `find` too, so compare against `git status` in the docroot or your last release. Look closely at any `.user.ini` or `.htaccess`, since they can set `auto_prepend_file` and run a file on every request.

Don't run the PoC repos on GitHub outside an isolated lab. Phoenix Security and Tenable warn they may be malicious.
