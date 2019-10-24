import {
  Injectable
} from '@angular/core';

import StackBlitzSDK from '@stackblitz/sdk';

import {
  OpenOptions as StackBlitzOpenOptions,
  Project as StackBlitzProject
} from '@stackblitz/sdk/typings/interfaces';

import {
  SkyDocsSourceCodeFile
} from '../source-code/source-code-file';

import {
  SkyDocsCodeExampleModuleDependencies
} from './code-example-module-dependencies';

import {
  SkyDocsCodeExample
} from './code-example';

@Injectable()
export class SkyDocsCodeExamplesEditorService {

  public launchEditor(codeExample: SkyDocsCodeExample): void {
    const project = this.getPayload(codeExample);
    const options: StackBlitzOpenOptions = {};

    StackBlitzSDK.openProject(project, options);
  }

  private getPayload(codeExample: SkyDocsCodeExample): StackBlitzProject {
    const angularVersion = '^7.0.0';
    const skyuxVersion = '*';

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
      'core-js': '^2.6.5',
      'rxjs': '^6.0.0',
      'rxjs-compat': '^6.0.0',
      'tslib': '1.9.3',
      'zone.js': '~0.8.29'
    };

    const mergedDependencies = Object.assign(
      {},
      defaultDependencies,
      codeExample.packageDependencies
    );

    const files = this.parseStackBlitzFiles(
      codeExample.sourceCode,
      mergedDependencies
    );

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
    sourceCode: SkyDocsSourceCodeFile[],
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

    const moduleImportStatements: string[] = [
      `import {\n  Component,\n  NgModule\n} from '@angular/core';`,
      `import {\n  FormsModule,\n  ReactiveFormsModule\n} from '@angular/forms';`,
      `import {\n  platformBrowserDynamic\n} from '@angular/platform-browser-dynamic';`,
      `import {\n  BrowserModule\n} from '@angular/platform-browser';`,
      `import {\n  RouterModule\n} from '@angular/router';`,
      `import {\n  AppComponent\n} from './app.component';`
    ];

    const moduleImports: string[] = [
      'BrowserModule',
      'FormsModule',
      'ReactiveFormsModule',
      'RouterModule.forRoot([])'
    ];

    const files: {[_: string]: string} = {};

    let appComponentTemplate = '';

    sourceCode.forEach((file) => {
      files[`${appPath}${file.fileName}`] = file.rawContents;

      // Setup module imports and component selectors.
      if (file.fileName.indexOf('.module.ts') > -1) {
        const moduleName = this.getModuleName(file.rawContents);
        const importPath = `./${this.getFilenameNoExtension(file.fileName)}`;

        const exportedComponent = this.getExportedComponent(file.rawContents);
        const componentSelector = this.getComponentSelector(exportedComponent, sourceCode);

        appComponentTemplate += `<${componentSelector}></${componentSelector}>`;

        moduleImports.push(moduleName);
        moduleImportStatements.push(`import {\n  ${moduleName}\n} from '${importPath}';`);
      }
    });

    files[`${appPath}app.component.ts`] = `${banner}
import {
  Component
} from '@angular/core';

@Component({
  selector: 'sky-demo-app',
  template: '${appComponentTemplate}'
})
export class AppComponent { }`;

    files[`${appPath}app.module.ts`] = `${moduleImportStatements.join('\n\n')}

@NgModule({
  imports: [
    ${moduleImports.join(',\n    ')}
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
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

    files['package.json'] = JSON.stringify({
      dependencies
    }, undefined, 2);

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

  private getModuleName(contents: string): string {
    return contents.split('export class ')[1].split(' {')[0];
  }

  private getFilenameNoExtension(fileName: string): string {
    const extension = fileName.split('.').pop();
    return fileName.replace(`.${extension}`, '');
  }

  private getExportedComponent(contents: string): string {
    const trimmed = contents.replace(/\s/g, '');

    let fragment = trimmed.split('exports:[')[1];
    if (!fragment) {
      throw 'You must export a component from the code example module!';
    }

    fragment = fragment.split(']')[0];

    const components = fragment.split(',');

    if (components.length > 1) {
      throw 'You may only export a single component from the code example module' +
        `(we found ${components.length}: ${components.join(', ')}).` +
        'Is it possible to create a new code example with the extra components?';
    }

    return components[0];
  }

  private getComponentSelector(
    componentClassName: string,
    sourceCode: SkyDocsSourceCodeFile[]
  ): string {

    const found = sourceCode.find((file) => {
      return (file.rawContents.indexOf(componentClassName) > -1);
    });

    const trimmed = found.rawContents.replace(/\s/g, '');

    return trimmed.split(`selector:'`)[1].split(`'`)[0];
  }

}
