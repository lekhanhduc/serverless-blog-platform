# AWS Serverless Blog Platform

A modern, scalable serverless blog platform built with AWS services and Java 21. This project demonstrates best practices for building microservices architecture on AWS using Lambda, DynamoDB, and other managed services.

## 🏗️ Architecture Overview

![Architecture](infrastructure/serverless.drawio.png)

## 🚀 Features

### Core Features
- **User Authentication** - AWS Cognito integration with JWT tokens
- **Blog Posts** - Create, read, update, delete posts with Markdown support
- **Comments** - Nested comment system with real-time updates
- **User Profiles** - Profile management with avatar upload

### Notification System
- **Email Notifications** via Brevo (SendinBlue)
  - Welcome email for new users
  - New post notifications to all subscribers
  - Comment notifications to post authors

### Infrastructure (Planned)
- **ElastiCache (Redis)** - Session caching and frequently accessed data
- **S3 + CloudFront** - Media storage and CDN for images
- **CloudWatch** - Monitoring and logging

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Java 21 | Runtime |
| Spring Boot 3.4 | Application framework |
| AWS Lambda | Serverless compute |
| AWS SAM | Infrastructure as Code |
| DynamoDB | NoSQL database (Single Table Design) |
| Amazon SNS | Event-driven messaging |
| Amazon Cognito | Authentication & Authorization |
| AWS Secrets Manager | Secure credential storage |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| Vite | Build tool |
| AWS Amplify | Auth integration |

### Infrastructure (Current & Planned)
| Service | Status | Purpose |
|---------|--------|---------|
| API Gateway | ✅ Active | REST API endpoints |
| DynamoDB | ✅ Active | Primary database |
| SNS | ✅ Active | Event notifications |
| Cognito | ✅ Active | User authentication |
| Secrets Manager | ✅ Active | API keys storage |
| S3 | 🔜 Planned | Media storage |
| CloudFront | 🔜 Planned | CDN |
| ElastiCache | 🔜 Planned | Redis caching |

## 📁 Project Structure

```
aws-serverless-blog/
├── common/                     # Shared module
│   └── src/main/java/
│       ├── entity/            # DynamoDB entities
│       ├── event/             # SNS event DTOs
│       └── service/           # Shared services (SnsPublisher)
│
├── profile-service/           # User management
│   └── src/main/java/
│       ├── controller/        # REST endpoints
│       ├── service/           # Business logic
│       └── repository/        # DynamoDB access
│
├── post-service/              # Blog posts
│   └── src/main/java/
│       ├── controller/
│       ├── service/
│       └── repository/
│
├── comment-service/           # Comments
│   └── src/main/java/
│       ├── controller/
│       ├── service/
│       └── repository/
│
├── notification-service/      # Email notifications (Pure Lambda)
│   └── src/main/java/
│       └── SnsLambdaHandler.java
│
├── web-app/                   # React frontend
│   └── ServerlessBlog/
│       └── src/
│
└── infrastructure/            # CloudFormation templates
    ├── api-gateway.yaml
    ├── cognito.yaml
    └── databases.yaml
```

## 🗄️ DynamoDB Single Table Design

All data stored in a single table `serverless-blog` using composite keys:

| Entity | PK | SK | Attributes |
|--------|----|----|------------|
| User Profile | `USER#<userId>` | `PROFILE` | email, username, role, createdAt |
| Post | `POST#<postId>` | `METADATA` | title, content, authorId, status |
| Comment | `POST#<postId>` | `COMMENT#<commentId>` | content, authorId, createdAt |

## 🔔 Event-Driven Notifications

```
┌──────────────┐     ┌─────────┐     ┌─────────────────────┐     ┌─────────┐
│   Service    │────▶│   SNS   │────▶│ notification-service│────▶│  Brevo  │
│ (post/comment)│     │  Topic  │     │     (Lambda)        │     │ (Email) │
└──────────────┘     └─────────┘     └─────────────────────┘     └─────────┘
```

### Event Types
| Event | Trigger | Recipients |
|-------|---------|------------|
| `NEW_USER` | User registration | New user |
| `NEW_POST` | Post created | All users (except author) |
| `NEW_COMMENT` | Comment added | Post author |

## 🚀 Getting Started

### Prerequisites
- Java 21
- Maven 3.9+
- Node.js 20+
- AWS CLI configured
- AWS SAM CLI

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/aws-serverless-blog.git
cd aws-serverless-blog
```

2. **Build all services**
```bash
mvn clean package
```

3. **Run frontend locally**
```bash
cd web-app/ServerlessBlog
npm install
npm run dev
```

### Deployment

1. **Deploy infrastructure**
```bash
sam deploy --guided
```

2. **Deploy individual services**
```bash
# Profile Service
cd profile-service
sam deploy --template-file template.yml --stack-name profile-service --capabilities CAPABILITY_IAM --resolve-s3

# Post Service
cd post-service
sam deploy --template-file template.yaml --stack-name post-service --capabilities CAPABILITY_IAM --resolve-s3

# Comment Service
cd comment-service
sam deploy --template-file template.yml --stack-name comment-service --capabilities CAPABILITY_IAM --resolve-s3

# Notification Service
cd notification-service
sam deploy --template-file template.yml --stack-name notification-service --capabilities CAPABILITY_IAM --resolve-s3
```

3. **Deploy frontend to S3**
```bash
cd web-app/ServerlessBlog
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

## ⚙️ Configuration

### Environment Variables

| Variable | Service | Description |
|----------|---------|-------------|
| `DYNAMODB_TABLE_NAME` | All | DynamoDB table name |
| `SNS_TOPIC_ARN` | post, comment, profile | SNS topic for notifications |
| `COGNITO_USER_POOL_ID` | profile | Cognito User Pool ID |
| `COGNITO_CLIENT_ID` | profile | Cognito App Client ID |
| `BREVO_SECRET_NAME` | notification | Secrets Manager secret name |
| `MAIL_SENDER_EMAIL` | notification | Sender email address |
| `MAIL_SENDER_NAME` | notification | Sender display name |

### AWS Secrets Manager

Store Brevo API key:
```json
{
  "brevo-api-key": "xkeysib-your-api-key"
}
```

## 🔜 Roadmap

### Phase 1 - Core (✅ Completed)
- [x] User authentication with Cognito
- [x] CRUD operations for posts and comments
- [x] Email notifications via SNS + Brevo

### Phase 2 - Media & Performance
- [ ] S3 bucket for media uploads
- [ ] CloudFront CDN integration
- [ ] Image optimization with Lambda@Edge
- [ ] ElastiCache for session/data caching

### Phase 3 - Enhanced Features
- [ ] Full-text search with OpenSearch
- [ ] Like/reaction system
- [ ] User following system
- [ ] Rich text editor

## 📊 Cost Estimation

This serverless architecture is highly cost-effective:

| Service | Free Tier | Estimated Monthly Cost |
|---------|-----------|----------------------|
| Lambda | 1M requests | ~$0 (low traffic) |
| DynamoDB | 25GB storage | ~$0 (on-demand) |
| API Gateway | 1M calls | ~$0 |
| SNS | 1M publishes | ~$0 |
| Cognito | 50K MAU | ~$0 |
| S3 | 5GB | ~$0.12 |
| CloudFront | 1TB | ~$0.085/GB |

**Total estimated cost for small blog: < $5/month**

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Le Khanh Duc**
- GitHub: [@lekhanhduc](https://github.com/lekhanhduc)
- Website: [javabuilder.online](https://javabuilder.online)

---

⭐ If you found this project helpful, please give it a star!
