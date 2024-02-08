# AIRe Talk

This is the source code for AIRe Talk web app.

## Project setup

```sh
npm install
```

You can switch between local APIs and staging APIs deployed in Azure by modifying `main.ts`.

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

VS Code: Use Vue Language Features plugin (`vue.volar`) as your formatting tool to automatically format your Vue component sources.

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
