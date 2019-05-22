import {
  Injectable
} from '@angular/core';

import StackBlitzSDK from '@stackblitz/sdk';

import {
  Project as StackBlitzProject,
  OpenOptions as StackBlitzOpenOptions
} from '@stackblitz/sdk/typings/interfaces';

import {
  SkyDocsCodeExampleModuleDependencies
} from './code-example-module-dependencies';

@Injectable()
export class SkyDocsCodeExampleEditorService {

  public launchEditor(
    dependencies: SkyDocsCodeExampleModuleDependencies
  ): void {

    const project = this.getPayload(
      dependencies
    );

    const options: StackBlitzOpenOptions = {};

    StackBlitzSDK.openProject(project, options);
  }

  private getPayload(
    dependencies: SkyDocsCodeExampleModuleDependencies
  ): StackBlitzProject {

    const angularVersion = '^7.0.0';
    const skyuxVersion = '^3.0.0';

    const defaultDependencies: SkyDocsCodeExampleModuleDependencies = {
      '@angular/animations': angularVersion,
      '@angular/common': angularVersion,
      '@angular/compiler': angularVersion,
      '@angular/core': angularVersion,
      '@angular/forms': angularVersion,
      '@angular/http': angularVersion,
      '@angular/platform-browser': angularVersion,
      '@angular/platform-browser-dynamic': angularVersion,
      '@angular/router': angularVersion,
      '@skyux/animations': skyuxVersion,
      '@skyux/assets': skyuxVersion,
      '@skyux/config': skyuxVersion,
      '@skyux/core': skyuxVersion,
      '@skyux/errors': skyuxVersion,
      '@skyux/forms': skyuxVersion,
      '@skyux/http': skyuxVersion,
      '@skyux/i18n': skyuxVersion,
      '@skyux/indicators': skyuxVersion,
      '@skyux/layout': skyuxVersion,
      '@skyux/modals': skyuxVersion,
      '@skyux/popovers': skyuxVersion,
      '@skyux/router': skyuxVersion,
      '@skyux/theme': skyuxVersion,
      'core-js': '2.6.5',
      'rxjs': '^6.0.0',
      'rxjs-compat': '^6.0.0',
      'tslib': '1.9.3',
      'zone.js': '~0.8.28'
    };

    const mergedDependencies = Object.assign({}, defaultDependencies, dependencies);

    const files = this.parseStackBlitzFiles(mergedDependencies);

    return {
      files,
      title: 'SKY UX Demo',
      description: 'SKY UX Demo',
      template: 'angular-cli',
      dependencies: mergedDependencies,
      settings: {
        compile: {
          clearConsole: false
        }
      }
    };
  }

  private parseStackBlitzFiles(
    dependencies: SkyDocsCodeExampleModuleDependencies
  ): {
    [path: string]: string;
  } {

    const srcPath = 'src/';
    const appPath = `${srcPath}app/`;

    const banner = `/**
 * This file is needed for the StackBlitz demo only.
 * It is automatically built when using SKY UX CLI.
 * Visit https://developer.blackbaud/skyux for more information
 **/
 `;

    const declarations: string[] = [
      'AppComponent'
    ];
    const entryComponents: string[] = [];
    const moduleImports: string[] = [];
    const providers: string[] = [];
    const skyModules: string[] = [];

    const appComponentTemplate = '';

    const files: {[_: string]: string} = {};

    files[`${appPath}app.component.ts`] = `${banner}
import {
  Component
} from '@angular/core';

@Component({
  selector: 'sky-demo-app',
  template: '${appComponentTemplate}'
})
export class AppComponent { }`;

    files[`${appPath}app.module.ts`] = `import {
  Component,
  NgModule
} from '@angular/core';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  platformBrowserDynamic
} from '@angular/platform-browser-dynamic';

import {
  BrowserModule
} from '@angular/platform-browser';

import {
  RouterModule
} from '@angular/router';

import {
  AppSkyModule
} from './app-sky.module';

${moduleImports.join('\n')}

import {
  AppComponent
} from './app.component';

@NgModule({
  imports: [
    AppSkyModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([])
  ],
  declarations: [
    ${declarations.join(',\n')}
  ],
  entryComponents: [
    ${entryComponents.join(',\n')}
  ],
  providers: [
    ${providers.join(',\n')}
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
`;

    files[`${appPath}app-sky.module.ts`] = `import {
  NgModule
} from '@angular/core';

@NgModule({
  exports: [
    ${skyModules.join(',\n    ')}
  ]
})
export class AppSkyModule { }
`;

    files[`${srcPath}index.html`] = `<sky-demo-app>
  Loading...
</sky-demo-app>`;

    files[`${srcPath}main.ts`] = `${banner}
import './polyfills';

import {
  enableProdMode
} from '@angular/core';

import {
  platformBrowserDynamic
} from '@angular/platform-browser-dynamic';

import {
  AppModule
} from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
  if (window['ngRef']) {
    window['ngRef'].destroy();
  }

  window['ngRef'] = ref;
}).catch(err => console.error(err));
`;

    files[`${srcPath}polyfills.ts`] = `${banner}
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
`;

    files[`${srcPath}styles.scss`] = `@import '~@skyux/theme/css/sky';

body {
  background-color: #fff;
  margin: 15px;
}`;

    files['angular.json'] = `{
  "projects": {
    "demo": {
      "architect": {
        "build": {
          "options": {
            "index": "src/index.html",
            "styles": [
              "src/styles.scss"
            ]
          }
        }
      }
    }
  }
}`;

    files['package.json'] = JSON.stringify({ dependencies }, undefined, 2);

    files['tsconfig.json'] = `{
  "compilerOptions": {
    "target": "es5",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "lib": [
      "dom",
      "es6"
    ]
  }
}`;

    return files;
  }

}
