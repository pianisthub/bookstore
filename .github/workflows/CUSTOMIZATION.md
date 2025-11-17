# Customizing CI/CD Workflows

The GitHub Actions workflows are designed to be flexible and can be customized for different deployment targets. Here are guides for common deployment scenarios:

## Deploying to AWS

### Frontend (S3 + CloudFront)
1. Create an S3 bucket for your frontend
2. Set up a CloudFront distribution pointing to the S3 bucket (optional for performance)
3. Add these AWS secrets to your GitHub repository:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `S3_FRONTEND_BUCKET` (bucket name)

4. Uncomment and modify the AWS deployment steps in `frontend-cicd.yml`:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: ${{ secrets.AWS_REGION }}

- name: Deploy to S3
  run: aws s3 sync build/ s3://${{ secrets.S3_FRONTEND_BUCKET }} --delete
```

### Backend (Elastic Beanstalk)
1. Create an Elastic Beanstalk application
2. Add these AWS secrets to your GitHub repository:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `EB_APPLICATION_NAME` (Elastic Beanstalk application name)
   - `EB_ENVIRONMENT_NAME` (Elastic Beanstalk environment name)

3. Uncomment and modify the AWS deployment steps in `backend-cicd.yml`:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: ${{ secrets.AWS_REGION }}

- name: Create deployment package
  run: zip -r bookstore-api.zip .
  working-directory: ./BookstoreApi/Bookstore.Api/publish

- name: Deploy to Elastic Beanstalk
  run: |
    aws s3 cp bookstore-api.zip s3://${{ secrets.S3_DEPLOYMENT_BUCKET }}/
    aws elasticbeanstalk create-application-version \
      --application-name ${{ secrets.EB_APPLICATION_NAME }} \
      --version-label $GITHUB_SHA \
      --source-bundle S3Bucket=${{ secrets.S3_DEPLOYMENT_BUCKET }},S3Key=bookstore-api.zip
    aws elasticbeanstalk update-environment \
      --environment-name ${{ secrets.EB_ENVIRONMENT_NAME }} \
      --version-label $GITHUB_SHA
```

## Deploying to Azure

### Frontend (Azure Static Web Apps or Storage)
1. Create an Azure Static Web App or Storage account
2. Add these Azure secrets to your GitHub repository:
   - `AZURE_CREDENTIALS` (JSON credentials from Azure)
   - `AZURE_STATIC_WEB_APP_NAME`

3. Configure Azure deployment steps as needed.

### Backend (Azure App Service)
1. Create an Azure App Service
2. Add these Azure secrets to your GitHub repository:
   - `AZURE_WEBAPP_NAME`
   - `AZURE_PUBLISH_PROFILE` (or use Azure credentials approach)

4. Uncomment and modify the Azure deployment steps in `backend-cicd.yml`:

```yaml
- name: Deploy to Azure Web App
  uses: azure/webapps-deploy@v2
  with:
    app-name: ${{ secrets.AZURE_WEBAPP_NAME }}
    publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
    package: ./BookstoreApi/Bookstore.Api/publish
```

## Deploying to Docker Container Registry

### For Azure Container Registry (ACR) or Docker Hub
1. Uncomment and modify the docker build and deployment steps:

```yaml
- name: Build and push Docker images
  run: |
    docker build -t ${{ secrets.DOCKER_USERNAME }}/bookstore-frontend:${{ github.sha }} .
    docker push ${{ secrets.DOCKER_USERNAME }}/bookstore-frontend:${{ github.sha }}
```

2. Add these secrets to your GitHub repository:
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
   - `DOCKER_REGISTRY` (if using a custom registry)

## Environment-Specific Configuration

For different environments (dev, staging, prod), you can:

1. Create separate branch protection rules
2. Use environment-specific secrets in GitHub
3. Modify the workflow conditions:

```yaml
- name: Deploy to Production
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```

4. Use different configuration files for each environment in your applications.

## Common Customization Examples

### Adding Database Migrations
For the .NET backend, you might want to add database migration steps:

```yaml
- name: Run Database Migrations
  run: dotnet ef database update
  working-directory: ./BookstoreApi/Bookstore.Api
  env:
    ConnectionStrings__DefaultConnection: ${{ secrets.DB_CONNECTION_STRING }}
```

### Adding Environment Variables
Pass environment variables to your applications:

```yaml
- name: Build frontend with environment
  run: npm run build
  working-directory: ./bookstore-frontend
  env:
    REACT_APP_API_URL: ${{ secrets.API_URL }}
    REACT_APP_ENV: production
```

### Adding Notification Steps
Add notifications to Slack, Discord, or email:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    channel: '#deployments'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

Remember to customize the workflows based on your specific deployment requirements and hosting provider.