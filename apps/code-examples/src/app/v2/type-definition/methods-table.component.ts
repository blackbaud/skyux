import { JsonPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';
import { SkyCodeSnippetModule } from '@skyux/docs-tools';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import {
  SkyManifestClassMethodDefinition,
  SkyManifestParentDefinition,
} from '@skyux/manifest';

import { SkyMarkdownPipe } from '../markdown/markdown.pipe';
import { SkySafeHtmlPipe } from '../safe-html/safe-html.pipe';

import { SkyDeprecationReasonComponent } from './deprecation-reason.component';
import { SkyDocsPropertyTypeDefinitionDefaultValuePipe } from './pipes/default-value.pipe';
import { SkyDocsParameterNamePipe } from './pipes/parameter-name.pipe';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    NgClass,
    SkyCodeSnippetModule,
    SkyMarkdownPipe,
    SkySafeHtmlPipe,
    SkyStatusIndicatorModule,
    SkyDeprecationReasonComponent,
    SkyDocsParameterNamePipe,
    SkyDocsPropertyTypeDefinitionDefaultValuePipe,
  ],
  providers: [SkyDocsParameterNamePipe],
  selector: 'sky-type-definition-methods-table',
  styles: `
    :host {
      display: block;
    }

    .sky-type-definition-table {
      width: 100%;
      border-spacing: 0;
      border-collapse: collapse;
      table-layout: fixed;

      td,
      th {
        border-bottom: 1px solid var(--sky-border-color-neutral-medium);
        text-align: left;
        font-size: 15px;
      }

      td {
        padding: 8px 16px;
      }

      th {
        padding: 14px 16px;
        font-weight: 600;
      }
    }
  `,
  template: `
    <table class="sky-type-definition-table sky-margin-stacked-xl">
      <thead>
        <tr>
          <th width="20%">Name</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        @for (method of methods(); track method.name) {
          <tr>
            <td>
              <code
                [innerHTML]="getMethodName(method) | skySafeHtml"
                [ngClass]="{
                  'sky-text-strikethrough': method.isDeprecated,
                }"
              ></code>
            </td>
            <td>
              @if (method.deprecationReason) {
                <p>
                  <sky-deprecation-reason
                    class="sky-margin-stacked-sm"
                    [message]="method.deprecationReason"
                  />
                </p>
              }

              @if (method.description) {
                <p [innerHTML]="method.description | skyMarkdown"></p>
              }

              <sky-code-snippet
                class="sky-margin-stacked-sm"
                hideToolbar
                language="ts"
                [code]="getCodeSignature(method)"
              />

              @if (method.parameters) {
                <h5>Parameters</h5>

                <table class="sky-type-definition-table sky-margin-stacked-xl">
                  <thead>
                    <tr>
                      <th width="30%">Name</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (param of method.parameters; track param.name) {
                      <tr>
                        <td>
                          <code
                            [innerHTML]="
                              param | skyDocsParameterName | skySafeHtml
                            "
                          ></code>
                        </td>
                        <td>
                          @if (param.description) {
                            <p
                              [innerHTML]="param.description | skyMarkdown"
                            ></p>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              }

              <h5>Returns</h5>

              <p>
                <code
                  class="sky-codespan"
                  [innerHTML]="method.type | skySafeHtml"
                ></code>
              </p>

              @if (showData()) {
                <pre
                  style="border: 1px solid red;overflow:auto;width:100%;height:250px;"
                  >{{ method | json }}</pre
                >
              }
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class SkyTypeDefinitionMethodsTableComponent {
  public parentDefinition = input.required<SkyManifestParentDefinition>();
  public methods = input.required<SkyManifestClassMethodDefinition[]>();
  public showData = input(false, { transform: booleanAttribute });

  // TODO: Make this a pipe instead.
  protected getMethodName(method: SkyManifestClassMethodDefinition): string {
    const parent = this.parentDefinition();

    if ((method as SkyManifestClassMethodDefinition).isStatic) {
      return `${parent.name}.${method.name}`;
    }

    return `${method.name}`;
  }

  #paramPipe = inject(SkyDocsParameterNamePipe);

  // TODO: Make this a pipe instead.
  protected getCodeSignature(method: SkyManifestClassMethodDefinition): string {
    return (
      'public ' +
      method.name +
      '(' +
      (method.parameters?.map((p) => this.#paramPipe.transform(p)).join(', ') ??
        '') +
      '): ' +
      method.type
    );
  }
}
