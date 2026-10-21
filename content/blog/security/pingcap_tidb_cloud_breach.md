+++
title = "PingCAP's TiDB Cloud breach"
date = 2026-10-21T00:00:00+05:30
draft = false
math = false
author = "Krishnatejaswi S"
description = "What PingCAP confirmed about the TiDB Cloud breach, what FulcrumSec claims, why nothing alerted, what customers should rotate, and GCP and Azure checks."
tags = ["security", "incident", "tidb", "cloud", "secrets"]
+++

FulcrumSec, an extortion group, put PingCAP / TiDB Cloud on its leak site on Oct 19 and claims 10.6 TB across 4,901,203 files. PingCAP posted a [Security Update](https://www.pingcap.com/trust-hub/security/security-update-october-2026/) on its Trust Hub the same day. It confirms an intrusion over the same weeks but doesn't name FulcrumSec, and most of the leak post's big numbers aren't in it. I'm writing this on Oct 21, so parts of it will be out of date soon.

Last year in the [MySQL CAP post](/blog/systems/why_mysql_is_not_CA) I named CockroachDB and TiDB as the usual picks for partition-tolerant systems. Nothing confirmed so far touches the TiDB engine. What got hit is TiDB Cloud, PingCAP's hosted service.

## What PingCAP confirmed

The update says "Between September 9 and October 7, 2026, an unauthorized party used stolen service account credentials" to get into "certain PingCAP internal systems", copy data and obtain source code. The exported records were TiDB Cloud user names and emails, org and project associations, SQL editor text and errors, some org, project and cluster IDs, a table of encrypted API-key values, and billing data (contacts, contract terms, orders, pricing, payment terms). PingCAP says there's "no evidence that data stored in TiDB was impacted".

It hasn't said which customers. It promises direct notices "once we have established customer-specific impact". As of Oct 21 I haven't seen any public word that they went out.

I'd assume every TiDB Cloud account is in it until PingCAP says otherwise. Open-source TiDB with no PingCAP contract isn't in anything confirmed. A support contract puts your contacts and contract terms in the billing export, and the support-ticket part below applies to you too.

SQL Editor history lives on PingCAP's side. Any secret you ever typed into a query there needs rotating. If those queries held your users' personal data, that's a GDPR question for you as the controller.

An external firm reported four vulnerabilities on Oct 12-13, all fixed by Oct 14. The update doesn't say where they were or whether they were used, and it still names stolen credentials as the way in. PingCAP's Chinese statement, as [Odaily](https://www.odaily.news/zh-CN/newsflash/526125) reported it on Oct 21, says "some internal operational data" (部分内部经营数据) and no product vulnerability.

The planned work includes "alerts for unusual access and large data exports". I read that as no export alerts in September.

## What FulcrumSec claims

Everything here comes from the leak post only. I'm not linking it.

FulcrumSec says GCP service-account keys and an Azure service principal (Azure's login for apps and scripts) were "committed in their own repositories". It doesn't say whether those repos were public or private. It claims 413 private repos, 377,446 Jira issues, 20,645,574 SQL statements from the SQL Editor and Chat2Query (PingCAP's AI SQL feature), and records for 180,046 tenant orgs.

On API keys the two sides contradict each other. PingCAP says the table held encrypted values, and the one investigator-owned value its firm tested "could not be used directly as an API key". The leak post says 115,308 plaintext keypairs, 42,612 of them active, and blames a static IV and one shared secret in a crypto library in the code. PingCAP confirms source code was taken, so I wouldn't lean on the encryption.

The post also lists "cluster credentials" and changefeeds among the control-plane tables it exported, plus about 1,800 database connection strings with passwords in them.

FulcrumSec says it "stood up a replication feed" of the control-plane database (it calls it metadb) and re-exported every table about every six hours from Sep 8 to Sep 30, 88 times, with "not one detection event". The last export was at 06:02 UTC on Sep 30. I checked whether the count fits:

```text
88 exports means 87 gaps.
87 x 6h = 522h, which is 21 days and 18 hours.
06:02 on Sep 30 minus 21d 18h = 12:02 on Sep 8.
```

That lands on the Sep 8 the leak post gives, a day before PingCAP's window opens.

10.6 TB is the number I trust least. If each of the 88 exports was a full copy, a lot of it could be the same tables stored many times over, and the post doesn't say whether it counted them once. On [Hacker News](https://news.ycombinator.com/item?id=50173716) one commenter read it as "a leak of every possible piece of metadata but not an actual leak of customer data", then added that the SQL logs do contain customer data.

The leak post links a first batch of 128.3 GiB compressed as torrents (I haven't checked what's in it), and says credential owners "will be hearing from us soon". Don't download it to check whether you're in it. It reportedly holds live credentials and personal data.

The post names a lot of companies, Booking.com, Shopee and Capcom among them. Most appear only in what it calls a 94-name billing dictionary, and none is a confirmed victim. Bitget is the one that has responded. Per [TechFlow](https://www.techflowpost.com/en-US/newsletter/140659), its Greater China head Xie Jiayin said on X on Oct 20 that Bitget only kept some public trade logs on TiDB Cloud, had stopped using it more than two months earlier, and no user data or passwords leaked.

It also claims PingCAP's BigQuery held a purchased reo.dev developer dataset (built from GitHub and LinkedIn activity) with 24,932 personal emails. You can be in that kind of dataset without ever being a PingCAP customer. Expect phishing that knows where you work.

## Why nothing alerted

Neither side describes the whole chain, so this part is my reading of the two accounts.

A GCP service-account JSON key works for whoever holds the file, from any machine. It's built for scripts, so there's no MFA prompt. On GCP what mostly blocks it is VPC Service Controls with IP-based access levels. An Azure client secret works the same way. If the keys sat in the repos FulcrumSec took, getting the code and getting the cloud keys may have been one event. Google auto-disables service-account keys it detects in public repos (it doesn't promise to catch all of them), so private repos fit the claim better.

On Oct 10 PingCAP removed "excessive permissions between cloud projects" without saying whose. That suggests some identities, maybe the stolen ones, reached further across projects than they should have.

PingCAP doesn't say how the exports ran, and the leak post only calls it a replication feed. On GCP a scheduled dump is often a Cloud SQL export or a BigQuery extract job into a bucket, run by a service account. With a real key it looks like the automation the key was made for. You'd only spot it by baselining where and when each identity normally calls from.

Google's [audit log docs](https://docs.cloud.google.com/logging/docs/audit/configure-data-access) say Data Access logs are "disabled by default for all services but some BigQuery services". Cloud SQL's [audit log reference](https://docs.cloud.google.com/sql/docs/mysql/audit-logging) lists `cloudsql.instances.export` as a Data Access (DATA_READ) entry. So a Cloud SQL export leaves no audit record unless someone turned that on. Cloud Storage object reads aren't logged by default either, and that's where the copied files get pulled from.

PingCAP turned on extra storage access logging in an affected project on Oct 10, three days after it found out. My guess is the downloads from that project left no record.

## Support tickets and the SQL Editor

PingCAP says the attacker's "claims about credentials in support materials have not been verified."

The slow-query log keeps query text with its literals. If your app writes a credential in SQL, like this:

```sql
UPDATE integrations SET aws_secret = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY' WHERE id = 42;
```

then a slow-query log attached to a ticket carries that secret, and so does SQL Editor history if someone ran it there. A BR (backup and restore) log can carry the storage config the same way.

Pull your PingCAP ticket attachments into one folder and grep them for key prefixes:

```bash
# AWS long-lived and STS keys, GitHub PATs, OpenAI/Anthropic-style keys
grep -rEoh 'AKIA[0-9A-Z]{16}|ASIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{22,}|sk-[A-Za-z0-9_-]{20,}' \
  ./pingcap-attachments | sort -u
```

The leak post claims these, from tickets going back to 2023:

- An AWS key pair in a 2023 ticket, for a PingCAP-prefixed log bucket named after one customer.
- An IAM user key with AdministratorAccess in a BR config line, reaching 258 S3 buckets, none of them PingCAP's.
- 38 presigned S3 URLs into one customer bucket.
- A 314 MB slow-query log with 8,027 credential values, including 7,485 AWS STS key sets, 192 AI-platform keys, one AWS root key pair and one GitHub token with admin scopes over 1,701 repos.

Most of the 8,027 are dead by now. STS credentials last 36 hours at most for the common STS calls, GitHub user-to-server tokens last 8 hours when the app has token expiry on, and a SigV4 presigned URL lasts 7 days at most. AWS access keys (`AKIA` prefix, root included) don't expire, and AI-platform keys work until someone revokes them. Rotate those first.

On self-hosted TiDB, `SET GLOBAL tidb_redact_log = ON;` logs `INSERT INTO t VALUES (1,2)` as `INSERT INTO t VALUES (?,?)`. The [docs](https://docs.pingcap.com/tidb/stable/system-variables/#tidb_redact_log) say it isn't applicable to TiDB Cloud. There, scrub a log before you attach it, and keep credentials out of SQL literals.

## What TiDB Cloud customers should do

PingCAP's [customer actions](https://www.pingcap.com/trust-hub/security/customer-actions-october-2026/) page (Oct 20) only asks for API key rotation and care with phishing. I'd do the rest too, since the support-ticket claims aren't ruled out.

### API keys

A management API key carries a role and drives the TiDB Cloud API. The [Terraform provider](https://github.com/tidbcloud/terraform-provider-tidbcloud/tree/main/docs/resources) runs on that API, and its resources cover a Dedicated cluster's root password and IP access list, SQL users, backups and restores, and exports to an S3, GCS or Azure Blob URI.

In Organization Settings > API Keys, create a new key and copy the private key, since the console shows it only once. Grep your repos, CI secrets and Terraform config for the old public key. Move each integration to the new key, confirm it works, then delete the old one. Repeat in every organization you own.

If you suspect a key was misused, revoke it first and email security@pingcap.com, with no secrets in the email.

### AWS keys you gave support

Nobody outside knows yet whether the ticket attachments are in the first batch. Treat any shared key as compromised. Check what it did, then replace it, from the account that owns it:

```bash
aws iam get-access-key-last-used --access-key-id AKIAOLDKEYEXAMPLE

# management events for that key, per region, last 90 days
for r in $(aws ec2 describe-regions \
    --query 'Regions[].RegionName' --output text); do
  echo "== $r"
  aws cloudtrail lookup-events --region "$r" \
    --lookup-attributes \
      AttributeKey=AccessKeyId,AttributeValue=AKIAOLDKEYEXAMPLE \
    --query 'Events[].[EventTime,EventName,EventSource]' --output text
done

# prints 1 if the account has a root access key, should be 0
aws iam get-account-summary --query 'SummaryMap.AccountAccessKeysPresent'
```

`lookup-events` doesn't show S3 object reads. You'll only have those if CloudTrail data events or S3 server access logs were on for that bucket. The tickets go back to 2023, so if you keep a trail in S3, query it from the day you first shared the key.

Revoke GitHub tokens and LLM keys that could have been in a query or attachment, and check each provider's usage page.

### Database passwords and changefeeds

The connection-string and "cluster credentials" claims are unverified, but they're why I'd rotate database user passwords too, root included:

```sql
ALTER USER 'app_user'@'%' IDENTIFIED BY 'a-new-long-random-password';
```

A [changefeed](https://docs.pingcap.com/tidbcloud/changefeed-overview/) streams row changes from a Dedicated cluster to Kafka, MySQL or cloud storage, and its sink config can hold credentials. Open the Changefeed page on each Dedicated cluster, check every sink is yours, and rotate what each one uses. An IAM role ARN for S3 sinks and BR backups leaves no static key to leak.

### Console audit logging and phishing

TiDB Cloud [console audit logging](https://docs.pingcap.com/tidbcloud/tidb-cloud-console-auditing/) is off by default. An Organization Owner or Organization Console Audit Manager can turn it on, and it keeps 90 days. It won't show September. Turn it on now. From here on it logs CreateAPIKey, SetRootPassword, UpdateIPAccessList and OpenWebSQLConsole, though not changefeed changes.

Put clusters behind IP access lists or private endpoints, since your CIDRs and client IPs may be out. Whoever handles billing should expect phishing that quotes your real contract terms.

## Checks on your own GCP and Azure

These apply to any GCP or Azure setup. List the user-managed service-account keys in every project:

```bash
for p in $(gcloud projects list --format='value(projectId)'); do
  for sa in $(gcloud iam service-accounts list \
      --project="$p" --format='value(email)'); do
    echo "$p $sa"
    gcloud iam service-accounts keys list \
      --iam-account="$sa" --project="$p" --managed-by=user
  done
done
```

Then block new keys at the org level and move callers to workload identity federation (your CI proves who it is with its own OIDC token, so there's no key file to leak). Orgs created on or after May 3, 2024 already enforce this, so check first:

```bash
gcloud resource-manager org-policies describe \
  iam.disableServiceAccountKeyCreation \
  --organization=123456789012 --effective

gcloud resource-manager org-policies enable-enforce \
  iam.disableServiceAccountKeyCreation --organization=123456789012
```

Existing keys stay valid. Any pipeline or Terraform that creates keys will start failing, so find those first.

On Azure, list app registrations with client secrets, then each one's expiry dates:

```bash
az ad app list --all \
  --query '[?length(passwordCredentials) > `0`].{name:displayName, appId:appId}' \
  -o table

az ad app credential list --id <appId> \
  --query '[].{name:displayName, expires:endDateTime}' -o table
```

Then check the service principal sign-ins in the Entra sign-in logs for IPs you don't know.

A key deleted in a later commit is still in the git history and every clone. Rotate any key that was ever committed, and scan the history:

```bash
trufflehog git file://.
```

To log Cloud Storage object reads, go to IAM & Admin > Audit Logs, pick Cloud Storage, and tick Data Read and Data Write. Do the same for Cloud SQL. `gcloud projects set-iam-policy` works too, but it replaces the whole policy, so a stale copy can wipe everyone's access. Diff before you set it.

BigQuery logs its job inserts by default, so you can alert on extract jobs started by a service account without turning anything on. In Logs Explorer:

```text
protoPayload.methodName="google.cloud.bigquery.v2.JobService.InsertJob"
protoPayload.metadata.jobInsertion.job.jobConfig.type="EXPORT"
protoPayload.authenticationInfo.principalEmail:"iam.gserviceaccount.com"
```

Once Cloud SQL Data Read logs are on, `protoPayload.methodName="cloudsql.instances.export"` catches its exports the same way.
