# AWS Lambda Interview Questions and Answers (In-Depth)

## Basic Questions

### Q1. What is AWS Lambda and what problem does it solve?

**Answer:**\
AWS Lambda is a serverless compute service that allows you to run code
without provisioning or managing servers. It solves the problem of
managing infrastructure for small, event-driven workloads. Instead of
maintaining EC2 instances or scaling servers, you can simply upload your
function code and AWS Lambda takes care of scaling, fault-tolerance, and
execution. This reduces operational overhead, especially for
event-driven or sporadic workloads.

------------------------------------------------------------------------

### Q2. How does AWS Lambda differ from EC2 or ECS?

**Answer:**\
- **EC2:** You manage servers, OS patches, scaling groups, and
networking. It's ideal for applications needing full control over the
environment.\
- **ECS (Elastic Container Service):** You manage containerized
applications, define task definitions, and still need to manage scaling
and orchestration.\
- **Lambda:** You only manage function code. Scaling and infrastructure
are fully abstracted. Ideal for microservices, automation, and
event-driven processing.

------------------------------------------------------------------------

### Q3. What are the key benefits of using AWS Lambda?

**Answer:**\
- **No server management:** No provisioning or patching required.\
- **Automatic scaling:** Lambda scales concurrently based on event
rate.\
- **Cost efficiency:** Pay-per-request and execution time, no idle
cost.\
- **Event-driven integration:** Deep integration with S3, DynamoDB, API
Gateway, CloudWatch, and more.\
- **Security:** Fine-grained IAM policies for least-privilege access.

------------------------------------------------------------------------

## Architecture & Concepts

### Q4. Explain the event-driven model of AWS Lambda.

**Answer:**\
AWS Lambda executes code in response to events such as HTTP requests
(API Gateway), S3 object uploads, DynamoDB table updates, or custom
CloudWatch events. The event is passed as a JSON object to the Lambda
function handler. Lambda scales automatically by creating new execution
environments when multiple events arrive simultaneously.

------------------------------------------------------------------------

### Q5. What are triggers in AWS Lambda? Can you name a few examples?

**Answer:**\
Triggers are AWS services or resources that invoke Lambda functions.
Examples:\
- **S3:** File upload triggers a Lambda to process images or logs.\
- **DynamoDB Streams:** Triggers a Lambda for real-time data
transformations.\
- **API Gateway:** Triggers Lambda for REST/GraphQL APIs.\
- **CloudWatch Events/Alarms:** Triggers Lambda for automated
operations.\
- **Kinesis Streams:** Triggers Lambda for real-time analytics.

------------------------------------------------------------------------

### Q6. How does AWS Lambda handle scaling automatically?

**Answer:**\
AWS Lambda creates new execution environments (containers) when
concurrent events occur. By default, Lambda supports up to 1,000
concurrent executions per region (can be increased via support request).
Scaling is near-instant but limited by concurrency quotas. Provisioned
Concurrency can be enabled to pre-warm execution environments.

------------------------------------------------------------------------

### Q7. What is the maximum execution timeout for a Lambda function?

**Answer:**\
The maximum timeout is **15 minutes** per execution. This makes Lambda
unsuitable for long-running batch processes, where services like AWS
Fargate or Step Functions might be better.

------------------------------------------------------------------------

### Q8. How does cold start affect Lambda performance?

**Answer:**\
Cold starts occur when a new execution environment must be created. It
involves:\
1. Downloading the function code.\
2. Initializing the runtime environment.\
3. Executing initialization code outside the handler.

Cold starts can add latency (100ms--1s+ depending on runtime, memory,
and VPC usage). They are most noticeable with infrequent invocations,
large deployment packages, or VPC-enabled Lambdas. Provisioned
Concurrency mitigates this.

------------------------------------------------------------------------

## Deployment & Configuration

### Q9. How do you deploy code to AWS Lambda?

**Answer:**\
- **Direct upload:** Via AWS Console or CLI (limited to 50MB zipped).\
- **S3 bucket:** Upload larger packages (up to 250MB).\
- **Infrastructure as Code (IaC):** Using CloudFormation, Terraform, or
AWS SAM.\
- **CI/CD:** Integrating CodePipeline, GitHub Actions, or Jenkins for
automated deployments.

------------------------------------------------------------------------

### Q10. What are Lambda layers and when would you use them?

**Answer:**\
Lambda layers allow you to package and share libraries, dependencies, or
custom runtimes across multiple functions. They promote reusability and
reduce deployment size. Example: Packaging NumPy/Pandas as a layer for
data-processing functions.

------------------------------------------------------------------------

### Q11. How do you configure environment variables in AWS Lambda?

**Answer:**\
Environment variables can be configured via console, CLI, or IaC. They
are encrypted at rest with KMS by default. Best practice: Store
sensitive data (like DB credentials) in AWS Secrets Manager or Parameter
Store and reference them in Lambda.

------------------------------------------------------------------------

### Q12. What is the max size of the deployment package?

**Answer:**\
- **Direct upload (zip):** 50MB.\
- **With layers (uncompressed):** 250MB.\
- **Container images:** Up to 10GB (ECR).

------------------------------------------------------------------------

### Q13. How do you version and alias Lambda functions?

