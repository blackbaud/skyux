import {
  Injectable
} from '@angular/core';

import {
  SkyDocsCodeExample,
  SkyDocsCodeExamplesProvider
} from './public';

@Injectable()
export class SkyPopoversCodeExamplesProvider extends SkyDocsCodeExamplesProvider {

  constructor() {
    super();
  }

  public getCodeExamples(): SkyDocsCodeExample[] {
    return [
      {
        title: 'Standard implementation',
        sourceFiles: [
          {
            fileName: 'tabs.component.html',
            rawContents: `<sky-tabs></sky-tabs>`
          },
          {
            fileName: 'tabs.component.scss',
            rawContents: `.tabs {
  display: block;
}`
          },
          {
            fileName: 'tabs.component.ts',
            rawContents: `@Component({})
export class TabsComponent {}`
          }
        ]
      },
      {
        title: 'Advanced implementation',
        sourceFiles: []
      }
    ];
  }
}
