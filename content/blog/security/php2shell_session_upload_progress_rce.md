+++
title = "Patching and mitigating PHP2Shell"
date = 2026-10-21T18:00:00+05:30
draft = false
math = false
author = "Krishnatejaswi S"
description = "The PHP2Shell leak timeline, what is confirmed, who is exposed, config and proxy mitigations, patch steps and compromise checks for PHP servers."
tags = ["security", "php", "php-fpm", "cve", "incident"]
+++

Status as of 13:05 UTC, 21 Oct: no fix is out. PHP's [release feed](https://www.php.net/releases/feed.php) still lists 8.5.11, 8.4.26, 8.3.35 and 8.2.34 from 24 Sep, and the release is due at 14:00 UTC. Check php.net before you act on any version number below.

Two PHP bugs rated CVSS 9.2 leaked on Hacker News on 20 Oct. PHP announced them that evening and set the release for 14:00 UTC the next day. Patch as soon as it lands. Until then I'd turn off `session.upload_progress.enabled` and reject multipart bodies at the proxy on routes that don't take uploads. Neither is a fix.

## Timeline

All times are UTC.

- 20 Oct, 15:20: Hacker News user petecooper posts ["Tell HN: 2x PHP RCE CVEs with CVSS 10.0 Incoming"](https://news.ycombinator.com/item?id=50167754), citing "a reliable source" ("source: trust me, bro"). It names CVE-2026-109618 and CVE-2026-109619, says PHP 5 onwards is affected and puts the announcement at 22 Oct 18:00 CEST. The poster [later wrote](https://news.ycombinator.com/item?id=50176946) that the source "lied when I asked if it was under responsible disclosure/co-ordinated disclosure".
- 20 Oct, afternoon: watchTowr tells [BleepingComputer](https://www.bleepingcomputer.com/news/security/php-warns-admins-of-two-critical-flaws-emergency-patches-coming-tomorrow/) the leak is real and that they reproduced CVE-2026-109618.
- 20 Oct, 19:32: Jakub Zelenka posts PHP's [advance notice](https://externals.io/message/132883). Two vulnerabilities, "both rated CVSS v4.0 9.2", release on Wednesday 21 Oct at 14:00 UTC (earlier if details go public). That's a day ahead of the leaked date.
- 21 Oct, 07:34: [Patchstack](https://patchstack.com/articles/php-major-vulnerability-alert-10-2026/) reports "multiple active exploitation incidents" from hosting partners, with no IoCs.
- 21 Oct, 07:43: Cloudflare CTO Dane Knecht says they're "seeing early attacks emerging" (quoted by Tenable).
- 21 Oct, 09:18: [Aikido](https://www.aikido.dev/blog/critical-vulnerabilities-in-php-php2shell) reports exploitation in the wild.

At 13:05 UTC php-src had no new [security advisories](https://github.com/php/php-src/security/advisories) and no fixed release tags. CVE.org's API showed both IDs as `RESERVED` with no record, NVD returned zero results, the Debian tracker had no page for them and neither ID was in CISA's KEV feed. Plan as if attacks have started.

## What's confirmed

PHP's notice doesn't name CVE IDs, a component or affected versions. The IDs come from the HN post, and [CERT-EU advisory 2026-018](https://www.cert.europa.eu/publications/security-advisories/2026-018/) uses them too. CERT-EU reads 9.2 as possible unauthenticated RCE that "could affect all PHP versions from PHP 5 onwards". The name PHP2Shell comes from leaked exploit material credited to Calif.IO and LCFR ([Tenable's FAQ](https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote) has the details). watchTowr says both bugs are RCEs. The root cause below comes from third parties and from reading php-src.

## What runs before your script

Take a WordPress site where `/wp-admin/` needs a login cookie. A multipart POST there with no cookie still has its whole body parsed before WordPress is loaded. In [`main/main.c`](https://github.com/php/php-src/blob/PHP-8.4/main/main.c), request startup builds the superglobals, and building `$_POST` for `multipart/form-data` runs the multipart parser in [`main/rfc1867.c`](https://github.com/php/php-src/blob/PHP-8.4/main/rfc1867.c). ext/session has hooked a callback into that parser (`php_session_rfc1867_callback` in [`session.c`](https://github.com/php/php-src/blob/PHP-8.4/ext/session/session.c)) to track upload progress. Only after that does PHP run each extension's per-request setup and compile your script.

That means anything written in PHP, auth checks and framework middleware included, runs after the parser is done. `disable_functions` doesn't help either, since it blocks userland calls and the parser is C. [Sansec](https://sansec.io/research/php2shell) says the attack lands before app code runs, and the [PHP manual](https://www.php.net/manual/en/session.upload-progress.php) says upload progress information "is written to the session before any scripts are executed". `session.upload_progress.enabled` is on by default, so the hook runs whether or not your app ever calls `session_start()`.

## Geek fact

Upload progress came from Arnaud Le Blanc's [2008 RFC](https://wiki.php.net/rfc/session_upload_progress) and shipped in PHP 5.4. If the bugs do live in this hook, 5.0 to 5.3 wouldn't have them, whatever the leak said about PHP 5. It's had a memory bug before ([CVE-2020-7062](https://cveawg.mitre.org/api/cve/CVE-2020-7062), a NULL pointer dereference fixed in 7.4.3).

## The upload progress theory

The theory most posts repeat is a heap use-after-free in this callback (C code frees memory while something still holds a pointer to it). Its most detailed source is a writeup on jackalsyn.com, and I'm not linking it because it ships exploit code. Its first chain was a cached pointer to the progress array that outlived the array. On 21 Oct jackalsyn's author added a "CORRECTED FINDINGS (2026-10-21)" section that calls that chain "DEAD". A reference is taken before the array could be freed, so it never is.

What's left is a use-after-free in ext/standard's serializer state (`var.c:756`) that carries over from one request to the next in the same process. They rate it CVSS 5.3, "NOT code execution", and say it only reaches prefork servers (Apache with mod_php, PHP's built-in server). Their SAPI table says php-fpm, CGI and LiteSpeed workers exit when request startup fails, so no second request picks up the stale state.

[Phoenix Security](https://phoenix.security/php-core-rce-cve-2026-109618-109619-critical-remote-code-execution/) calls the step from use-after-free to RCE "asserted, not demonstrated". [GMO Flatt Security](https://blog.flatt.tech/entry/php2shell) relays the original researcher's demo, which targets Ubuntu 26.04's packaged PHP 8.5.4 under Apache prefork with mod_php, and the researcher's claim that it reproduces on php-fpm, WordPress, Laravel and Symfony too. Flatt's own read is that it's tied to session handling.

Treat the session.c root cause as unconfirmed until PHP publishes.

## Am I exposed

If the bugs sit in the body parsing path, any URL that ends up running PHP is in scope: GET-only routes, 404 pages handled by `index.php`, routes behind a login. The body is parsed before your router sees the method. Static files nginx serves itself aren't. PHP hasn't confirmed any of this.

Commands from here on use Debian/Ubuntu names. On RHEL-family the binary and service are `php-fpm` and pools live in `/etc/php-fpm.d/`.

- Check the version the web server runs (`php-fpm8.3 -v`, or `phpinfo()` through the pool). `php -v` is the CLI binary and can differ.
- The hook needs the session extension, which is built in by default. Check with `php-fpm8.3 -m | grep -x session`.
- CLI and cron scripts don't parse request bodies, so this path doesn't reach them.
- Treat FPM, mod_php and CGI as exposed. jackalsyn's prefork-only result is for its smaller, non-RCE bug, and the researcher claims a php-fpm reproduction.

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

Only 8.2 to 8.5 are [supported](https://www.php.net/supported-versions.php), so those are the branches to expect fixes for. The versions going around are 8.5.12, 8.4.27, 8.3.36 and 8.2.35 (Kevin Beaumont, via Tenable), but PHP hasn't confirmed them. If you're on 8.2, plan the move to 8.3 or later while you patch, since 8.2 has about ten weeks of security support left.

For 8.1 and older there's no upstream fix. Distros can backport without changing the version string (Ubuntu 22.04 ships 8.1.2), and [CloudLinux](https://blog.cloudlinux.com/php-cve-2026-109618-and-cve-2026-109619) says alt-php backports are being prepared. Otherwise move to a supported branch, or take the host off the public internet (VPN, IP allowlist) as CERT-EU advises.

## Config switches

PHP's developers say no setting fixes this. Joe Ferguson said "ini settings won't save you" and Gina Peter Banyard said "the only mitigation is patching / upgrading PHP" (both quoted by Tenable). Aikido names `session.upload_progress.enabled = Off` as a setting that doesn't protect, and Flatt expects it to reduce the risk, not stop the attack.

I'd still turn off upload progress today. Nothing breaks unless your app reads upload progress from `$_SESSION` (grep your code for `PHP_SESSION_UPLOAD_PROGRESS` and `upload_progress`). With it off, the callback hands each event to the callback it replaced and returns, so none of the session code runs. The parser in `rfc1867.c` still runs on every multipart POST, so this won't help if the bug is there.

The setting is `PHP_INI_PERDIR`, so `ini_set()` can't change it. Set it in php.ini, or lock it per FPM pool:

```ini
; /etc/php/8.3/fpm/pool.d/www.conf, repeat for every pool
php_admin_flag[session.upload_progress.enabled] = off
```

Neither `.user.ini` nor the app can override a `php_admin_*` value. For mod_php use php.ini, or `php_flag session.upload_progress.enabled off` in `.htaccess` if `AllowOverride` allows it.

Reload, then check through the SAPI that serves requests. `php -i` reads the CLI php.ini, so it only tells you about the CLI:

```bash
sudo systemctl reload php8.3-fpm
# dumps each pool's php_value / php_admin_value lines
sudo php-fpm8.3 -tt 2>&1 | grep upload_progress
# CLI only
php -i | grep session.upload_progress.enabled
```

For mod_php, or to be sure, serve a throwaway `phpinfo()` through each pool or vhost, check that the Local Value is Off, and delete the file.

I wouldn't use `file_uploads = Off`. It breaks uploads on every route, and [ma.ttias.be](https://ma.ttias.be/php-cve-2026-109618-early-mitigation/) lists it as "not likely to help". In `rfc1867.c` it only makes the parser skip file parts, so the progress array and the periodic session writes never happen. The parser still reads every form field, and the session callback still runs at the start and end of the body. Bad trade on most sites.

`enable_post_data_reading = Off` stops the automatic multipart parse but leaves `$_POST` and `$_FILES` empty, so it only suits pools that take JSON and nothing else.

While you're in the FPM config, make sure the socket isn't reachable from the network. A FastCGI client can pass `PHP_VALUE` and `PHP_ADMIN_VALUE`, so anyone who can reach the socket can undo all of the above.

## Edge rules

Sansec, ma.ttias.be and Patchstack all suggest rejecting multipart bodies on routes that don't take uploads. PHP lowercases the Content-Type before matching it, so match `multipart` case-insensitively anywhere in the header.

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

Both rules have gaps. They let `/api/upload/avatar` through, every allowlisted route still reaches the parser, and a proxy doesn't parse multipart the same way PHP does. Keep upload progress off as well. After the change, POST a real file to each allowlisted route.

Cloudflare pushed [emergency rules](https://developers.cloudflare.com/changelog/post/2026-10-21-emergency-waf-release-cfmr/) on 21 Oct, [Free plan](https://developers.cloudflare.com/changelog/post/2026-10-21-emergency-waf-release-free/) included. They don't name a CVE or mention multipart, and Knecht called them a stopgap. The setup in my [Cloudflare origin certificates post](/blog/infra/reverse_proxy) opens 80 and 443 to everyone, so a request sent straight to the origin skips those rules. Allow only [Cloudflare's IP ranges](https://www.cloudflare.com/ips/) at the origin firewall.

## Patching

Patch as soon as the release is on php.net, and take the fixed versions from there, not from this post. For distro packages, look for the CVE IDs in the package changelog, because a backport keeps the old version string:

```bash
apt changelog php8.3-fpm | grep -E 'CVE-2026-10961(8|9)'
rpm -q --changelog php-fpm | grep -E 'CVE-2026-10961(8|9)'
```

These IDs come from the leak and CERT-EU. If PHP's release notes list different ones, grep for those. Sansec says Remi's repo won't have fixes on 21 Oct, so don't plan around it for day 0.

Then restart every FPM master, Apache if you use mod_php, and any long-running workers (FrankenPHP, RoadRunner, Swoole). Old workers keep the old code. Compare the master's start time with the package install time:

```bash
ps -eo pid,lstart,cmd | grep '[p]hp-fpm: master'
grep ' upgrade php' /var/log/dpkg.log | tail -3
# RHEL-family
rpm -q --last php-fpm
```

For Docker, pull the new base image, rebuild, redeploy and run `php -v` inside the running container.

## Checking for compromise

[Huntress](https://www.huntress.com/blog/php2shell-leaked-critical-php-vulnerabilities) suggests alerting when php-fpm, php-cgi, httpd or apache2 spawn sh, bash, curl, wget, python or perl, and on `whoami`, `id` or `uname -a` running as the web user.

Default access logs record the method and path only. An attack looks like any other POST. List the paths that got POSTs and look for ones that never should:

```bash
awk '$6 == "\"POST" {print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -30
```

The `multipart.log` from the edge rule gives you the Content-Type from now on. Then check for crashes, new files, cron entries and admin accounts:

```bash
# FPM and Apache worker crashes
grep -iE 'SIGSEGV|exited on signal 11' /var/log/php8.3-fpm.log
grep -i 'segmentation fault' /var/log/apache2/error.log
# PHP and config files written since the leak
sudo find /var/www /tmp /var/tmp -type f \( -name '*.php*' -o -name '*.phtml' -o -name '*.phar' -o -name '.htaccess' -o -name '.user.ini' \) -newermt '2026-10-20'
# cron entries for the web users
for u in www-data apache nginx; do sudo crontab -l -u "$u"; done
# WordPress admins, look for ones you didn't create
wp user list --role=administrator --fields=user_login,user_registered --path=/var/www/html
```

A deploy since 20 Oct shows up in that `find` too, so compare against `git status` in the docroot or your last release. Look closely at any `.user.ini`, since it can set `auto_prepend_file` and run a file on every request.

Don't run the PoC repos on GitHub outside an isolated lab. Phoenix Security and Tenable warn they may be malicious.
