import { JsonPipe, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Type } from '@angular/core';
import { getCodeExampleData } from '@skyux/code-examples';
import { getDocumentationGroup } from '@skyux/manifest';

// import documentationConfigJson from '@skyux/manifest/documentation-config.json';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, NgComponentOutlet],
  selector: 'app-code-examples-v2',
  template: `<div>
      @if (componentType) {
        <ng-template [ngComponentOutlet]="componentType" />
      }
    </div>
    <pre>{{ data | json }}</pre>`,
})
export default class CodeExamplesLandingComponent {
  protected componentType: Type<unknown> | undefined;

  protected data = getDocumentationGroup('@skyux/indicators', 'alert');

  constructor() {
    void this.#loadExamples();

    // TODO: loop through documentation-config.json and then call getCodeExampleData(docsId);
  }

  /**
   * Manifest is responsible for TypeDoc, docsIds.
   * Manifest generates the code examples data in the code-examples library... OR... the code-examples library uses the manifest to create the data?
   *
   * Using the manifest, get docsIds for all code examples for this documentation group.
   * For each docsId, load the code example data (type, files, etc.) from the code-examples package.
   */

  async #loadExamples(): Promise<void> {
    const data = await getCodeExampleData(
      'PopoversDropdownBasicExampleComponent',
    );

    this.componentType = data.componentType;
  }
}

/**
 * import { getCodeExampleData } from '@skyux/code-examples';
 * import docsConfig from '@skyux/manifest/documentation-config.json';
 *
 * for (const [packageName, config] of Object.entries(docsConfig)) {
 *   for (const group of config.groups) {
 *     const data = getDocumentationGroup(packageName, group);
 *
 *     for (const docsId of data.docsIds) {
 *        const { componentType,files,primaryFile } = await getCodeExampleData('some-docs-id');
 *     }
 *   }
 * }
 *
 *
 *
 *
 *
 */
