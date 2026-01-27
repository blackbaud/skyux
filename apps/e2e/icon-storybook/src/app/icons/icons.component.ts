import {
  Component,
  DOCUMENT,
  computed,
  inject,
  input,
  resource,
  signal,
} from '@angular/core';
import {
  SkyIconModule,
  SkyIconSize,
  SkyIconSvgResolverService,
  SkyIconVariantType,
} from '@skyux/icon';
import { IconPreviewService } from '@skyux/storybook/icon-preview';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
  imports: [SkyIconModule],
})
export class IconsComponent {
  readonly #doc = inject(DOCUMENT);
  readonly #iconPreview = inject(IconPreviewService);
  readonly #resolver = inject(SkyIconSvgResolverService);
  readonly #starIcon = resource({
    params: () => signal('star'),
    loader: ({ params }) => this.#resolver.resolveHref(params()),
  });

  protected readonly iconMap = computed(() => {
    const iconsReady = this.#starIcon.hasValue();
    const iconsPreviewReady = this.#iconPreview.ready();
    if (iconsReady && iconsPreviewReady) {
      const iconSymbols = this.#doc.querySelectorAll(
        '#sky-icon-svg-sprite symbol',
      );
      return Array.from(
        new Set(
          Array.from(iconSymbols)
            .map((el) => {
              const idParts = el.id.split('-');
              // Construct the icon name by removing `sky-i-` from the beginning
              // and `-<size>-<variant>` from the end.
              return idParts.slice(2, idParts.length - 2).join('-');
            })
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b));
    }
    return undefined;
  });

  public readonly size = input<SkyIconSize>('m');
  public readonly variant = input<SkyIconVariantType>('line');
}

export default IconsComponent;
