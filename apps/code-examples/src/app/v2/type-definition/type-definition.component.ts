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

import { SkyDeprecationReasonComponent } from './deprecation-reason.component';
import { SkyTypeDefinitionPropertiesTableComponent } from './properties-table.component';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    NgClass,
    SkySafeHtmlPipe,
    SkyDescriptionListModule,
    SkyDeprecationReasonComponent,
    SkyElementAnchorDirective,
    SkyLabelModule,
    SkyMarkdownPipe,
    SkyStatusIndicatorModule,
    SkyTypeDefinitionPropertiesTableComponent,
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
      <sky-deprecation-reason [message]="def.deprecationReason" />
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

    @let methodsValue = methods();
    @let propertiesValue = properties();

    @if (propertiesValue && propertiesValue.length > 0) {
      <h4>Properties</h4>
      <sky-type-definition-properties-table
        [parentDefinition]="def"
        [properties]="propertiesValue"
      />
    }

    @if (methodsValue && methodsValue.length > 0) {
      <h4>Methods</h4>
      <sky-type-definition-properties-table
        [parentDefinition]="def"
        [properties]="methodsValue"
      />
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
