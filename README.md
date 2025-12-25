# PawpPanet Frontend

A React + TypeScript frontend application for PawpPanet - your pet social network.

## Project Structure

```
PawpPanet-frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, and other static files
│   ├── components/        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Loading.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── index.ts
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx
│   │   └── index.ts
│   ├── hooks/             # Custom React hooks
│   │   ├── useFetch.ts
│   │   └── index.ts
│   ├── services/          # API services
│   │   ├── api/          # Auto-generated API client (DO NOT EDIT)
│   │   └── apiConfig.ts  # API configuration
│   ├── utils/            # Utility functions
│   │   ├── dateUtils.ts
│   │   └── storage.ts
│   ├── styles/           # Global styles
│   │   ├── index.css
│   │   └── App.css
│   ├── App.tsx           # Main App component
│   ├── main.tsx          # Application entry point
│   └── vite-env.d.ts     # Vite environment types
├── .env.example          # Environment variables example
├── .gitignore           # Git ignore rules
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── tsconfig.node.json   # TypeScript config for Node
└── vite.config.ts       # Vite configuration
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` to set your API base URL and other configurations:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=PawpPanet
```

### 3. Generate API Client

Generate the TypeScript API client from the backend's OpenAPI specification:

```bash
npm run gen:api
```

This command will:
- Download the OpenAPI spec from the backend repository (levietducanh99/PawpPanet-backend)
- Generate TypeScript axios client code
- Place the generated code in `src/services/api/`

**Note:** You need to update the backend repository URL in the `gen:api` script in `package.json` to match your actual backend repository.

### 4. Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### 6. Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run gen:api` - Generate API client from OpenAPI spec

## API Generation

The project uses `@openapitools/openapi-generator-cli` to automatically generate TypeScript API clients from the backend's OpenAPI specification.

### Updating the gen:api Script

The `gen:api` script in `package.json` is currently configured to download the OpenAPI spec from:

```
https://raw.githubusercontent.com/levietducanh99/PawpPanet-backend/main/src/main/resources/openapi.yaml
```

**Important:** Update this URL to match your actual backend repository:
- Change the repository owner if needed: `levietducanh99`
- Change the repository name if needed: `PawpPanet-backend`
- Change the branch if needed: `main`
- Change the file path if your OpenAPI spec is located elsewhere

### Alternative: Using a URL

If your backend exposes the OpenAPI spec via an HTTP endpoint, you can modify the script:

```json
"gen:api": "openapi-generator-cli generate -i http://your-backend-url/api/openapi.yaml -g typescript-axios -o src/services/api --skip-validate-spec --additional-properties=useSingleRequestParameter=true"
```

## Technology Stack

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **React Router** - Routing (if needed)
- **ESLint** - Code linting

## Code Style

This project follows TypeScript and React best practices:
- Functional components with hooks
- TypeScript for type safety
- ESLint for code quality
- Organized file structure

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Build the project: `npm run build`
5. Commit your changes
6. Create a pull request

## License

[Your License Here]