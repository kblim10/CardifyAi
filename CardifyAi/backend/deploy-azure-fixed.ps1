# Azure Deployment Script for CardifyAi Backend (PowerShell)

Write-Host "🚀 Starting Azure deployment for CardifyAi Backend..." -ForegroundColor Green

# Set variables
$RESOURCE_GROUP = "kblim"
$APP_NAME = "cardifyai"
$LOCATION = "Indonesia Central"
$APP_SERVICE_PLAN = "ASP-kblim-bcdc"

# Login to Azure (uncomment if needed)
# az login

# Create resource group
Write-Host "📦 Creating resource group..." -ForegroundColor Yellow
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Create App Service plan (Free tier for testing)
Write-Host "🏗️  Creating App Service plan..." -ForegroundColor Yellow
az appservice plan create `
  --name $APP_SERVICE_PLAN `
  --resource-group $RESOURCE_GROUP `
  --sku F1 `
  --is-linux

# Create web app
Write-Host "🌐 Creating web app..." -ForegroundColor Yellow
az webapp create `
  --resource-group $RESOURCE_GROUP `
  --plan $APP_SERVICE_PLAN `
  --name $APP_NAME `
  --runtime "NODE:18-lts" `
  --deployment-local-git

# Configure app settings (environment variables)
Write-Host "⚙️  Configuring app settings..." -ForegroundColor Yellow
$mongoUri = "mongodb+srv://putrarifki705:kblim@cardifyai.smnxv8y.mongodb.net/cardifyai?retryWrites=true&w=majority&appName=CardifyAi"

az webapp config appsettings set `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --settings `
    NODE_ENV=production `
    PORT=8080 `
    MONGODB_URI_PROD="$mongoUri" `
    JWT_SECRET="kblimcrdifyai" `
    JWT_EXPIRE="30d" `
    CORS_ORIGIN="*"

Write-Host "✅ Azure setup complete!" -ForegroundColor Green
Write-Host "🌍 App URL: https://$APP_NAME.azurewebsites.net" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Deploy your code using Git or GitHub Actions" -ForegroundColor White
Write-Host "2. Update frontend API URL to: https://$APP_NAME.azurewebsites.net/api" -ForegroundColor White

# Get Git URL for deployment
Write-Host ""
Write-Host "🔗 Getting Git deployment URL..." -ForegroundColor Yellow
$gitUrl = az webapp deployment source config-local-git --name $APP_NAME --resource-group $RESOURCE_GROUP --query url --output tsv
Write-Host "Git URL: $gitUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "To deploy your code:" -ForegroundColor White
Write-Host "git remote add azure $gitUrl" -ForegroundColor Gray
Write-Host "git push azure main" -ForegroundColor Gray
