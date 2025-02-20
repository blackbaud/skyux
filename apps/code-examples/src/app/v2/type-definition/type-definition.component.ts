import { JsonPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { SkyClipboardModule, SkyCodeSnippetModule } from '@skyux/docs-tools';
import { SkyIconModule } from '@skyux/icon';
import { SkyLabelModule, SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyDescriptionListModule } from '@skyux/layout';
import {
  SkyManifestClassMethodDefinition,
  type SkyManifestDocumentationTypeDefinition,
  isDirectiveDefinition,
  isPipeDefinition,
} from '@skyux/manifest';

import { SkyHeadingAnchorComponent } from '../heading-anchor/heading-anchor.component';
import { SkyMarkdownPipe } from '../markdown/markdown.pipe';
import { SkyPillComponent } from '../pill/pill.component';
import { SkySafeHtmlPipe } from '../safe-html/safe-html.pipe';

import { SkyDeprecationReasonComponent } from './deprecation-reason.component';
import { SkyTypeDefinitionMethodsTableComponent } from './methods-table.component';
import { SkyTypeDefinitionKindToLabelPipe } from './pipes/type-definition-kind-to-label.pipe';
import { SkyTypeDefinitionPillTypePipe } from './pipes/type-definition-pill-type.pipe';
import { SkyFormatTypeAliasTypeDefinitionPipe } from './pipes/type-definition-type-alias.pipe';
import {
  PropertyDefinition,
  SkyTypeDefinitionPropertiesTableComponent,
} from './properties-table.component';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    NgClass,
    SkyFormatTypeAliasTypeDefinitionPipe,
    SkyIconModule,
    SkyTypeDefinitionKindToLabelPipe,
    SkySafeHtmlPipe,
    SkyDescriptionListModule,
    SkyDeprecationReasonComponent,
    SkyLabelModule,
    SkyHeadingAnchorComponent,
    SkyMarkdownPipe,
    SkyCodeSnippetModule,
    SkyPillComponent,
    SkyTypeDefinitionPillTypePipe,
    SkyTypeDefinitionMethodsTableComponent,
    SkyStatusIndicatorModule,
    SkyTypeDefinitionPropertiesTableComponent,
    SkyClipboardModule,
  ],
  selector: 'sky-type-definition',
  styles: `
    :host {
      display: block;
      margin-bottom: 40px;
    }

    .sky-type-definition-selector {
      font-size: 15px;
    }

    .sky-type-definition-tags {
      margin-top: -10px;
    }
  `,
  template: `
    @let def = definition();

    <sky-heading-anchor
      headingLevel="3"
      headingTextFormat="code"
      [headingId]="def.anchorId"
      [headingText]="def.name"
      [class.sky-text-strikethrough]="def.isDeprecated"
    />

    <div class="sky-type-definition-tags sky-margin-stacked-lg">
      <sky-pill
        [textContent]="def.kind | skyTypeDefinitionKindToLabel"
        [categoryType]="def.kind | skyTypeDefinitionPillType"
      />
    </div>

    @if (def.deprecationReason) {
      <sky-deprecation-reason stacked [message]="def.deprecationReason" />
    }

    @if (def.description) {
      <p [innerHTML]="def.description | skyMarkdown"></p>
    }

    @if (def.kind === 'module' || def.kind === 'service') {
      <p>
        <code #importRef class="sky-codespan sky-margin-inline-xs"
          >import {{ '{' }} {{ def.name }} {{ '}' }} from '{{
            def.packageName
          }}';</code
        >
        <button
          class="sky-btn sky-btn-icon-borderless"
          copySuccessMessage="Code copied"
          skyClipboardButton
          type="button"
          [clipboardTarget]="importRef"
        >
          <sky-icon iconName="clipboard-multiple" />
        </button>
      </p>
    }

    @if (selector(); as selector) {
      <p class="sky-type-definition-selector">
        Selector: <code class="sky-codespan">{{ selector }}</code>
      </p>
    }

    @if (pipeName(); as pipeName) {
      <p class="sky-type-definition-selector">
        Pipe name: <code class="sky-codespan">{{ pipeName }}</code>
      </p>
    }

    @if (def.codeExample) {
      <h4>Example</h4>
      <sky-code-snippet
        hideToolbar
        [code]="def.codeExample"
        [language]="def.codeExampleLanguage ?? 'html'"
      />
    }

    @if (def.kind === 'type-alias') {
      <sky-code-snippet
        hideToolbar
        language="ts"
        [code]="def | skyFormatTypeAliasTypeDefinition"
      />
    } @else {
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
        <sky-type-definition-methods-table
          [parentDefinition]="def"
          [methods]="methodsValue"
        />
      }
    }
  `,
})
export class SkyTypeDefinitionComponent {
  public definition = input.required<SkyManifestDocumentationTypeDefinition>();

  protected methods = computed<SkyManifestClassMethodDefinition[] | undefined>(
    () => {
      const def = this.definition();

      return def.children?.filter((c) => c.kind === 'class-method') as
        | SkyManifestClassMethodDefinition[]
        | undefined;
    },
  );

  protected properties = computed<PropertyDefinition[] | undefined>(() => {
    const def = this.definition();

    return def.children?.filter((c) => c.kind !== 'class-method') as
      | PropertyDefinition[]
      | undefined;
  });

  protected selector = computed<string | undefined>(() => {
    const def = this.definition();

    if (isDirectiveDefinition(def)) {
      return def.selector;
    }

    return undefined;
  });

  protected pipeName = computed<string | undefined>(() => {
    const def = this.definition();

    if (isPipeDefinition(def)) {
      return def.templateBindingName;
    }

    return undefined;
  });
}
