Nice — here’s a compact, exam-friendly **breakdown of AWS “encryption at rest”** you’ll want to know for the AWS Certified Developer (and for real-world systems). I’ll cover the principals (KMS, key types, envelope/client-side) then the important services (S3, EBS, EFS, RDS/Aurora, DynamoDB, Redshift, ElastiCache, Secrets Manager / SSM). I’ll call out default behaviors, configuration choices, pros/cons, and quick tips you can use in the console/CLI.

# Key concepts (short)

**AWS KMS (Key Management Service)** — central to most server-side encryption at rest in AWS. You can use:

* **AWS owned keys** (owned/managed by the AWS service; no extra config/charges).
* **AWS managed keys** (a KMS key in your account named like `aws/<service>`; KMS charges apply).
* **Customer managed CMKs** (you create/manage the key + policy; can rotate; best for control/audit).
  KMS uses envelope encryption (generates data keys, encrypts them with the CMK). ([AWS Documentation][1])

**Key properties to know**

* **Symmetric vs asymmetric:** Most AWS service integrations require symmetric KMS keys.
* **Automatic data key generation (envelope encryption):** Services ask KMS for data keys — they get stored encrypted alongside the data.
* **Rotation & audit:** You can enable automatic rotation for customer-managed CMKs and audit KMS calls with CloudTrail.
* **Least privilege & key policy:** Use grants and key policies to tightly scope who/what can use keys.

**Client-side vs server-side**

* **Server-side (SSE)** – service encrypts data as it writes to disk. Simpler to use.
* **Client-side** – you encrypt before sending data (use AWS Encryption SDK) — gives you full key control but adds complexity.

---

# S3 — Server-side encryption options (quick)

* **SSE-S3 (S3 managed keys)**: Amazon manages keys (SSE algorithm AES-256). Simple, no KMS calls. Good for “encrypt at rest” box-checking. ([AWS Documentation][2])
* **SSE-KMS**: S3 requests KMS to generate/unwrap data keys (you can choose AWS-managed or customer-managed CMK). Provides audit records in CloudTrail, key policy control, and IAM integration. Good default for production. ([AWS Documentation][2])
* **SSE-C (customer-provided keys)**: You provide the key in each request — S3 will use it but does not store it. If you lose the key, objects are unrecoverable. ([AWS Documentation][2])

**How to enforce**: set **Bucket Default Encryption** (console) and/or a bucket policy that denies `PutObject` without appropriate `x-amz-server-side-encryption` header.

**Tip:** use SSE-KMS with a CMK when you need audit/centralized key control and rotation.

---

# EBS (Elastic Block Store)

* **Encryption at rest available** for volumes and snapshots. EBS uses KMS to manage keys and does envelope encryption (unique data key per volume, encrypted with the KMS key). You can specify a **customer-managed CMK** or use the default AWS-managed key. ([AWS Documentation][3])
* **Encryption by default** can be enabled at the account/region level so all new EBS volumes are encrypted automatically.
* **Snapshots:** encrypted snapshots remain encrypted; copying snapshots can re-encrypt with another key if requested.

**Tip:** enable EBS encryption by default for the account to reduce accidental unencrypted volumes.

---

# EFS (Elastic File System)

* **EFS supports encryption at rest** using AES-256 and integrates with KMS for key management. EFS uses AWS-managed keys for metadata and can use a customer-managed key for file system data encryption. ([AWS Documentation][4])
* **Enable at creation time** (or when configuring replication) and provide the KMS key ARN if you want a CMK.

---

# RDS & Aurora (All engines)

* **RDS encryption at rest is supported for all DB engines** (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora). When enabled, storage, automated backups, read replicas, and snapshots are encrypted. Uses KMS (AWS-managed or customer-managed CMKs). Note: encryption must be enabled at **DB instance creation** — you can’t toggle encryption on an existing unencrypted instance without snapshot/restore flow. ([AWS Documentation][5])
* **Oracle** has an alternative (TDE) for some use cases — check licensing and feature differences (TDE vs KMS). ([Amazon Web Services, Inc.][6])

**Tip:** create encrypted snapshots and restore to new encrypted DB if you must convert an existing DB to encrypted.

---

# DynamoDB

* **Encryption at rest enabled automatically** and integrates with KMS. By default DynamoDB uses an **AWS owned key** (`aws/dynamodb`), but you can switch tables/account to use **AWS managed** or **customer-managed CMKs** for more control/audit. ([AWS Documentation][7])

**Tip:** use a customer-managed CMK when you need to revoke access or get granular CloudTrail logs for key usage.

