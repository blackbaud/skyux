import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyLabelModule } from '@skyux/indicators';
import { type SkyManifestDocumentationTypeDefinition } from '@skyux/manifest/src';

import { SkyElementAnchorDirective } from '../element-anchor/element-anchor.directive';
import { SkyMarkdownPipe } from '../markdown/markdown.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyElementAnchorDirective, SkyLabelModule, SkyMarkdownPipe],
  selector: 'sky-type-definition',
  styles: `
    :host {
      display: block;
    }

    // code.sky-definition-highlight-code {
    //   padding: 3px;
    //   background-color: color-mix(
    //     in srgb,
    //     var(--sky-color-background-container-info) 25%,
    //     transparent
    //   );
    // }
  `,
  template: `
    @let def = definition();

    <h3 [attr.id]="def.anchorId" skyElementAnchor>
      {{ def.name }}
    </h3>

    <div>
      <code class="sky-codespan"
        >import {{ '{' }} {{ def.name }} {{ '}' }} from '{{
          def.packageName
        }}';</code
      >
    </div>

    @if (def.description) {
      <div [innerHTML]="def.description | skyMarkdown"></div>
    }

    <h4>Properties</h4>
  `,
})
export class SkyTypeDefinitionComponent {
  public definition = input.required<SkyManifestDocumentationTypeDefinition>();
}
