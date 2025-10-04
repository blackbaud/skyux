import { httpResource, provideHttpClient } from '@angular/common/http';
import {
  DOCUMENT,
  EnvironmentProviders,
  Injectable,
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
  readonly #preview =
    this.#previewLink?.startsWith('/') || this.#previewLink?.startsWith('.')
      ? httpResource<string>(() => this.#previewLink)
      : undefined;
  readonly #resolver = inject(SkyIconSvgResolverService);
  readonly #iconResolver = resource({
    params: () => signal('star').asReadonly(),
    loader: ({ params }) => this.#resolver.resolveHref(params()),
  });

  constructor() {
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
