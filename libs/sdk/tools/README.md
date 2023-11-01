# Tools

This project holds workspace schematics for the monorepo.

## Configure Test Target CI Configuration

The CI pipeline uses `ci` configuration for running tests. Projects using the
`@angular-devkit/build-angular:karma` builder have settings around e.g., which browsers to use.

To update the configuration for Karma Jasmine tests, update settings in
`./src/generators/configure-test-ci/generator.ts` and run the following command:

```bash
npx nx g @skyux-sdk/tools:configure-test-ci
```

## Update Dependencies

During a major update, peer dependencies will need to be updated.

To update dependencies, run the following command:

```bash
npx nx g @skyux-sdk/tools:update-dependencies
```
