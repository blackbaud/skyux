import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';
import {
  SkyManifestChildDefinitionKind,
  SkyManifestClassMethodDefinition,
  SkyManifestDirectiveInputDefinition,
  SkyManifestDirectiveOutputDefinition,
  type SkyManifestDocumentationTypeDefinition,
  SkyManifestParameterDefinition,
  isDirectiveDefinition,
  isFunctionDefinition,
  isPipeDefinition,
} from '@skyux/manifest';

import { SkyDocsCategoryTagModule } from '../category-tag/category-tag.module';
import { SkyDocsCodeHighlightPipe } from '../code-highlight/code-highlight.pipe';
import { SkyDocsCodeSnippetModule } from '../code-snippet/code-snippet.module';
import { SkyDocsHeadingAnchorModule } from '../heading-anchor/heading-anchor.module';

import { SkyDocsTypeDefinitionBoxComponent } from './box.component';
import { SkyDocsDeprecationReasonComponent } from './deprecation-reason.component';
import { SkyDocsTypeDefinitionDescriptionComponent } from './description.component';
import { SkyDocsPropertyTypeDefinitionDefaultValuePipe } from './pipes/default-value.pipe';
import { SkyDocsEnumerationSignaturePipe } from './pipes/enum-signature.pipe';
import { SkyDocsEscapeHtmlPipe } from './pipes/escape-html.pipe';
import { SkyDocsFunctionSignaturePipe } from './pipes/function-signature.pipe';
import { SkyDocsInterfaceSignaturePipe } from './pipes/interface-signature.pipe';
import { SkyDocsMethodNamePipe } from './pipes/method-name.pipe';
import { SkyDocsParameterNamePipe } from './pipes/parameter-name.pipe';
import { SkyDocsPropertyNamePipe } from './pipes/property-name.pipe';
import { SkyDocsTypeAliasSignaturePipe } from './pipes/type-alias-signature.pipe';
import { SkyTypeAnchorLinksPipe } from './pipes/type-anchor-links.pipe';
import { SkyDocsTypeDefinitionKindToCategoryColorPipe } from './pipes/type-definition-kind-to-category-color.pipe';
import { SkyDocsTypeDefinitionKindToLabelPipe } from './pipes/type-definition-kind-to-label.pipe';
import { PropertyDefinition } from './property-definition';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.sky-margin-stacked-xxl]': 'stacked()',
  },
  imports: [
    SkyDocsCategoryTagModule,
    SkyDocsCodeHighlightPipe,
    SkyDocsCodeSnippetModule,
    SkyDocsDeprecationReasonComponent,
    SkyDocsEnumerationSignaturePipe,
    SkyDocsHeadingAnchorModule,
    SkyDocsFunctionSignaturePipe,
    SkyDocsInterfaceSignaturePipe,
    SkyDocsMethodNamePipe,
    SkyDocsParameterNamePipe,
    SkyDocsPropertyNamePipe,
    SkyDocsPropertyTypeDefinitionDefaultValuePipe,
    SkyDocsTypeAliasSignaturePipe,
    SkyDocsTypeDefinitionBoxComponent,
    SkyDocsTypeDefinitionDescriptionComponent,
    SkyDocsTypeDefinitionKindToCategoryColorPipe,
    SkyDocsTypeDefinitionKindToLabelPipe,
    SkyDocsEscapeHtmlPipe,
    SkyTypeAnchorLinksPipe,
  ],
  providers: [SkyDocsParameterNamePipe],
  selector: 'sky-docs-type-definition',
  styleUrl: './type-definition.component.scss',
  templateUrl: './type-definition.component.html',
})
export class SkyDocsTypeDefinitionComponent {
  public readonly definition =
    input.required<SkyManifestDocumentationTypeDefinition>();

  public readonly stacked = input(false, { transform: booleanAttribute });

  protected readonly inputs = computed<
    SkyManifestDirectiveInputDefinition[] | undefined
  >(() => {
    const def = this.definition();

    const inputs = def.children?.filter((c) => c.kind === 'directive-input') as
      | SkyManifestDirectiveInputDefinition[]
      | undefined;

    return inputs && inputs.length > 0
      ? inputs
          // Sort alphabetically by name.
          .sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          })
          // List "required" inputs first.
          .sort((a, b) => {
            if (a.isRequired && !b.isRequired) {
              return -1;
            }

            if (!a.isRequired && b.isRequired) {
              return 1;
            }

            return 0;
          })
      : undefined;
  });

  protected readonly methods = computed<
    SkyManifestClassMethodDefinition[] | undefined
  >(() => {
    const def = this.definition();

    return def.children?.filter((c) => c.kind === 'class-method') as
      | SkyManifestClassMethodDefinition[]
      | undefined;
  });

  protected readonly outputs = computed<
    SkyManifestDirectiveOutputDefinition[] | undefined
  >(() => {
    const def = this.definition();

    const outputs = def.children?.filter(
      (c) => c.kind === 'directive-output',
    ) as SkyManifestDirectiveOutputDefinition[] | undefined;

    return outputs && outputs.length > 0 ? outputs : undefined;
  });

  protected readonly parameters = computed<
    SkyManifestParameterDefinition[] | undefined
  >(() => {
    const def = this.definition();

    return isFunctionDefinition(def) ? def.parameters : undefined;
  });

  protected readonly pipeName = computed<string | undefined>(() => {
    const def = this.definition();

    return isPipeDefinition(def) ? def.templateBindingName : undefined;
  });

  protected readonly properties = computed<PropertyDefinition[] | undefined>(
    () => {
      const def = this.definition();

      const ignore: SkyManifestChildDefinitionKind[] = [
        'class-method',
        'directive-input',
        'directive-output',
      ];

      const properties = def.children?.filter(
        (c) => !ignore.includes(c.kind),
      ) as PropertyDefinition[] | undefined;

      return properties && properties.length > 0 ? properties : undefined;
    },
  );

  protected readonly selector = computed<string | undefined>(() => {
    const def = this.definition();

    return isDirectiveDefinition(def) ? def.selector : undefined;
  });
}
