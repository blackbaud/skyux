import { JsonPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import {
  type SkyManifestClassPropertyDefinition,
  type SkyManifestDirectiveInputDefinition,
  type SkyManifestDirectiveOutputDefinition,
  type SkyManifestEnumerationMemberDefinition,
  type SkyManifestInterfacePropertyDefinition,
  type SkyManifestParentDefinition,
} from '@skyux/manifest';

import { SkyMarkdownPipe } from '../markdown/markdown.pipe';
import { SkySafeHtmlPipe } from '../safe-html/safe-html.pipe';

import { SkyDeprecationReasonComponent } from './deprecation-reason.component';
import { SkyDocsPropertyTypeDefinitionDefaultValuePipe } from './pipes/default-value.pipe';
import { SkyDocsPropertyNamePipe } from './pipes/property-name.pipe';

export type PropertyDefinition =
  | SkyManifestClassPropertyDefinition
  | SkyManifestInterfacePropertyDefinition
  | SkyManifestEnumerationMemberDefinition
  | SkyManifestDirectiveInputDefinition
  | SkyManifestDirectiveOutputDefinition;

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    NgClass,
    SkyMarkdownPipe,
    SkySafeHtmlPipe,
    SkyStatusIndicatorModule,
    SkyDeprecationReasonComponent,
    SkyDocsPropertyTypeDefinitionDefaultValuePipe,
    SkyDocsPropertyNamePipe,
  ],
  selector: 'sky-type-definition-properties-table',
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
        @let parentDef = parentDefinition();

        @for (property of properties(); track property.name) {
          <tr>
            <td>
              @if (property.kind === 'directive-input') {
                <code>&#64;Input()</code><br />
              }
              @if (property.kind === 'directive-output') {
                <code>&#64;Output()</code><br />
              }
              <code
                [innerHTML]="
                  property | skyDocsPropertyName: parentDef | skySafeHtml
                "
                [ngClass]="{
                  'sky-text-strikethrough': property.isDeprecated,
                }"
              ></code>
            </td>
            <td>
              @if (property.deprecationReason) {
                <p>
                  <sky-deprecation-reason
                    class="sky-margin-stacked-sm"
                    [message]="property.deprecationReason"
                  />
                </p>
              }

              @if (property.description) {
                <p [innerHTML]="property.description | skyMarkdown"></p>
              }

              @let defaultValue = property | skyDocsPropertyDefaultValue;

              @if (defaultValue) {
                <p>
                  Default:
                  <code [innerHTML]="defaultValue | skySafeHtml"></code>
                </p>
              }

              @if (showData()) {
                <pre
                  style="border: 1px solid red;overflow:auto;width:100%;height:250px;max-width:500px;"
                  >{{ property | json }}</pre
                >
              }
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class SkyTypeDefinitionPropertiesTableComponent {
  public parentDefinition = input.required<SkyManifestParentDefinition>();
  public properties = input.required<PropertyDefinition[]>();
  public showData = input(false, { transform: booleanAttribute });
}
