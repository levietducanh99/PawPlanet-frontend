# PowerShell script for API generation
$ErrorActionPreference = "Stop"

Write-Host "Fetching OpenAPI spec from backend repo..." -ForegroundColor Cyan

# Download OpenAPI spec
$url = "https://raw.githubusercontent.com/levietducanh99/PawpPanet-backend/main/src/main/resources/openapi.yaml"
$output = "openapi/openapi.yaml"

Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "OpenAPI spec downloaded successfully." -ForegroundColor Green
Write-Host ""
Write-Host "Generating TypeScript API client..." -ForegroundColor Cyan

# Generate API client
npx openapi-generator-cli generate `
  -i openapi/openapi.yaml `
  -g typescript-axios `
  -o src/services/api `
  --skip-validate-spec `
  --additional-properties=useSingleRequestParameter=true

Write-Host ""
Write-Host "API client regenerated successfully!" -ForegroundColor Green
Write-Host "Generated files location: src/services/api/" -ForegroundColor Yellow

