import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SkyAppAssetsService } from '@skyux/assets';
import stackblitz from '@stackblitz/sdk';

import { firstValueFrom } from 'rxjs';

export const TEMPLATE_FILES = [
  // '.stackblitzrc',
  // 'angular.json',
  'package.json',
  'package-lock.json',
  // 'tsconfig.app.json',
  // 'tsconfig.json',
  // 'tsconfig.spec.json',
  // 'src/index.html',
  // 'src/main.ts',
  // 'src/styles.scss',
];

@Injectable({ providedIn: 'root' })
export class StackBlitzLauncherService {
  readonly #http = inject(HttpClient);
  readonly #assetsSvc = inject(SkyAppAssetsService);

  public async launch(data: {
    componentName: string;
    componentSelector: string;
    files: Record<string, string>;
    primaryFile: string;
    title: string;
  }): Promise<void> {
    const files: Record<string, string> = {};

    for (const [file, contents] of Object.entries(data.files)) {
      files[`src/example/${file}`] = contents;
    }

    for (const file of TEMPLATE_FILES) {
      let contents = await this.#fetchTemplateFileContents(file);

      if (contents === undefined && !file.endsWith('.template')) {
        contents = await this.#fetchTemplateFileContents(`${file}.template`);
      }

      if (contents === undefined) {
        throw new Error(`Failed to retrieve StackBlitz template file: ${file}`);
      }

      files[file.replace(/\.template$/, '')] = contents;
    }

    const bootstrapImportPath = `./example/${data.primaryFile.replace(/\.ts$/, '')}`;

    files['.stackblitzrc'] = `{
  "installDependencies": true,
  "startCommand": "ng serve"
}
`;

    files['angular.json'] = `{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "cli": {
    "analytics": false
  },
  "newProjectRoot": "projects",
  "projects": {
    "example-app": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss"
        },
        "@schematics/angular:application": {
          "strict": true
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/example-app",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": ["zone.js", "@skyux/packages/polyfills"],
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": ["src/assets"],
            "styles": ["src/styles.scss"],
            "stylePreprocessorOptions": {
              "includePaths": ["node_modules/"]
            },
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "example-app:build:production"
            },
            "development": {
              "buildTarget": "example-app:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "polyfills": [
              "zone.js",
              "zone.js/testing",
              "@skyux/packages/polyfills"
            ],
            "tsConfig": "tsconfig.spec.json",
            "inlineStyleLanguage": "scss",
            "assets": ["src/assets"],
            "stylePreprocessorOptions": {
              "includePaths": ["node_modules/"]
            },
            "styles": ["src/styles.scss"],
            "scripts": []
          }
        }
      }
    }
  }
}
`;

    files['tsconfig.app.json'] = `{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": ["src/main.ts"],
  "include": ["src/**/*.d.ts"]
}
`;

    files['tsconfig.json'] = `{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "moduleResolution": "bundler",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022"
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
`;

    files['tsconfig.spec.json'] = `{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["jasmine"]
  },
  "files": ["src/test.ts"],
  "include": ["src/**/*.spec.ts", "src/**/*.d.ts"]
}
`;

    files['src/index.html'] = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${data.title}</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!--
      The CSS links are needed for the StackBlitz demo only.
      This is a workaround for a known bug that prevents external imports in CSS.
      https://github.com/stackblitz/core/issues/133
    -->
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="https://sky.blackbaudcdn.net/static/skyux-icons/7.10.0/assets/css/skyux-icons.min.css" crossorigin="anonymous">
  </head>
  <body>
    <${data.componentSelector}></${data.componentSelector}>
  </body>
</html>
`;

    files['src/main.ts'] =
      `import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideInitialTheme } from '@skyux/theme';
import { ${data.componentName} } from '${bootstrapImportPath}';

bootstrapApplication(${data.componentName}, {
  providers: [
    provideAnimations(),
    provideInitialTheme('modern'),
    provideHttpClient()
  ],
}).catch((err) => console.error(err));
`;

    files['src/styles.scss'] = `@import url('@skyux/theme/css/sky');
@import url('@skyux/theme/css/themes/modern/styles');

body {
  background-color: #fff;
  margin: 15px;
}
`;

    stackblitz.openProject(
      {
        title: data.title,
        files,
        template: 'node',
      },
      { openFile: data.primaryFile },
    );
  }

  async #fetchTemplateFileContents(file: string): Promise<string | undefined> {
    const filePath = `assets/stack-blitz/${file}`;
    const url = this.#assetsSvc.getUrl(filePath) ?? filePath;

    return await firstValueFrom(
      this.#http.get(url, { responseType: 'text' }),
    ).catch(() => {
      return undefined;
    });
  }
}
