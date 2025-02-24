import { JsonPipe, NgClass, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  SkyClipboardModule,
  SkyCodeSnippetModule,
  SkyPillModule,
} from '@skyux/docs-tools';
import { SkyIconModule } from '@skyux/icon';
import { SkyLabelModule, SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyBoxModule, SkyDescriptionListModule } from '@skyux/layout';
import {
  SkyManifestClassMethodDefinition,
  type SkyManifestDocumentationTypeDefinition,
  SkyManifestFunctionDefinition,
  SkyManifestParameterDefinition,
  isDirectiveDefinition,
  isPipeDefinition,
} from '@skyux/manifest';

import { SkyHeadingAnchorComponent } from '../heading-anchor/heading-anchor.component';
import { SkyMarkdownPipe } from '../markdown/markdown.pipe';

import { SkyDocsCategoryHeader } from './category-header.component';
import { SkyDeprecationReasonComponent } from './deprecation-reason.component';
import { SkyTypeDefinitionMethodsTableComponent } from './methods-table.component';
import { SkyTypeDefinitionParametersTableComponent } from './parameters-table.component';
import { SkyDocsAnchorLinkPipe } from './pipes/anchor-id.pipe';
import { SkyDocsPropertyTypeDefinitionDefaultValuePipe } from './pipes/default-value.pipe';
import { SkyDocsEnumerationSignaturePipe } from './pipes/enum-signature.pipe';
import { SkyEscapeHtmlPipe } from './pipes/escape-html.pipe';
import { SkyDocsInterfaceSignaturePipe } from './pipes/interface-signature.pipe';
import { SkyKindToPillColorPipe } from './pipes/kind-to-pill-color.pipe';
import { SkyDocsMethodNamePipe } from './pipes/method-name.pipe';
import { SkyDocsMethodSignaturePipe } from './pipes/method-signature.pipe';
import { SkyDocsParameterNamePipe } from './pipes/parameter-name.pipe';
import { SkyDocsPropertyNamePipe } from './pipes/property-name.pipe';
import { SkyTypeDefinitionKindToLabelPipe } from './pipes/type-definition-kind-to-label.pipe';
import { SkyFormatTypeAliasTypeDefinitionPipe } from './pipes/type-definition-type-alias.pipe';
import {
  PropertyDefinition,
  SkyTypeDefinitionPropertiesTableComponent,
} from './properties-table.component';
import { SkyTypeDefinitionAnchorsDirective } from './type-definition-anchors.directive';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-margin-stacked-xxl',
  },
  imports: [
    SkyTypeDefinitionAnchorsDirective,
    JsonPipe,
    NgClass,
    UpperCasePipe,
    SkyDocsCategoryHeader,
    SkyFormatTypeAliasTypeDefinitionPipe,
    SkyIconModule,
    SkyTypeDefinitionKindToLabelPipe,
    SkyEscapeHtmlPipe,
    SkyDescriptionListModule,
    SkyDeprecationReasonComponent,
    SkyLabelModule,
    SkyHeadingAnchorComponent,
    SkyMarkdownPipe,
    SkyCodeSnippetModule,
    SkyKindToPillColorPipe,
    SkyBoxModule,
    SkyPillModule,
    SkyTypeDefinitionMethodsTableComponent,
    SkyStatusIndicatorModule,
    SkyTypeDefinitionPropertiesTableComponent,
    SkyClipboardModule,
    SkyTypeDefinitionParametersTableComponent,
    SkyDocsPropertyNamePipe,
    SkyDocsPropertyTypeDefinitionDefaultValuePipe,
    SkyDocsMethodNamePipe,
    SkyDocsParameterNamePipe,
    SkyDocsMethodSignaturePipe,
    SkyDocsInterfaceSignaturePipe,
    SkyDocsEnumerationSignaturePipe,
    SkyDocsAnchorLinkPipe,
  ],
  providers: [SkyDocsParameterNamePipe],
  selector: 'sky-type-definition',
  styles: `
    :host {
      display: block;
    }

    .my-box-header {
      display: flex;
      justify-content: space-between;
      border-radius: 5px 5px 0 0;
      background-color: var(--sky-background-color-disabled);
    }

    .my-box-heading {
      margin: 0;
    }

    .my-box-type {
    }
  `,
  templateUrl: './type-definition.component.html',
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

  protected parameters = computed<SkyManifestParameterDefinition[] | undefined>(
    () => {
      const def = this.definition();

      // TODO: Create a isFunctionDefinition utility function.
      if (def.kind === 'function') {
        return (def as unknown as SkyManifestFunctionDefinition).parameters;
      }

      return undefined;
    },
  );

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

  protected getFunctionSignature(
    definition: SkyManifestDocumentationTypeDefinition,
  ): string {
    const def = definition as unknown as SkyManifestFunctionDefinition;

    return `function ${def.name}(): ${def.type}`;
  }
}
