import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SkyAppAssetsService } from '@skyux/assets';
import stackblitz from '@stackblitz/sdk';

import { Observable, of, throwError } from 'rxjs';

import { SkyDocsStackBlitzLaunchConfig } from './stackblitz-launch-config';
import { SkyDocsStackBlitzService } from './stackblitz.service';

describe('stackblitz.service', () => {
  function setupTest(options: {
    assetsMap?: Record<string, string>;
    provideHttpClient?: boolean;
    templateFiles?: Record<string, string>;
  }): {
    defaultConfig: SkyDocsStackBlitzLaunchConfig;
    openProjectSpy: jasmine.Spy;
    stackblitzSvc: SkyDocsStackBlitzService;
  } {
    const providers: unknown[] = [];

    const assetsMap = options.assetsMap;

    if (assetsMap) {
      providers.push({
        provide: SkyAppAssetsService,
        useValue: {
          getUrl(url: string): string {
            return assetsMap[url];
          },
        },
      });
    }

    if (options.provideHttpClient !== false) {
      providers.push(provideHttpClient());
    }

    TestBed.configureTestingModule({
      providers,
    });

    if (options.provideHttpClient !== false) {
      spyOn(TestBed.inject(HttpClient), 'get').and.callFake(((
        url: string,
      ): Observable<string> => {
        if (options.templateFiles) {
          if (Object.keys(options.templateFiles).includes(url)) {
            return of(options.templateFiles[url]);
          }
        }

        return throwError(() => new Error('Not found.'));
      }) as never);
    }

    const defaultConfig: SkyDocsStackBlitzLaunchConfig = {
      componentName: 'FooExampleComponent',
      componentSelector: 'foo-example',
      files: {
        'example.component.html': 'HTML_CONTENTS',
        'example.component.scss': 'SCSS_CONTENTS',
        'example.component.ts': 'TS_CONTENTS',
      },
      primaryFile: 'example.component.ts',
      title: 'Foo basic example',
    };

    const openProjectSpy = spyOn(stackblitz, 'openProject');

    const stackblitzSvc = TestBed.inject(SkyDocsStackBlitzService);

    return { defaultConfig, openProjectSpy, stackblitzSvc };
  }

  it('should launch StackBlitz', async () => {
    const { defaultConfig, openProjectSpy, stackblitzSvc } = setupTest({
      templateFiles: {
        'assets/stack-blitz/package.json': 'PACKAGE_JSON_CONTENTS',
        'assets/stack-blitz/package-lock.json': 'PACKAGE_LOCK_JSON_CONTENTS',
      },
    });

    await stackblitzSvc.launch(defaultConfig);

    expect(openProjectSpy).toHaveBeenCalledWith(
      {
        title: defaultConfig.title,
        files: {
          'src/example/example.component.html': 'HTML_CONTENTS',
          'src/example/example.component.scss': 'SCSS_CONTENTS',
          'src/example/example.component.ts': 'TS_CONTENTS',
          'package.json': 'PACKAGE_JSON_CONTENTS',
          'package-lock.json': 'PACKAGE_LOCK_JSON_CONTENTS',
          '.stackblitzrc': `{
  "installDependencies": true,
  "startCommand": "ng serve"
}
`,
          'angular.json': `{
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
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": ["src/assets"],
            "styles": [
              "@skyux/theme/css/sky.css",
              "@skyux/theme/css/themes/modern/styles.css",
              "@skyux/ag-grid/css/sky-ag-grid.css",
              "src/styles.scss"
            ],
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
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "buildTarget": "example-app:build"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "main": "src/test.ts",
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ],
            "tsConfig": "tsconfig.spec.json",
            "karmaConfig": "karma.conf.js",
            "inlineStyleLanguage": "scss",
            "assets": ["src/assets"],
            "stylePreprocessorOptions": {
              "includePaths": ["node_modules/"]
            },
            "styles": [
              "@skyux/theme/css/sky.css",
              "@skyux/theme/css/themes/modern/styles.css",
              "@skyux/ag-grid/css/sky-ag-grid.css",
              "src/styles.scss"
            ],
            "scripts": []
          }
        }
      }
    }
  }
}
`,
          'karma.conf.js': `// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with \`random: false\`
        // or set a specific seed with \`seed: 4321\`
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/example-app'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
  });
};
`,
          'tsconfig.app.json': `{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": ["src/main.ts"],
  "include": ["src/**/*.d.ts"]
}
`,
          'tsconfig.json': `{
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
`,
          'tsconfig.spec.json': `{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["jasmine"]
  },
  "files": ["src/test.ts"],
  "include": ["src/**/*.spec.ts", "src/**/*.d.ts"]
}
`,
          'src/help.service.ts': `import { Injectable } from '@angular/core';
import {
  SkyHelpOpenArgs,
  SkyHelpService,
  SkyHelpUpdateArgs,
} from '@skyux/core';

@Injectable()
export class ExampleHelpService extends SkyHelpService {
  public override openHelp(args?: SkyHelpOpenArgs): void {
    console.log(\`Help opened with key '\${args?.helpKey}'.\`);
  }

  public override updateHelp(args: SkyHelpUpdateArgs): void {
    /* */
  }
}
`,
          'src/index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Foo basic example</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!--
      The CSS links are needed for the StackBlitz demo only.
      This is a workaround for a known bug that prevents external imports in CSS.
      https://github.com/stackblitz/core/issues/133
    -->
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="https://sky.blackbaudcdn.net/static/skyux-icons/9/assets/css/skyux-icons.min.css" crossorigin="anonymous">
  </head>
  <body>
    <foo-example></foo-example>
  </body>
</html>
`,
          'src/main.ts': `import { provideHttpClient } from '@angular/common/http';
import {
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SkyHelpService } from '@skyux/core';
import { provideInitialTheme } from '@skyux/theme';
import { provideRouter } from '@angular/router';
import { FooExampleComponent } from './example/example.component';

import { ExampleHelpService } from './help.service';

/**
 * The help service must be provided for components that set the
 * \`helpKey\` attribute. For more information, review the global help
 * documentation.
 * @see https://developer.blackbaud.com/skyux/learn/develop/global-help
 */
function provideExampleHelpService(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SkyHelpService, useClass: ExampleHelpService },
  ]);
}

bootstrapApplication(FooExampleComponent, {
  providers: [
    provideAnimations(),
    provideInitialTheme('modern'),
    provideHttpClient(),
    provideExampleHelpService(),
    provideRouter([]),
  ],
}).catch((err) => console.error(err));
`,
          'src/styles.scss': '',
          'src/test.ts': `// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import {getTestBed} from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// Then we find all the tests.
const context = (import.meta as any).webpackContext('./', {
  recursive: true,
  regExp: /\\.spec\\.ts$/,
});

// And load the modules.
context.keys().map(context);
`,
        },
        template: 'node',
      },
      { openFile: defaultConfig.primaryFile },
    );
  });

  it('should throw if template files not found', async () => {
    const { defaultConfig, stackblitzSvc } = setupTest({
      templateFiles: undefined,
    });

    await expectAsync(
      stackblitzSvc.launch(defaultConfig),
    ).toBeRejectedWithError(
      'Failed to read StackBlitz template file: package.json',
    );
  });

  it('should handle ".template" files', async () => {
    const { defaultConfig, openProjectSpy, stackblitzSvc } = setupTest({
      templateFiles: {
        'assets/stack-blitz/package.json.template': 'PACKAGE_JSON_CONTENTS',
        'assets/stack-blitz/package-lock.json.template':
          'PACKAGE_LOCK_JSON_CONTENTS',
      },
    });

    await stackblitzSvc.launch(defaultConfig);

    expect(openProjectSpy).toHaveBeenCalled();
  });

  it('should handle unresolved HttpClient', async () => {
    const { defaultConfig, stackblitzSvc } = setupTest({
      provideHttpClient: false,
      templateFiles: {
        'assets/stack-blitz/package.json': 'PACKAGE_JSON_CONTENTS',
        'assets/stack-blitz/package-lock.json': 'PACKAGE_LOCK_JSON_CONTENTS',
      },
    });

    await expectAsync(
      stackblitzSvc.launch(defaultConfig),
    ).toBeRejectedWithError(
      'Failed to read StackBlitz template file: package.json',
    );
  });

  it('should use assets service to resolve hashed template urls', async () => {
    const { defaultConfig, openProjectSpy, stackblitzSvc } = setupTest({
      assetsMap: {
        'stack-blitz/package.json': 'stack-blitz/package-HASH.json',
        'stack-blitz/package-lock.json': 'stack-blitz/package-HASH.json',
      },
      templateFiles: {
        'stack-blitz/package-HASH.json': 'PACKAGE_JSON_CONTENTS',
        'stack-blitz/package-lock-HASH.json': 'PACKAGE_LOCK_JSON_CONTENTS',
      },
    });

    await stackblitzSvc.launch(defaultConfig);

    expect(openProjectSpy).toHaveBeenCalled();
  });
});