**Answer:**\
- **Versioning:** Each publish creates an immutable snapshot of code and
configuration.\
- **Aliases:** Named pointers to specific versions (e.g., `dev`,
`prod`). Aliases support weighted traffic shifting for gradual rollouts.

------------------------------------------------------------------------

## Integration & Use Cases

### Q14. How can AWS Lambda be integrated with API Gateway?

**Answer:**\
API Gateway can be configured as a trigger for Lambda. It acts as a
REST/HTTP endpoint, converting requests into event JSON objects passed
to Lambda. Integration types:\
- **Lambda Proxy Integration:** Entire HTTP request passed to Lambda.\
- **Custom Integration:** Mapping templates to control input/output.

------------------------------------------------------------------------

### Q15. How would you use AWS Lambda with S3 events?

**Answer:**\
Configure an S3 bucket event notification (PUT, POST, DELETE) to invoke
a Lambda. Use cases include:\
- Processing image uploads (e.g., generate thumbnails).\
- ETL pipelines (transform raw data before storage).\
- Real-time log processing.

------------------------------------------------------------------------

### Q16. Can you explain a real-world use case where Lambda is a good fit?

**Answer:**\
A good fit is **image processing pipeline**: Uploading an image to S3
triggers Lambda, which compresses and resizes the image, then stores it
in another S3 bucket or DynamoDB. It's cost-effective since execution
only happens on demand, with no idle server cost.

------------------------------------------------------------------------

### Q17. What are some use cases where Lambda may not be the best choice?

**Answer:**\
- Long-running jobs (\>15 min).\
- High-performance computing with strict latency needs.\
- Applications requiring persistent connections (e.g., WebSockets
outside API Gateway).\
- Heavy dependency management with slow cold starts.

------------------------------------------------------------------------

## Monitoring & Security

### Q18. How do you monitor AWS Lambda performance?

**Answer:**\
- **CloudWatch Metrics:** Invocation count, duration, errors,
throttles.\
- **CloudWatch Logs:** Captures function logs automatically.\
- **AWS X-Ray:** Provides distributed tracing and performance insights.\
- **Third-party tools:** Datadog, New Relic, etc.

------------------------------------------------------------------------

### Q19. What metrics are available in CloudWatch for Lambda?

**Answer:**\
- `Invocations`: Number of function calls.\
- `Duration`: Execution time per invocation.\
- `Errors`: Number of failed executions.\
- `Throttles`: Requests rejected due to concurrency limits.\
- `IteratorAge`: For stream-based events (Kinesis/DynamoDB).

------------------------------------------------------------------------

### Q20. How do you secure a Lambda function?

**Answer:**\
- Use IAM roles with least-privilege permissions.\
- Encrypt environment variables with KMS.\
- Place sensitive Lambdas in a private VPC.\
- Enable AWS WAF when exposed via API Gateway.\
- Regularly rotate keys/secrets with AWS Secrets Manager.

------------------------------------------------------------------------

### Q21. How do IAM roles and permissions affect Lambda execution?

**Answer:**\
Lambda assumes an **execution role** (IAM role) at runtime. Permissions
define what AWS resources the function can access (e.g., read S3, write
DynamoDB). Incorrect roles often cause runtime errors like
`AccessDeniedException`.

------------------------------------------------------------------------

## Advanced Topics

### Q22. What is Provisioned Concurrency in AWS Lambda?

**Answer:**\
Provisioned Concurrency keeps execution environments warm and
pre-initialized to handle requests with near-zero cold starts. Useful
for latency-sensitive APIs or interactive applications. However, it
incurs extra cost compared to on-demand execution.

------------------------------------------------------------------------

### Q23. How do you handle error retries and DLQs (Dead Letter Queues)?

**Answer:**\
- **Asynchronous invocations:** Lambda retries twice on failure (with
exponential backoff).\
- **DLQ:** You can configure SQS or SNS as a DLQ to capture failed
events for later reprocessing.\
- **Event Source Mapping:** For stream-based events, failed records are
retried until processed successfully or expired.

------------------------------------------------------------------------

### Q24. How do you manage dependencies in AWS Lambda functions?

**Answer:**\
- **Zip Deployment:** Bundle dependencies with code.\
- **Layers:** Store common dependencies separately.\
- **Container Images:** Package with Docker, push to ECR.\
- **Best Practice:** Keep dependencies minimal to reduce cold start
latency.

------------------------------------------------------------------------

### Q25. Can AWS Lambda run inside a VPC? What are the considerations?

**Answer:**\
Yes, Lambda can be configured to connect to private VPC subnets.
Considerations:\
- Requires Elastic Network Interfaces (ENIs).\
- Cold start times increase due to ENI provisioning.\
- Must configure NAT Gateway for internet access.\
- Useful for accessing RDS, ElastiCache, or internal services.

------------------------------------------------------------------------

### Q26. What are some cost optimization strategies for AWS Lambda?

**Answer:**\
- Optimize function memory/timeout settings.\
- Reuse execution environment (cache connections outside handler).\
- Use Provisioned Concurrency only when necessary.\
- Offload heavy workloads to Step Functions or Fargate.\
- Monitor with AWS Cost Explorer and set budgets.

------------------------------------------------------------------------

## Conclusion

These advanced interview questions and answers cover everything from
fundamentals to deep architectural trade-offs. Mastery of these topics
demonstrates not only Lambda knowledge but also broader cloud
architecture expertise.