---

# Amazon Redshift

* **Redshift encrypts data at rest** (AES-256) and uses KMS for key management. You can use AWS KMS or an HSM (hardware security module) for the root key. Encryption covers data on disks and snapshots/backups. ([AWS Documentation][8])

---

# Amazon ElastiCache (Redis / Memcached)

* **Redis:** supports both in-transit and at-rest encryption (enable when you create the replication group; AtRestEncryptionEnabled true). Uses KMS CMKs. ([AWS Documentation][9])
* **Memcached:** at-rest encryption historically was limited; recent updates add encryption support for newer Memcached versions / serverless cases — read the service docs before relying on it for memcached. (Memcached encryption support varies by engine version and deployment mode.) ([AWS Documentation][10])

**Tip:** for cache workloads that require encryption and authentication, choose ElastiCache for Redis and enable both at-rest and in-transit encryption.

---

# Secrets / Parameters

* **AWS Secrets Manager** and **SSM Parameter Store (SecureString)** both store secrets encrypted with KMS. You can supply a customer-managed CMK to control access, rotation, and audit. (Secrets Manager also supports built-in secret rotation.)

---

# Glacier / Backup / Snapshots

* **S3 Glacier** and S3-backed backups inherit S3’s server-side encryption options (SSE-S3 / SSE-KMS) depending on how data is stored. Redshift/Athena/S3 snapshots/backups can also be encrypted using KMS keys as described above. ([AWS Documentation][2])

---

# Best-practices / exam-ready checklist

1. **Use KMS and CMKs for production** when you need control/audit/rotation. (AWS-managed for convenience; AWS-owned for zero-config.) ([AWS Documentation][1])
2. **Enable encryption by default** where possible (EBS, S3 bucket default encryption).
3. **Key rotation**: enable automatic rotation for customer-managed CMKs where supported.
4. **Enforce encryption via IAM/bucket policies**: deny writes unless encrypted (S3 example: require `s3:x-amz-server-side-encryption`).
5. **Audit with CloudTrail** for KMS usage and key grants.
6. **Remember service quirks**: many services require encryption at creation (RDS), snapshots copy/restore flows may be needed to convert, and some caching engines have partial support (Memcached caveats). ([AWS Documentation][5])

---

# Quick commands / console hints (short)

* **S3 default encryption (CLI)**:
  `aws s3api put-bucket-encryption --bucket my-bucket --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"aws:kms","KMSMasterKeyID":"arn:aws:kms:...:key/..."}}]}'`
* **Enable EBS encryption by default (console)**: EC2 console → Account Attributes → EBS encryption → enable & pick CMK.
* **Create encrypted RDS instance**: choose “Enable encryption” at creation and pick KMS key.

---

If you want, I can:

* produce a **one-page cheat sheet** (table) comparing each service (default key, how to enable, notes) suitable for study or printing; or
* show **exact CLI examples** for a few services you care about (S3, EBS, RDS).

Which of those would be most useful next?

[1]: https://docs.aws.amazon.com/kms/latest/developerguide/services-ebs.html?utm_source=chatgpt.com "How Amazon Elastic Block Store (Amazon EBS) uses AWS ..."
[2]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/serv-side-encryption.html?utm_source=chatgpt.com "Protecting data with server-side encryption"
[3]: https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html?utm_source=chatgpt.com "Amazon EBS encryption"
[4]: https://docs.aws.amazon.com/efs/latest/ug/encryption-at-rest.html?utm_source=chatgpt.com "Encrypting data at rest - Amazon Elastic File System"
[5]: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html?utm_source=chatgpt.com "Encrypting Amazon RDS resources - AWS Documentation"
[6]: https://aws.amazon.com/blogs/database/things-to-consider-when-choosing-between-oracle-tde-and-aws-kms-for-encryption-of-data-at-rest-for-amazon-rds-for-oracle/?utm_source=chatgpt.com "Things to consider when choosing between Oracle TDE ..."
[7]: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/EncryptionAtRest.html?utm_source=chatgpt.com "DynamoDB encryption at rest"
[8]: https://docs.aws.amazon.com/redshift/latest/mgmt/security-server-side-encryption.html?utm_source=chatgpt.com "Encryption at rest - Amazon Redshift"
[9]: https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/monitor-amazon-elasticache-clusters-for-at-rest-encryption.html?utm_source=chatgpt.com "Monitor Amazon ElastiCache clusters for at-rest encryption"
[10]: https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/at-rest-encryption.html?utm_source=chatgpt.com "At-Rest Encryption in ElastiCache"
