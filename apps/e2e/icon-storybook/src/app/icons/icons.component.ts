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

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
  imports: [SkyIconModule],
})
export class IconsComponent {
  readonly #doc = inject(DOCUMENT);
  readonly #classObserver = new MutationObserver(() => {
    this.iconPreviewReady.set(
      this.#doc.body.classList.contains('sky-icon-ready'),
    );
  });
  readonly #resolver = inject(SkyIconSvgResolverService);
  readonly #starIcon = resource({
    params: () => signal('star'),
    loader: ({ params }) => this.#resolver.resolveHref(params()),
  });

  protected readonly iconMap = computed(() => {
    const iconsReady = this.#starIcon.hasValue();
    const iconsPreviewReady = this.iconPreviewReady();
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
  protected readonly iconPreviewReady = signal(
    this.#doc.body.classList.contains('sky-icon-ready'),
  );

  public readonly size = input<SkyIconSize>('m');
  public readonly variant = input<SkyIconVariantType>('line');

  constructor() {
    this.#classObserver.observe(this.#doc.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }
}

export default IconsComponent;
