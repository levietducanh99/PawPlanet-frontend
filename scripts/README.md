# API Generation Guide

This document explains how to generate the TypeScript API client from the backend OpenAPI specification.

## 📋 Overview

The API client is auto-generated from the backend's OpenAPI specification using `openapi-generator-cli`. This ensures type-safe API calls with full TypeScript support.

## 🗂 Project Structure

```
frontend/
 ├─ openapi/
 │   └─ openapi.yaml        ← Downloaded OpenAPI spec from backend
 ├─ scripts/
 │   ├─ generate-api.sh     ← Bash script for Linux/Mac
 │   └─ generate-api.ps1    ← PowerShell script for Windows
 └─ src/
     └─ services/
         └─ api/            ← Generated API client code
```

## 🚀 How to Use

### Windows Users (PowerShell)

```bash
npm run api:generate
```

### Linux/Mac Users (Bash)

```bash
npm run api:generate:bash
```

## ⏰ When to Run This Script?

You should regenerate the API client when:

1. **Backend PR merged** with API changes
2. **You pull changes** and see `openapi/openapi.yaml` was modified
3. **Starting new feature** that uses new backend endpoints
4. **After backend deployment** with API updates

## 🔍 What the Script Does

1. **Fetches OpenAPI Spec**: Downloads the latest `openapi.yaml` from the backend repository
   - Source: `https://raw.githubusercontent.com/levietducanh99/PawpPanet-backend/main/src/main/resources/openapi.yaml`

2. **Generates TypeScript Client**: Creates type-safe API client using `openapi-generator-cli`
   - Generator: `typescript-axios`
   - Output: `src/services/api/`
   - Additional properties: `useSingleRequestParameter=true`

3. **Validates**: Skips validation to avoid blocking on minor spec issues

## 📦 Dependencies

The following packages are required (already in `package.json`):

- `@openapitools/openapi-generator-cli` - Code generator
- `axios` - HTTP client library

## 🛠 Troubleshooting

### Script Execution Error (Windows)

If you get "running scripts is disabled on this system":

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### cURL Not Found (Windows)

Windows 10+ includes `curl` by default. If not found:

1. Install Git for Windows (includes curl)
2. Or use PowerShell script instead: `npm run api:generate`

### Generated Files Not Found

Check that:
- Backend repository is accessible
- OpenAPI spec exists at the specified URL
- You have write permissions to `src/services/api/`

## 📝 Generated Files Structure

After running the script, you'll find:

```
src/services/api/
 ├─ api.ts              ← API class definitions
 ├─ base.ts             ← Base configuration
 ├─ common.ts           ← Common utilities
 ├─ configuration.ts    ← Configuration class
 └─ index.ts           ← Barrel export
```

## 💡 Usage Example

```typescript
import { DefaultApi, Configuration } from '@/services/api';

// Create API instance
const api = new DefaultApi(
  new Configuration({
    basePath: 'https://api.pawplanet.com'
  })
);

// Use API
const animals = await api.getAnimals();
```

## 🔄 Workflow Integration

### For Team Members

1. Pull latest code from `main`
2. Check if `openapi/openapi.yaml` changed
3. If yes, run `npm run api:generate`
4. Commit the regenerated files if needed

### For CI/CD

You can add this to your CI pipeline:

```yaml
# .github/workflows/generate-api.yml
name: Generate API Client
on:
  workflow_dispatch:
  
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run api:generate:bash
      - uses: peter-evans/create-pull-request@v5
        with:
          commit-message: "chore: regenerate API client"
```

## 🔗 Related Documentation

- [OpenAPI Generator Docs](https://openapi-generator.tech/)
- [Backend Repository](https://github.com/levietducanh99/PawpPanet-backend)
- [API Configuration Guide](../src/services/apiConfig.ts)

---

**Last Updated**: January 3, 2026  
**Maintained by**: PawPlanet Frontend Team

