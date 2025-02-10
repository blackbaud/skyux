import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SkyAppAssetsService } from '@skyux/assets';
import stackblitz from '@stackblitz/sdk';

import { firstValueFrom } from 'rxjs';

export const TEMPLATE_FILES = [
  '.gitignore',
  '.stackblitzrc',
  'angular.json',
  // 'karma.conf.js',
  'package.json',
  'package-lock.json',
  'tsconfig.app.json',
  'tsconfig.json',
  'tsconfig.spec.json',
  // 'src/index.html',
  // 'src/main.ts',
  'src/styles.scss',
  // 'src/test.ts',
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
