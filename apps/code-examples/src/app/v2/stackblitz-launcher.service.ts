import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SkyAppAssetsService } from '@skyux/assets';
import stackblitz from '@stackblitz/sdk';

import { firstValueFrom } from 'rxjs';

export const TEMPLATE_FILES = [
  '.gitignore.template',
  '.stackblitzrc.template',
  'angular.json.template',
  'karma.conf.js.template',
  'package.json',
  'package-lock.json',
  'tsconfig.app.json.template',
  'tsconfig.json.template',
  'tsconfig.spec.json.template',
  // 'src/index.html.template',
  // 'src/main.ts.template',
  'src/styles.scss.template',
  // 'src/test.ts.template',
];

@Injectable({ providedIn: 'root' })
export class StackBlitzLauncherService {
  readonly #http = inject(HttpClient);
  readonly #assetsSvc = inject(SkyAppAssetsService);

  public async launch(data: {
    componentImportPath: string;
    componentName: string;
    componentSelector: string;
    files: Record<string, string>;
    primaryFile: string;
    title: string;
  }): Promise<void> {
    // load files from the assets service.

    const files: Record<string, string> = {};

    for (const [file, contents] of Object.entries(data.files)) {
      if (file === data.primaryFile) {
        data.primaryFile = `src/example/${file}`;
      }

      files[`src/example/${file}`] = contents;
    }

    for (const file of TEMPLATE_FILES) {
      const contents = await firstValueFrom(
        this.#http.get(`assets/stack-blitz/${file}`, { responseType: 'text' }),
      ).catch(() => {
        console.error(`Failed to retrieve file: ${file}`);
      });

      if (contents !== undefined) {
        files[file.replace(/\.template$/, '')] = contents;
      }
    }

    const bootstrapImportPath = `./${data.primaryFile.replace(/\.ts$/, '').replace(/^src\//, '')}`;

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

    const assets = this.#assetsSvc.getAllUrls();

    console.log('assets:', assets, files);

    stackblitz.openProject(
      {
        title: 'SKY UX',
        description: 'Code example',
        files,
        template: 'node',
      },
      { openFile: data.primaryFile },
    );
  }
}
