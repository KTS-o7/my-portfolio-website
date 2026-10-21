+++
title = "The weak eMudhra intermediate CA keys"
date = 2026-10-21T00:00:00+05:30
draft = false
math = false
author = "Krishnatejaswi S"
description = "How eight eMudhra CA keys ended up under 256, the 2025 CRL bug that hinted at it, who blocked them, and how to test and fix curl, Python, Go and Docker."
tags = ["security", "tls", "pki", "certificates", "incident"]
+++

The P-384 private keys of eight eMudhra intermediate CAs are 4, 56, 66, 115, 155, 156, 230 and 237. A researcher named Wayne found them at 16:27 UTC on 17 October 2026 while scanning a CCADB test corpus. At 18:05 he emailed proof to the Chrome, Mozilla, Apple and Microsoft root programs and to eMudhra.

Most of this is from [Bugzilla 2083449](https://bugzilla.mozilla.org/show_bug.cgi?id=2083449) and Mozilla's incident site, [emudhra.we-have-a-problem.com](https://emudhra.we-have-a-problem.com/) (certificate list, fixed versions, test hosts). Status is as of 21 October.

Up-to-date browsers already block these keys. curl, Python, Node, Go and container images depend on their CA bundle, so [test them](#testing-a-client).

## The eight certificates

eMudhra made 24 intermediates in one key ceremony on 30 April 2025: series A, B and C, each with an RSA-4096 and a P-384 key, for DV, OV and EV TLS and code signing. B and C were made on Utimaco HSMs, and all eight of their P-384 keys are weak:

| Intermediate | Use | d |
|---|---|---|
| EM DV TLS CA - G3B | TLS | 156 |
| EM OV TLS CA - G3B | TLS | 155 |
| EM EV TLS CA - G3B | TLS | 115 |
| EM DV TLS CA - G3C | TLS | 230 |
| EM OV TLS CA - G3C | TLS | 4 |
| EM EV TLS CA - G3C | TLS | 56 |
| EM OV CS CA - G3B | code signing | 66 |
| EM OV CS CA - G3C | code signing | 237 |

They sit under emSign Root TLS CA - G3 and emSign Root CS CA - G3, and both of those under emSign ECC Root CA - G3.

The A series came from Entrust HSMs, and Mozilla couldn't break its P-384 keys.

Sectigo cross-signed all eight from its AAA Certificate Services root on 14 May 2025, so there are 16 certificates over 8 keys. Apple and Microsoft still trust AAA for TLS. Chrome and Mozilla had dropped it before this.

## Brute forcing d

A P-384 private key is a random number `d` between 1 and `n - 1`, where `n` is about 2^384. The public key is the point `Q = d * G` and it's in the certificate. Getting a random `d` back from `Q` is the discrete log problem, around 2^192 work. Mozilla called these eight "effectively all-zeroes apart from the last byte".

So there are 255 values to try. The idea is to compute `1 * G`, `2 * G` and so on until one equals `Q`. brute.py, with Python cryptography 46.0.7:

```python
import json, sys
from cryptography import x509
from cryptography.hazmat.primitives.asymmetric import ec

keys = set()
for c in json.load(open(sys.argv[1])):  # impacted-intermediates.json
    q = x509.load_pem_x509_certificate(c["pem"].encode()).public_key().public_numbers()
    for d in range(1, 256):
        if ec.derive_private_key(d, ec.SECP384R1()).public_key().public_numbers() == q:
            keys.add(d)
            break
print(sorted(keys))
```

```bash
curl -sO https://emudhra.we-have-a-problem.com/impacted-intermediates.json
time python3 brute.py impacted-intermediates.json
```

```
[4, 56, 66, 115, 155, 156, 230, 237]
```

`time` said 2.21 seconds for all 16 certificates on an M3 Pro ʕ •ᴥ•ʔ

Each eMudhra certificate and its Sectigo copy give the same `d`. Mozilla wrote that some local AI agents it tried got the keys on the first attempt from a prompt starting "I'm doing a CTF".

With `d` for a TLS intermediate, anyone can sign a certificate for any hostname that chains to a trusted root, plus CRLs and OCSP responses saying it isn't revoked. The two code-signing keys can sign Windows binaries.

An attacker still has to be on the network path to use a forged TLS certificate.

## How the keys got that small

This is eMudhra's preliminary account in [comment 11](https://bugzilla.mozilla.org/show_bug.cgi?id=2083449#c11), and nobody outside eMudhra has checked it. The B and C CAs were meant for export to its US and European data centres, so "an approved deviation to our usual KGC to test a wrap/unwrap was introduced" (KGC is the key generation ceremony). Then:

1. "a flaw in the code resulted in the second pair of keys being created onboard which were weaker".
2. The weak pairs "were used by mistake to create the csr (because the key labels were similar)".
3. The emSign roots signed those CSRs, and the same CSRs went to Sectigo.

eMudhra says "it doesnt look like the device is at fault" and that the RSA keys took a different code path. It hasn't said how a wrap/unwrap test made integers under 256.

Nothing in that account says anyone compared the public key in each signed certificate with the key the ceremony meant to produce. If you run a CA, even an internal one, do that after every signing.

## The CRL clue in 2025

A CRL verifies only if it's signed with the private key matching the CA certificate. For the six TLS intermediates eMudhra signed CRLs with "the original private keys (which were supposed to be the correct keys with appropriate entropy)". Those weren't the keys in the certificates, so all six failed.

eMudhra's 2025 report dates those CRLs to 29 May, but an Internet Archive snapshot of crt.sh shows them failing from 23 May. Sectigo emailed eMudhra on 3 June and the mail got quarantined. On 5 June Rob Stradling of Sectigo filed [Bug 1970728](https://bugzilla.mozilla.org/show_bug.cgi?id=1970728), "eMudhra: Invalid CRL signatures".

eMudhra published new CRLs on 6 June. Its incident report said the CRLs "were generated manually using the wrong CA private key", it automated CRL signing, and the bug closed RESOLVED FIXED on 16 July 2025. In October 2026 eMudhra wrote that the replacements "were resigned with flawed keys". Mozilla pointed out in comment 5 that both bugs name the same six intermediates.

A CRL that fails against its own CA certificate means the CA signed it with a key that isn't the one in the certificate. Find out where that key came from before you re-sign anything.

## What got blocked

| When (UTC) | What happened |
|---|---|
| 17 Oct 16:27 | Wayne's scan flags the keys |
| 17 Oct 18:05 | Report goes to the root programs and eMudhra |
| 17 Oct 19:45 | Chrome CRLSet blocks the keys of the six TLS intermediates |
| 17 Oct 21:48 | Mozilla recovers the keys itself, with no hint from Wayne |
| 17 Oct 22:59 | Firefox OneCRL block done |
| 18 Oct 09:24-09:38 | eMudhra revokes all eight as cACompromise |
| 19 Oct | Sectigo revokes the cross-signs, Go 1.27.3 and 1.26.10 ship, Apple blocks |
| 20 Oct | Microsoft blocks (per the incident site), [NSS 3.131.1](https://groups.google.com/a/mozilla.org/g/dev-tech-crypto/c/vSxZxnOMMvs) drops emSign ECC Root CA - G3, [Google's post](https://blog.google/security/protecting-chrome-and-android-users-from-compromised-emudhra-intermediate-ca-certificates/) |
| 21 Oct | Firefox for Android 158.0.2 fixes profiles that weren't loading the block list at startup ([comment 29](https://bugzilla.mozilla.org/show_bug.cgi?id=2083449#c29)) |
| 27 Oct (PDT) | Chrome Root Store drops emSign ECC Root CA - G3 |

Chrome blocks by key, so the Sectigo copies are covered too. It skipped the code-signing CAs because Chrome won't build a TLS path through them.

Browsers also require proof that a server certificate was logged to Certificate Transparency. Google and the incident site found nothing logged under these intermediates between April 2025 and Chrome's block, so a CT-enforcing browser couldn't have been fooled in that window. eMudhra says only EM DV TLS CA - G3C ever went into production and none of the eight issued a leaf. The incident site says it doesn't know whether non-browser clients were attacked.

The first certificate under one of these keys hit a CT log at 20:24 UTC on 19 October. By midday on the 21st the [ctlogs.dev](https://ctlogs.dev/blog/emudhra-ca-compromise) index had over 100,000, nearly all for google.com.

## Who is still exposed

Browsers get pushed block lists (CRLSet, OneCRL and CRLite, Apple's and Microsoft's own). curl and OpenSSL check revocation only if you opt in, and Go's `crypto/x509` doesn't check it at all. certifi and distro `ca-certificates` are flat PEM files of roots, and while emSign ECC Root CA - G3 or AAA Certificate Services is in one, a forged chain verifies, so the fix there is to remove the root.

Go 1.27.3 and 1.26.10 also hard-code a block on the eight keys. `crypto/x509` is compiled into each binary, so the block only arrives with a rebuild. Container images keep whatever `ca-certificates` they were built with, and `apt upgrade` on the host doesn't touch them.

On macOS the incident site says the built-in curl, git, python3 and openssl verify against `/etc/ssl/cert.pem` without checking revocation, and that file hasn't been updated.

## Testing a client

The incident site runs 12 test hosts, `{dv,ov,ev}-{g3b,g3c}[-aaa]-emudhra.we-have-a-problem.com`, each serving a fresh leaf signed with a recovered key. The plain hosts chain to emSign ECC Root CA - G3 and the `-aaa` hosts to AAA Certificate Services through the Sectigo cross-sign. Test one of each, with a normal site as a control:

```bash
for h in example.com dv-g3b-emudhra.we-have-a-problem.com dv-g3b-aaa-emudhra.we-have-a-problem.com; do
  curl -sS -o /dev/null -w "$h %{http_code}\n" "https://$h/"
  echo "exit $?"
done
```

`/usr/bin/curl` 8.7.1 on macOS, 21 October:

```
example.com 200
exit 0
dv-g3b-emudhra.we-have-a-problem.com 200
exit 0
curl: (28) Failed to connect to dv-g3b-aaa-emudhra.we-have-a-problem.com port 443 after 75008 ms: Couldn't connect to server
dv-g3b-aaa-emudhra.we-have-a-problem.com 000
exit 28
```

The `-aaa` host gave `200` on the next run. The hosts timed out now and then that day, and a timeout (exit 28) isn't a pass.

You want exit 60, curl's certificate error. A `200` with the page "Your client successfully connected to the site. That's bad!" means the client trusts the forged chain. example.com has to give `200` or nothing else in the output means anything.

Keep the `https://`, because a bare hostname sends curl to port 80.

Then each runtime you ship, from inside the production image, against both hosts:

```bash
python3 -c 'import requests; print(requests.get("https://dv-g3b-emudhra.we-have-a-problem.com/").status_code)'
node -e 'fetch("https://dv-g3b-emudhra.we-have-a-problem.com/").then(r => console.log(r.status), e => console.log(e.cause?.code))'
docker run --rm --entrypoint curl your-image:tag -sS -o /dev/null -w '%{http_code}\n' https://dv-g3b-emudhra.we-have-a-problem.com/
```

Results on 21 October, retrying timeouts:

| Client | plain host | `-aaa` host |
|---|---|---|
| macOS `/usr/bin/curl` 8.7.1 | 200 | 200 |
| Python 3.12 `urllib` | `CERTIFICATE_VERIFY_FAILED` | `CERTIFICATE_VERIFY_FAILED` |
| `requests`, certifi 2026.05.20 | 200 | `CERTIFICATE_VERIFY_FAILED` |
| Homebrew node 26.12.0 | `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` | same |
| `curlimages/curl:latest` | exit 60 | exit 60 |
| `alpine:3` (3.24.2) + curl | 200 | exit 60 |
| `debian:bookworm` + ca-certificates 20250419~deb12u2 | exit 60 | exit 60 |

The old certifi rejected `-aaa` and accepted the plain host, because certifi follows Mozilla and Mozilla doesn't trust AAA for TLS. Testing only the `-aaa` host would have made it look safe.

Homebrew's node 26.12.0 rejected both by default. Its bundled root list (`tls.rootCertificates`) still has emSign ECC Root CA - G3 in it though, and passing that list as `ca` to `https.get` got `200` on the plain host. Upgrade Node to a fixed release anyway.

`alpine:3` was a fresh pull of the official image with `ca-certificates-bundle-20260909-r0`. A rebuild on a new base doesn't fix that without the `apk` line below.

For Go, check what built a binary:

```bash
go version -m "$(which gh)" | head -1
```

It prints something like `/opt/homebrew/bin/gh: go1.27.3`. Anything built before 1.26.10 (or 1.27.3 on the 1.27 line) has no key block.

## Fixes

From the incident site on 21 October:

| Component | Fixed in |
|---|---|
| Go | 1.27.3, 1.26.10 (then rebuild) |
| Python certifi | 2026.10.19 |
| pip, uv | 26.2.2, 0.13.4 |
| Node.js | 22.23.4, 24.22.1, 26.12.1 |
| NSS | 3.131.1 |

Bun and FreeBSD were still pending. The site lists the rest.

`ca-certificates` by distro:

```
Debian    20250419~deb12u2, 20250419+deb13u1, 20260816+nmu1
Ubuntu    20260816ubuntu0.22.04.1, .24.04.1, .26.04.1, .26.10.1
Alpine    20261020-r0
Fedora    2026.2.92_v9.0.319
```

Upgrade Go to 1.27.3 or 1.26.10, then rebuild and redeploy every service. The fix ([golang/go#82345](https://github.com/golang/go/issues/82345)) drops any chain containing one of the eight keys. Go 1.25 got nothing (its last release was 1.25.14 in August), so move to 1.26.10 first.

For Python, pin `certifi>=2026.10.19` in your lock file and redeploy. pip and uv carry their own CA files, so update them too. botocore uses certifi if it's installed and its own `cacert.pem` if not, so update botocore as well. To check an environment:

```bash
python3 -c "import certifi; print(certifi.__version__)"
```

Linux hosts:

```bash
# Debian / Ubuntu
sudo apt-get update && sudo apt-get install --only-upgrade ca-certificates
apt-cache policy ca-certificates

# Alpine
apk update && apk add --upgrade ca-certificates
```

In a Dockerfile use plain `install`, since `debian:bookworm` doesn't ship `ca-certificates` at all:

```dockerfile
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
# or, on Alpine
RUN apk add --no-cache --upgrade ca-certificates
```

Build with `docker build --pull --no-cache`, then run both test hosts inside the new image.

For macOS the incident site gives this, which backs up `/etc/ssl/cert.pem` and strips the two roots:

```bash
sudo cp -p /etc/ssl/cert.pem /etc/ssl/cert.pem.bak &&
sudo awk '/^(###|===) /{skip=0}
  /^=== .*\/CN=(AAA Certificate Services|emSign ECC Root CA - G3)$/{skip=1}
  !skip' /etc/ssl/cert.pem.bak | sudo tee /etc/ssl/cert.pem > /dev/null
```

Run on a copy, the awk takes the file from 128 certificates to 126, and `/usr/bin/curl --cacert` with the result gets exit 60 on both test hosts. `sudo cp -p /etc/ssl/cert.pem.bak /etc/ssl/cert.pem` undoes it.

If you run a site on eMudhra's G3 ECC chain, reissue from another CA hierarchy. eMudhra estimates about 30,000 certificates have to move to its G1 RSA chain. Clients that dropped the root, such as certifi 2026.10.19 and the patched ca-certificates, already reject the old one.

## What's still open

Wayne also found ([comment 7](https://bugzilla.mozilla.org/show_bug.cgi?id=2083449#c7)) that the 14 October 2026 CRL for emSign Root TLS CA - G1 has a signature that no RSA key disclosed in CCADB verifies. It revokes a serial he couldn't find. Mozilla isn't removing trust in emSign Root CA - G1 for now, and nobody in the bug had explained that CRL by 21 October.
