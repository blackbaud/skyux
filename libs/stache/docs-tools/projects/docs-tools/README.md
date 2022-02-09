# @skyux/docs-tools

[![npm](https://img.shields.io/npm/v/@skyux/docs-tools.svg)](https://www.npmjs.com/package/@skyux/docs-tools)
![SKY UX CI](https://github.com/blackbaud/skyux-docs-tools/workflows/SKY%20UX%20CI/badge.svg)
[![coverage](https://codecov.io/gh/blackbaud/skyux-docs-tools/branch/master/graphs/badge.svg?branch=master)](https://codecov.io/gh/blackbaud/skyux-docs-tools/branch/master)

## Getting Started

- Run `npm i -ED @skyux/docs-tools`. Pay attention to the peer dependency warnings and install any missing packages as `devDependencies`.

- Run `npm i -ED @skyux-sdk/builder-plugin-skyux`.

- Remove any custom styles that are hiding the Omnibar. Instead, create a **skyuxconfig.e2e.json** file with the following contents:

```
{
  "omnibar": false
}
```

- Open **skyuxconfig.json** and add the following:

```
{
  // ...

  "host": {
    "url": "https://developer.blackbaud.com"
  },
  "omnibar": {},
  "params": {
    "svcid": {
      "value": "skyux"
    }
  },
  "app": {
    "styles": [
      "@skyux/docs-tools/css/docs-tools.css"
    ]
  }

  // ...
}
```

- Open **app-extras.module.ts** and add the following contents to your `AppExtrasModule` (modify the options to fit your project):

```
import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

@NgModule({
  exports: [
    SkyDocsToolsModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-sample',
        packageName: '@skyux/sample'
      }
    }
  ]
})
export class AppExtrasModule { }
```

- Create the following files (as you would normally when creating a new SPA route):

  - **./src/app/docs/[module-name]/index.html**
  - **./src/app/docs/[module-name]/[module-name]-docs.component.html**
  - **./src/app/docs/[module-name]/[module-name]-docs.component.ts**

- Add the following contents to the component's HTML file:

```
<sky-docs-demo-page
  moduleName="SkySampleModule"
  moduleSourceCodePath="src/app/public/modules/[module-name]/"
  pageTitle="Sample page title"
>
  <sky-docs-demo-page-summary>
    Sample description.
  </sky-docs-demo-page-summary>

  <sky-docs-demo>
    See documentation for how to setup demos.
  </sky-docs-demo>

  <sky-docs-design-guidelines>
    See documentation for how to setup design guidelines.
  </sky-docs-design-guidelines>

  <sky-docs-code-examples>
    See documentation for how to setup code examples.
  </sky-docs-code-examples>
</sky-docs-demo-page>
```

- Add package dependencies for demos

```
  <sky-docs-code-examples
    [packageDependencies]="{
      '@skyux/lookup': '*',
      'intl-tel-input': '*'
    }"
  >
```

## JSDoc comments

### Features:

- Accepts markdown.
- Links to internal types are automatically added.

### Tags:

- `@example` Specifies an inline code example.
- `@internal` Hides the property or type from documentation.
- `@default` Deliberately specifies a default value if one isn't obvious from the source code (for example, when a getter/setter is used).
- `@deprecated` Marks a type or property as deprecated, along with a message for what the user should do about it.
- `@required` Marks a property as required. The required state of a property cannot be directly implied from the source code, so this tag must be used whenever a field should be marked as required in the documentation.
- `@param` Provides a description for a specific parameter in a method or function.

## Code Examples

- Code examples are automatically generated from source code added to `./src/app/public/plugin-resources/code-examples`.
- Each code example should be self-contained (in its own folder) and have its own module. The module will dictate its own exports, imports, providers, or entry components.
- Code examples are not instrumented for code coverage and are not included in any build results.
- Any additional NPM packages that are needed for the code example to run should be added to the `packageDependencies` attribute on the `SkyDocsCodeExamples` component.
