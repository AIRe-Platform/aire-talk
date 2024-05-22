## TODO: Refactor this document to have an structure like this:
## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Configuration](#configuration)
5. [Contributing](#contributing)
6. [API Reference](#api-reference)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Roadmap](#roadmap)
10. [FAQ](#faq)
11. [Troubleshooting](#troubleshooting)
12. [License](#license)
13. [Acknowledgments](#acknowledgments)
14. [Contact](#contact)

# AIRe Talk

This is the source code for AIRe Talk web app.

## Project setup

```sh
npm install
```

To change the API endpoint, make a file `.env.local` like so:

```sh
VITE_AIRE_SERVICES_ENDPOINT="https://gl-dev-aire-services.azurewebsites.net/api/"
```

The above example make the app use staging APIs. If the environment value is not set, the app defaults to `http://localhost:7071/api`.

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

### Environment Values

- `VITE_COMMIT_HASH` Adds commit hash into the page footer
- `VITE_COMMIT_TAG` Adds tag into the page footer
