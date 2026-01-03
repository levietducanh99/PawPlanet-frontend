#!/bin/bash
set -e

echo "🔄 Fetching OpenAPI spec from backend repo..."

curl -L \
  https://raw.githubusercontent.com/levietducanh99/PawpPanet-backend/main/src/main/resources/openapi.yaml \
  -o openapi/openapi.yaml

echo "✅ OpenAPI spec downloaded successfully."
echo ""
echo "🔧 Generating TypeScript API client..."

npx openapi-generator-cli generate \
  -i openapi/openapi.yaml \
  -g typescript-axios \
  -o src/services/api \
  --skip-validate-spec \
  --additional-properties=useSingleRequestParameter=true

echo ""
echo "✅ API client regenerated successfully!"
echo "📁 Generated files location: src/services/api/"

