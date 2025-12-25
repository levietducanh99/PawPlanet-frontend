# API Client

This directory contains auto-generated API client code.

## Generation

The API client is automatically generated from the backend's OpenAPI specification using the `openapi-generator-cli`.

To regenerate the API client:

```bash
npm run gen:api
```

This command will:
1. Download the latest OpenAPI specification from the backend repository
2. Generate TypeScript axios client code
3. Place the generated code in this directory

## Usage

Import the generated API client in your components:

```typescript
import { DefaultApi } from '@/services/api';
import apiClient from '@/services/apiConfig';

const api = new DefaultApi(undefined, '', apiClient);

// Use the API
const response = await api.someEndpoint();
```

## Note

Do not manually edit files in this directory as they will be overwritten when regenerating the API client.
