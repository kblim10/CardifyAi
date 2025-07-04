#!/bin/bash

# Azure Deployment Script for CardifyAi Backend
echo "🚀 Starting Azure deployment for CardifyAi Backend..."

# Login to Azure (uncomment if needed)
# az login

# Set variables
RESOURCE_GROUP="cardifyai-resources"
APP_NAME="cardifyai-backend"
LOCATION="Southeast Asia"
APP_SERVICE_PLAN="cardifyai-plan"

# Create resource group
echo "📦 Creating resource group..."
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Create App Service plan (Free tier for testing)
echo "🏗️  Creating App Service plan..."
az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --sku F1 \
  --is-linux

# Create web app
echo "🌐 Creating web app..."
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $APP_NAME \
  --runtime "NODE|18-lts" \
  --deployment-local-git

# Configure app settings (environment variables)
echo "⚙️  Configuring app settings..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    MONGODB_URI_PROD="mongodb+srv://putrarifki705:kblim@cardifyai.smnxv8y.mongodb.net/cardifyai?retryWrites=true&w=majority&appName=CardifyAi" \
    JWT_SECRET="kblimcrdifyai" \
    JWT_EXPIRE="30d" \
    CORS_ORIGIN="*"

echo "✅ Azure setup complete!"
echo "🌍 App URL: https://$APP_NAME.azurewebsites.net"
echo ""
echo "Next steps:"
echo "1. Deploy your code using: az webapp deployment source config-local-git"
echo "2. Or use GitHub Actions for CI/CD"
