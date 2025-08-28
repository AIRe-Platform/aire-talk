# AIRe Talk

This is the source code for AIRe Talk web app.

## Project setup

```sh
npm install
```

Create a file `.env.local` in the root of the project directory. Place the following environment values in it:

```sh
VITE_COMMIT_TAG="local build"
VITE_AIRE_SERVICES_ENDPOINT="http://localhost:7071/api"
VITE_AIRE_CLIENT_ID=b25e388d-ec5e-4f8b-adc4-5793cfe75621
```

Change the `VITE_AIRE_CLIENT_ID` to match the app's client ID you have configured in AIRe ID service. See AIRe ID for more information.

### Compiles and hot-reloads for development

Either run the following command or hit F5 in VS Code.

```sh
npm run serve
```

### Compiles and minifies for production

```sh
npm run build
```

## Code Style and Formatting Guidelines

VS Code: Use Vue Language Features plugin as your formatting tool to automatically format your Vue component sources.

### Indentation

- Use spaces, length 4
- Do not start `<script>` and `<style>` blocks of the Vue components indented.
- The content of `<template>` blocks should start indented.

### Naming

- Variables: `camelCase` or `snake_case`. Keep the names simple and descriptive.
- Data Members, Fields, Properties: `snake_case`
- Methods and Functions: `camelCase`
- Types, Interfaces, and Classes: `PascalCase`
- CSS classes, HTML element IDs: `kebab-case`
- Vue Components: `PascalCase`

### Best Practices

- Avoid installing NPM packages for trivial tasks.
- Do not commit test data. Prefer keeping it separate from the source.
- Clean up your console messages when done debugging.
- Write clear readable code, avoid comments that don't provide any value.
  - Careful naming and wise use of whitespace helps a lot.
- DO comment your code when your algorithm is particularly complex. 
  - Make sure the comments are accurate and keep them updated after code changes.
- No empty CSS classes.
- Use Vue's Composition API.

## Environment Values

- `VITE_COMMIT_HASH` Adds commit hash into the page footer
- `VITE_COMMIT_TAG` Adds tag into the page footer
- `VITE_AIRE_SERVICES_ENDPOINT` URL to the AIRe Services API endpoints.
- `VITE_AIRE_CLIENT_ID` Client identifier GUID (registered in AIRe ID).

## Manual Deployment to Azure Static Web Apps

Create `.env.production` file:

```sh
VITE_COMMIT_TAG="production"
VITE_AIRE_SERVICES_ENDPOINT="https://url-to-production-services/api"
VITE_AIRE_CLIENT_ID=production-client-id
```

Build the project using `npm run build`.

Install Static Web Apps CLI if you don't have it:

```sh
npm install -g @azure/static-web-apps-cli
```

Deploy the app using Static Web Apps CLI:

```sh
swa deploy ./dist --app-name $YOUR_APP_NAME --env Production
```
