import { JsonPipe, NgClass, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import {
  SkyClipboardModule,
  SkyCodeHighlightPipe,
  SkyCodeSnippetModule,
  SkyHeadingAnchorModule,
  SkyPillModule,
} from '@skyux/docs-tools';
import { SkyIconModule } from '@skyux/icon';
import { SkyLabelModule, SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyBoxModule, SkyDescriptionListModule } from '@skyux/layout';
import {
  SkyManifestChildDefinitionKind,
  SkyManifestClassMethodDefinition,
  SkyManifestDirectiveInputDefinition,
  SkyManifestDirectiveOutputDefinition,
  type SkyManifestDocumentationTypeDefinition,
  SkyManifestFunctionDefinition,
  SkyManifestParameterDefinition,
  isDirectiveDefinition,
  isPipeDefinition,
} from '@skyux/manifest';

import { SkyDeprecationReasonComponent } from './deprecation-reason.component';
import { SkyDocsPropertyTypeDefinitionDefaultValuePipe } from './pipes/default-value.pipe';
import { SkyDocsEnumerationSignaturePipe } from './pipes/enum-signature.pipe';
import { SkyEscapeHtmlPipe } from './pipes/escape-html.pipe';
import { SkyDocsFunctionSignaturePipe } from './pipes/function-signature.pipe';
import { SkyDocsInterfaceSignaturePipe } from './pipes/interface-signature.pipe';
import { SkyKindToPillColorPipe } from './pipes/kind-to-pill-color.pipe';
import { SkyMarkdownPipe } from './pipes/markdown.pipe';
import { SkyDocsMethodNamePipe } from './pipes/method-name.pipe';
import { SkyDocsMethodSignaturePipe } from './pipes/method-signature.pipe';
import { SkyDocsParameterNamePipe } from './pipes/parameter-name.pipe';
import { SkyDocsPropertyNamePipe } from './pipes/property-name.pipe';
import { SkyDocsTypeAliasSignaturePipe } from './pipes/type-alias-signature.pipe';
import { SkyTypeAnchorLinksPipe } from './pipes/type-anchor-links.pipe';
import { SkyTypeDefinitionKindToLabelPipe } from './pipes/type-definition-kind-to-label.pipe';
import { PropertyDefinition } from './property-definition';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sky-margin-stacked-xxl',
  },
  imports: [
    JsonPipe,
    NgClass,
    UpperCasePipe,
    SkyDocsTypeAliasSignaturePipe,
    SkyIconModule,
    SkyTypeDefinitionKindToLabelPipe,
    SkyEscapeHtmlPipe,
    SkyDescriptionListModule,
    SkyDeprecationReasonComponent,
    SkyHeadingAnchorModule,
    SkyLabelModule,
    SkyMarkdownPipe,
    SkyCodeSnippetModule,
    SkyKindToPillColorPipe,
    SkyBoxModule,
    SkyPillModule,
    SkyStatusIndicatorModule,
    SkyClipboardModule,
    SkyDocsPropertyNamePipe,
    SkyDocsPropertyTypeDefinitionDefaultValuePipe,
    SkyDocsMethodNamePipe,
    SkyDocsParameterNamePipe,
    SkyDocsMethodSignaturePipe,
    SkyDocsInterfaceSignaturePipe,
    SkyDocsEnumerationSignaturePipe,
    SkyTypeAnchorLinksPipe,
    SkyCodeHighlightPipe,
    SkyDocsFunctionSignaturePipe,
  ],
  providers: [SkyDocsParameterNamePipe],
  selector: 'sky-type-definition',
  styleUrl: './type-definition.component.scss',
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

    const ignore: SkyManifestChildDefinitionKind[] = [
      'class-method',
      'directive-input',
      'directive-output',
    ];

    const properties = def.children?.filter((c) => !ignore.includes(c.kind)) as
      | PropertyDefinition[]
      | undefined;

    return properties && properties.length > 0 ? properties : undefined;
  });

  protected inputs = computed<
    SkyManifestDirectiveInputDefinition[] | undefined
  >(() => {
    const def = this.definition();

    const inputs = def.children?.filter((c) => c.kind === 'directive-input') as
      | SkyManifestDirectiveInputDefinition[]
      | undefined;

    return inputs && inputs.length > 0 ? inputs : undefined;
  });

  protected outputs = computed<
    SkyManifestDirectiveOutputDefinition[] | undefined
  >(() => {
    const def = this.definition();

    const outputs = def.children?.filter(
      (c) => c.kind === 'directive-output',
    ) as SkyManifestDirectiveOutputDefinition[] | undefined;

    return outputs && outputs.length > 0 ? outputs : undefined;
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
}
