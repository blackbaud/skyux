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

import { SkyHeadingAnchorComponent } from '../heading-anchor/heading-anchor.component';
import { SkyMarkdownPipe } from '../markdown/markdown.pipe';
import { SkyPillComponent } from '../pill/pill.component';
import { SkySafeHtmlPipe } from '../safe-html/safe-html.pipe';

import { SkyDeprecationReasonComponent } from './deprecation-reason.component';
import { SkyTypeDefinitionPropertiesTableComponent } from './properties-table.component';
import { SkyTypeDefinitionKindToLabelPipe } from './type-definition-kind-to-label.pipe';
import { SkyTypeDefinitionPillTypePipe } from './type-definition-pill-type.pipe';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    NgClass,
    SkyTypeDefinitionKindToLabelPipe,
    SkySafeHtmlPipe,
    SkyDescriptionListModule,
    SkyDeprecationReasonComponent,
    SkyLabelModule,
    SkyHeadingAnchorComponent,
    SkyMarkdownPipe,
    SkyPillComponent,
    SkyTypeDefinitionPillTypePipe,
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

    .sky-type-definition-tags {
      /*margin-top: -14px;*/
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
  template: `
    @let def = definition();

    <sky-heading-anchor
      headingLevel="3"
      headingTextFormat="code"
      [headingId]="def.anchorId"
      [headingText]="def.name"
    />

    <div class="sky-type-definition-tags sky-margin-stacked-lg">
      <sky-pill
        [textContent]="def.kind | skyTypeDefinitionKindToLabel"
        [categoryType]="def.kind | skyTypeDefinitionPillType"
      />
    </div>

    @if (def.description) {
      <p [innerHTML]="def.description | skyMarkdown"></p>
    }

    @if (def.deprecationReason) {
      <sky-deprecation-reason stacked [message]="def.deprecationReason" />
    }

    @if (def.kind === 'module' || def.kind === 'service') {
      <p>
        <code class="sky-codespan"
          >import {{ '{' }} {{ def.name }} {{ '}' }} from '{{
            def.packageName
          }}';</code
        >
      </p>
    }

    @if (selector(); as selector) {
      <p>
        Selector: <code class="sky-codespan">{{ selector }}</code>
      </p>
    }

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
    }
  `,
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
