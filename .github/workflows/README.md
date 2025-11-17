# GitHub Actions CI/CD Configuration

This project uses GitHub Actions for CI/CD workflows. The following workflows are configured:

## Workflows

1. **frontend-cicd.yml** - Handles React frontend CI/CD
2. **backend-cicd.yml** - Handles .NET backend CI/CD
3. **full-stack-cicd.yml** - Handles both frontend and backend in a single workflow

## Required GitHub Secrets

To use these workflows, you need to configure the following secrets in your GitHub repository settings:

### For AWS Deployment (if using S3/EB):
- `AWS_ACCESS_KEY_ID` - AWS access key ID
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `S3_BUCKET_NAME` - Staging S3 bucket name
- `PRODUCTION_S3_BUCKET_NAME` - Production S3 bucket name

### For Azure Deployment (if using Azure App Service):
- `AZURE_WEBAPP_NAME` - Staging Azure App Service name
- `AZURE_WEBAPP_NAME_PRODUCTION` - Production Azure App Service name
- `AZURE_WEBAPP_PUBLISH_PROFILE` - Staging publish profile
- `AZURE_WEBAPP_PUBLISH_PROFILE_PRODUCTION` - Production publish profile

### For Other Cloud Providers:
Update the workflow files with appropriate deployment steps and secrets based on your hosting provider.

## Workflows Overview

### Frontend CI/CD
- Runs on changes to `bookstore-frontend/**` path
- Runs tests and builds the React application
- Deploys to staging when merged to `main`
- Deploys to production when staging deployment succeeds

### Backend CI/CD
- Runs on changes to `BookstoreApi/**` path
- Builds and tests the .NET application
- Deploys to staging when merged to `main`
- Deploys to production when staging deployment succeeds

### Full Stack CI/CD
- Runs tests for both frontend and backend
- Builds both applications
- Deploys both applications (requires manual configuration)

## Setup Instructions

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add the required secrets based on your deployment target
4. Uncomment and modify the deployment steps in the workflow files as needed
5. Commit the workflow files to your repository

The workflows will automatically run on pushes and pull requests as configured in each file.