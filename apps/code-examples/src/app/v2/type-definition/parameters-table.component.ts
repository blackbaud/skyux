import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyManifestParameterDefinition } from '@skyux/manifest';

import { SkyEscapeHtmlPipe } from './pipes/escape-html.pipe';
import { SkyMarkdownPipe } from './pipes/markdown.pipe';
import { SkyDocsParameterNamePipe } from './pipes/parameter-name.pipe';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    SkyEscapeHtmlPipe,
    SkyMarkdownPipe,
    SkyDocsParameterNamePipe,
  ],
  selector: 'sky-type-definition-parameters-table',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <table class="sky-type-definition-table sky-margin-stacked-xl">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        @for (parameter of parameters(); track parameter.name) {
          <tr>
            <td>
              <code
                [innerHTML]="parameter | skyDocsParameterName | skyEscapeHtml"
              ></code>
            </td>
            <td>
              @if (parameter.description) {
                <p [innerHTML]="parameter.description | skyMarkdown"></p>
              }

              <pre
                style="border: 1px solid red;overflow:auto;width:100%;height:250px;"
                >{{ parameter | json }}</pre
              >
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class SkyTypeDefinitionParametersTableComponent {
  // readonly #paramPipe = inject(SkyDocsParameterNamePipe);

  public parameters = input.required<SkyManifestParameterDefinition[]>();

  // protected getParameterName(def: SkyManifestParameterDefinition): string {
  //   return `${def.name}${def.isOptional ? '?' : ''}: ${def.type}`;
  // }
}
