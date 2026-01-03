# API Generation Guide

This guide explains how to generate the API client from the backend's OpenAPI specification.

## Overview

The frontend uses `@openapitools/openapi-generator-cli` to automatically generate a TypeScript Axios client from the backend's OpenAPI specification. This ensures type-safe API calls and keeps the frontend in sync with the backend API.

## Prerequisites

- Node.js and npm installed
- Backend repository exists with an OpenAPI specification file
- Internet connection to download the OpenAPI spec

## Project Structure

```
frontend/
 ├─ openapi/
 │   └─ openapi.yaml        ← Downloaded OpenAPI spec from backend
 ├─ scripts/
 │   ├─ generate-api.sh     ← Bash script for Linux/Mac
 │   ├─ generate-api.ps1    ← PowerShell script for Windows
 │   └─ README.md           ← Detailed documentation
 └─ src/
     └─ services/
         └─ api/            ← Generated API client code
```

## Usage

### Windows Users (PowerShell - Default)

```bash
npm run api:generate
```

### Linux/Mac Users (Bash)

```bash
npm run api:generate:bash
```

## Configuration

The API generation is configured in `package.json`:

```json
{
  "scripts": {
    "api:generate": "powershell -ExecutionPolicy Bypass -File ./scripts/generate-api.ps1",
    "api:generate:bash": "bash ./scripts/generate-api.sh"
  }
}
```

### What the scripts do:

1. **Download OpenAPI spec** from backend repository
   - Source: `https://raw.githubusercontent.com/levietducanh99/PawpPanet-backend/main/src/main/resources/openapi.yaml`
   - Destination: `openapi/openapi.yaml`

2. **Generate TypeScript client** using openapi-generator-cli with:
   - Input: `openapi/openapi.yaml`
   - Generator: `typescript-axios` (TypeScript + Axios)
   - Output: `src/services/api/` directory
   - Options: 
     - `--skip-validate-spec`: Skips OpenAPI spec validation
     - `--additional-properties=useSingleRequestParameter=true`: Uses single parameter for request data

3. **Keep the spec file** in `openapi/` directory for version tracking

### When to regenerate:

- ✅ After backend PR merge with API changes
- ✅ When you pull and see `openapi/openapi.yaml` changed
- ✅ When starting new features that use new endpoints
- ✅ During initial project setup

## Benefits of This Approach

### ✅ No Backend Dependency
- Script fetches spec from GitHub, NOT from running backend
- Works even if backend server is down
- Always gets the latest merged/committed spec

### ✅ Version Control
- `openapi.yaml` is tracked in git
- Team can see API changes in PRs
- Easy to rollback if needed

### ✅ Controlled Regeneration
- Manual trigger prevents unexpected changes
- Review generated code before committing
- Clear when API contracts change

## Customizing the Source

### Using a Different Backend Repository

Update the URL in `package.json`:

```json
"gen:api": "curl -o openapi.yaml https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_BACKEND_REPO/YOUR_BRANCH/path/to/openapi.yaml && ..."
```

### Using a Local File

If you have the OpenAPI spec locally:

```json
"gen:api": "openapi-generator-cli generate -i /path/to/openapi.yaml -g typescript-axios -o src/services/api --skip-validate-spec --additional-properties=useSingleRequestParameter=true"
```

### Using a Running Backend

If your backend exposes the spec via HTTP:

```json
"gen:api": "curl -o openapi.yaml https://pawplanet-ae61a47d7179.herokuapp.com/v3/api-docs.yaml && openapi-generator-cli generate -i openapi.yaml -g typescript-axios -o src/services/api --skip-validate-spec --additional-properties=useSingleRequestParameter=true && rm openapi.yaml"
```

## Generated Files

The command generates several files in `src/services/api/`:

- `api.ts` - API client classes with methods for each endpoint
- `base.ts` - Base API class
- `common.ts` - Common types and utilities
- `configuration.ts` - Configuration class
- `index.ts` - Main export file

## Using the Generated API Client

Example usage:

```typescript
import { DefaultApi } from '@/services/api';
import apiClient from '@/services/apiConfig';

// Create API instance
const api = new DefaultApi(undefined, '', apiClient);

// Make API calls
async function fetchData() {
  try {
    const response = await api.getData();
    console.log(response.data);
  } catch (error) {
    console.error('API call failed:', error);
  }
}
```

## Troubleshooting

### Error: "Could not download OpenAPI spec"

- Check your internet connection
- Verify the backend repository URL is correct
- Ensure the OpenAPI spec file exists at the specified path
- Check if the repository is public (private repos may need authentication)

### Error: "Generation failed"

- Check the OpenAPI spec is valid YAML
- Try removing `--skip-validate-spec` to see validation errors
- Check the openapi-generator-cli version in `openapitools.json`

### Generated code has TypeScript errors

- Regenerate with `npm run gen:api`
- Check if the OpenAPI spec has the correct types
- Update the generator options if needed

## Advanced Options

### Custom Generator Properties

You can add more properties to customize generation:

```json
"--additional-properties=useSingleRequestParameter=true,withSeparateModelsAndApi=true,modelPackage=models,apiPackage=apis"
```

### Different Generator

To use a different generator (e.g., typescript-fetch):

```json
"-g typescript-fetch"
```

See [OpenAPI Generator Documentation](https://openapi-generator.tech/docs/generators/typescript-axios) for more options.

## Best Practices

1. **Regenerate regularly** - Keep the client in sync with backend changes
2. **Don't commit generated code** - The generated files are gitignored
3. **Don't modify generated files** - They will be overwritten on regeneration
4. **Use the apiConfig** - Always use the configured axios instance for proper error handling

## Git Configuration

The generated API files are **gitignored** (configured in `.gitignore`):

```
src/services/api/*
!src/services/api/README.md
!src/services/api/.gitkeep
```

This means:
- Generated files are NOT committed to version control
- Each developer/CI pipeline must run `npm run gen:api` after `npm install`
- The README and .gitkeep are preserved
