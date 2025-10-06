import {
  Component,
  DOCUMENT,
  computed,
  inject,
  input,
  numberAttribute,
  resource,
  signal,
} from '@angular/core';
import {
  SkyIconModule,
  SkyIconSvgResolverService,
  SkyIconVariantType,
} from '@skyux/icon';
import { IconPreviewService } from '@skyux/storybook/icon-preview';

@Component({
  selector: 'app-icons-by-row',
  templateUrl: './icons-by-row.component.html',
  styleUrls: ['./icons-by-row.component.scss'],
  imports: [SkyIconModule],
})
export class IconsByRowComponent {
  readonly #doc = inject(DOCUMENT);
  readonly #iconPreview = inject(IconPreviewService);
  readonly #resolver = inject(SkyIconSvgResolverService);
  readonly #starIcon = resource({
    params: () => signal('star'),
    loader: ({ params }) => this.#resolver.resolveHref(params()),
  });

  // Letters a-z, weighted to account for icon name distribution, and expecting 4 pages.
  // Adding an icon would only affect the page it appears on and not shift where icons appear on other pages.
  readonly #az = [...'aaaabbbcccddddefghijklmmnoppqrssttuvwxyz'] as const;

  protected readonly sizes = ['s', 'm', 'l', 'xl', 'xxl', 'xxxl'] as const;

  protected readonly iconMap = computed(() => {
    const iconsReady = this.#starIcon.hasValue();
    const iconsPreviewReady = this.#iconPreview.ready();
    const page = this.page() - 1;
    const pages = this.pages();
    if (iconsReady && iconsPreviewReady) {
      const iconSymbols = this.#doc.querySelectorAll(
        '#sky-icon-svg-sprite symbol',
      );
      const icons = Array.from(
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
      if (pages > 0) {
        const pageSize = Math.ceil(this.#az.length / pages);
        const beginsWith = this.#az.slice(
          page * pageSize,
          (page + 1) * pageSize,
        );
        return icons.filter((icon) => beginsWith.includes(icon.charAt(0)));
      }
      return icons;
    }
    return undefined;
  });

  public readonly variant = input<SkyIconVariantType>('line');
  public readonly page = input(1, { transform: numberAttribute });
  public readonly pages = input(0, { transform: numberAttribute });
}

export default IconsByRowComponent;
