import { JsonPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { SkyLabelModule, SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyDescriptionListModule } from '@skyux/layout';
import {
  type SkyManifestChildDefinition,
  type SkyManifestDocumentationTypeDefinition,
  isDirectiveDefinition,
} from '@skyux/manifest';

import { SkyElementAnchorDirective } from '../element-anchor/element-anchor.directive';
import { SkyMarkdownPipe } from '../markdown/markdown.pipe';
import { SkySafeHtmlPipe } from '../safe-html/safe-html.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    NgClass,
    SkySafeHtmlPipe,
    SkyDescriptionListModule,
    SkyElementAnchorDirective,
    SkyLabelModule,
    SkyMarkdownPipe,
    SkyStatusIndicatorModule,
  ],
  selector: 'sky-type-definition',
  styles: `
    :host {
      display: block;
      margin-bottom: 40px;
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
  // templateUrl: './type-definition.component.html',
  template: `@let def = definition();

    <h3
      [attr.id]="def.anchorId"
      [ngClass]="{
        'sky-type-definition-deprecated': def.isDeprecated,
      }"
      skyElementAnchor
    >
      <code>{{ def.name }}</code>
    </h3>

    @if (def.deprecationReason) {
      <sky-status-indicator descriptionType="warning" indicatorType="warning">
        <div
          [innerHTML]="
            '<strong>Deprecated. </strong>' + def.deprecationReason
              | skyMarkdown
          "
        ></div>
      </sky-status-indicator>
    }

    @if (def.description) {
      <div [innerHTML]="def.description | skyMarkdown"></div>
    }

    <sky-description-list mode="vertical">
      @if (selector()) {
        <sky-description-list-content>
          <sky-description-list-term> Selector: </sky-description-list-term>
          <sky-description-list-description>
            <code class="sky-codespan">{{ selector() }}</code>
          </sky-description-list-description>
        </sky-description-list-content>
      }
      <sky-description-list-content>
        <sky-description-list-term> Import from: </sky-description-list-term>
        <sky-description-list-description>
          <code class="sky-codespan">{{ def.packageName }}</code>
        </sky-description-list-description>
      </sky-description-list-content>
    </sky-description-list>

    @if (properties()) {
      <h4>Properties</h4>

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
                  [innerHTML]="getPropertyName(def, property) | skySafeHtml"
                  [ngClass]="{
                    'sky-type-definition-deprecated': property.isDeprecated,
                  }"
                ></code>
              </td>
              <td>
                @if (property.description) {
                  <div [innerHTML]="property.description | skyMarkdown"></div>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    }

    @if (methods()?.length) {
      <h4>Methods</h4>

      <table class="sky-type-definition-table sky-margin-stacked-xl">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          @for (method of methods(); track method.name) {
            <tr>
              <td>
                <code
                  [innerHTML]="getMethodName(def, method) | skySafeHtml"
                  [ngClass]="{
                    'sky-type-definition-deprecated': method.isDeprecated,
                  }"
                ></code>
              </td>
              <td>
                @if (method.description) {
                  <div [innerHTML]="method.description | skyMarkdown"></div>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    } `,
})
export class SkyTypeDefinitionComponent {
  public definition = input.required<SkyManifestDocumentationTypeDefinition>();

  protected methods = computed<SkyManifestChildDefinition[] | undefined>(() => {
    const def = this.definition();
    return def.children?.filter((c) => c.kind === 'class-method');
  });

  protected properties = computed<SkyManifestChildDefinition[] | undefined>(
    () => {
      const def = this.definition();
      return def.children?.filter((c) => c.kind !== 'class-method');
    },
  );

  protected getPropertyName(
    parent: { name: string },
    child: { kind: string; name: string; type: string },
  ): string {
    switch (child.kind) {
      case 'class-method': {
        return `${child.name}`;
      }

      case 'enum-member': {
        return `${parent.name}.${child.name}`;
      }

      case 'interface-property': {
        return `${child.name}?: ${child.type}`;
      }

      default: {
        return `${child.name}: ${child.type}`;
      }
    }
  }

  protected selector = computed<string | undefined>(() => {
    const def = this.definition();

    if (isDirectiveDefinition(def)) {
      return def.selector;
    }

    return undefined;
  });

  protected getMethodName(
    parent: { isStatic?: boolean; name: string },
    child: { kind: string; name: string; type: string },
  ): string {
    if (parent.isStatic) {
      return `${parent.name}.${child.name}`;
    }

    return child.name;
  }
}
