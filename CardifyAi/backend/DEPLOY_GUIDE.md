# PANDUAN DEPLOY BACKEND KE AZURE APP SERVICE

## 1. Login ke Azure
az login

## 2. Jalankan script deployment
# Untuk PowerShell:
.\deploy-azure.ps1

# Untuk Bash:
bash deploy-azure.sh

## 3. Deploy code menggunakan Git
# Setelah script selesai, Anda akan mendapatkan Git URL
# Tambahkan sebagai remote dan push:

git remote add azure <GIT_URL_DARI_AZURE>
cd backend
git add .
git commit -m "Deploy backend to Azure"
git push azure main

## 4. Monitor deployment
az webapp log tail --name cardifyai-backend --resource-group cardifyai-resources

## 5. Test API
curl https://cardifyai-backend.azurewebsites.net/api/auth/test
