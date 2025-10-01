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
} from '@skyux/icon';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
  imports: [SkyIconModule],
})
export class IconsComponent {
  readonly #doc = inject(DOCUMENT);
  readonly #resolver = inject(SkyIconSvgResolverService);
  readonly #starIcon = resource({
    params: () => signal('star'),
    loader: ({ params }) => this.#resolver.resolveHref(params()),
  });

  protected readonly iconMap = computed(() => {
    const iconsReady = this.#starIcon.hasValue();
    if (iconsReady) {
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
}

export default IconsComponent;
