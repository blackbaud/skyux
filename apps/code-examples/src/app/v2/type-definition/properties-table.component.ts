import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import {
  SkyManifestChildDefinition,
  SkyManifestClassPropertyDefinition,
  SkyManifestParentDefinition,
} from '@skyux/manifest';

import { SkyMarkdownPipe } from '../markdown/markdown.pipe';
import { SkySafeHtmlPipe } from '../safe-html/safe-html.pipe';

import { SkyDeprecationReasonComponent } from './deprecation-reason.component';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    SkyMarkdownPipe,
    SkySafeHtmlPipe,
    SkyStatusIndicatorModule,
    SkyDeprecationReasonComponent,
  ],
  selector: 'sky-type-definition-properties-table',
  styles: `
    :host {
      display: block;
    }

    .sky-type-definition-deprecated {
      text-decoration: line-through;
    }

    .sky-type-definition-table {
      width: 100%;
      border-spacing: 0;
      border-collapse: collapse;

      td,
      th {
        border-bottom: 1px solid var(--sky-border-color-neutral-medium);
        text-align: left;
        width: 50%;
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
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
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
                  getPropertyName(parentDefinition(), property) | skySafeHtml
                "
                [ngClass]="{
                  'sky-type-definition-deprecated': property.isDeprecated,
                }"
              ></code>
            </td>
            <td>
              @if (property.description) {
                <p [innerHTML]="property.description | skyMarkdown"></p>
              }

              @if (property.deprecationReason) {
                <p>
                  <sky-deprecation-reason
                    class="sky-margin-stacked-sm"
                    [message]="property.deprecationReason"
                  />
                </p>
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
  public properties = input.required<SkyManifestChildDefinition[]>();

  protected getPropertyName(
    parent: SkyManifestParentDefinition,
    property: SkyManifestChildDefinition,
  ): string {
    switch (property.kind) {
      case 'class-method': {
        if ((property as SkyManifestClassPropertyDefinition).isStatic) {
          return `${parent.name}.${property.name}`;
        }

        return `${property.name}`;
      }

      case 'enum-member': {
        return `${parent.name}.${property.name}`;
      }

      case 'interface-property': {
        return `${property.name}?: ${property.type}`;
      }

      default: {
        return `${property.name}: ${property.type}`;
      }
    }
  }
}
