import { httpResource, provideHttpClient } from '@angular/common/http';
import {
  DOCUMENT,
  EnvironmentProviders,
  Injectable,
  computed,
  effect,
  inject,
  provideAppInitializer,
  resource,
  signal,
} from '@angular/core';
import { SkyIconSvgResolverService } from '@skyux/icon';

/* istanbul ignore next */
export function provideIconPreview(): EnvironmentProviders[] {
  return [
    provideHttpClient(),
    provideAppInitializer(() => {
      inject(IconPreviewService);
    }),
  ];
}

@Injectable({
  providedIn: 'root',
})
export class IconPreviewService {
  readonly #doc = inject(DOCUMENT);
  readonly #previewLink = this.#doc.querySelector<HTMLLinkElement>(
    'link.skyux-icons-preview',
  )?.href;
  readonly #preview = this.#previewLink
    ? httpResource<string>(() => this.#previewLink)
    : undefined;
  readonly #resolver = inject(SkyIconSvgResolverService);
  readonly #iconResolver = resource({
    params: () => signal('star').asReadonly(),
    loader: ({ params }) => this.#resolver.resolveHref(params()),
  });
  readonly #ready = computed(() => {
    if (!this.#preview) {
      return true;
    }
    const resolverReady = this.#iconResolver.hasValue();
    const previewReady = this.#preview.hasValue();
    return resolverReady && previewReady;
  });

  constructor() {
    effect(() => {
      const ready = this.#ready();
      if (ready) {
        this.#doc.body.classList.add('sky-icon-ready');
      } else {
        this.#doc.body.classList.remove('sky-icon-ready');
      }
    });
    effect(() => {
      const resolverReady = !!this.#iconResolver.value();
      const previewSprite = this.#preview?.value();
      const spriteElement = (): HTMLElement =>
        this.#doc.getElementById('sky-icon-svg-sprite') as HTMLElement;
      if (resolverReady && previewSprite && spriteElement()) {
        const fragment = this.#doc.createElement('div');
        fragment.innerHTML = previewSprite;
        spriteElement().replaceWith(...fragment.children);
        fragment.remove();
      }
      return undefined;
    });
  }
}
