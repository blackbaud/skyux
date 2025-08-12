import { DOCUMENT, Injectable, Renderer2, inject } from '@angular/core';

import { SkyThemeBrand } from './theme-brand';

const BRAND_BLACKBAUD = 'blackbaud';

// Commonly-used icon configurations. Appending these to the head element will
// override any existing link elements with the same attribute values. When
// they are removed, the previous favicon link elements will take effect again.
const FAVICON_CONFIGS = [
  { rel: 'apple-touch-icon', sizes: '180x180' },
  { rel: 'icon', sizes: '32x32' },
  { rel: 'icon', sizes: '16x16' },
];

/**
 * @internal
 * Provides methods for managing theme branding including brand registration,
 * stylesheet management, and host class updates.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyThemeBrandService {
  #document = inject(DOCUMENT);

  #stylesheetEl: HTMLLinkElement | undefined;
  #faviconEls: HTMLLinkElement[] = [];
  #maskIconEl: HTMLLinkElement | undefined;

  #registeredBrands = new Map<string, SkyThemeBrand>();

  /**
   * Registers a brand for use in themes.
   * @param brand The brand to register.
   */
  public registerBrand(brand: SkyThemeBrand): void {
    this.#registeredBrands.set(brand.name, brand);
  }

  /**
   * Unregisters a brand.
   * @param name The name of the brand to unregister.
   */
  public unregisterBrand(name: string): void {
    this.#registeredBrands.delete(name);
  }

  /**
   * Updates all brand-related styling and classes for the host element.
   * This consolidates brand stylesheet updates and host class management,
   * and automatically resolves registered brands.
   * @param hostEl The host element to update.
   * @param renderer The renderer to use for DOM manipulation.
   * @param brand The brand to apply (will be resolved if registered version exists).
   * @param previousBrand The previous brand to clean up.
   */
  public updateBrand(
    hostEl: Element,
    renderer: Renderer2,
    brand: SkyThemeBrand | undefined,
    previousBrand: SkyThemeBrand | undefined,
  ): void {
    // Resolve to registered brand if available
    if (brand) {
      brand = this.#registeredBrands.get(brand.name) ?? brand;
    }

    const previousClass = previousBrand?.hostClass;
    const currentClass = brand?.hostClass;

    // Update host classes if they've changed
    if (!previousClass || previousClass !== currentClass) {
      this.#updateBrandHostClass(hostEl, renderer, previousClass, currentClass);
      this.#updateBrandStylesheet(renderer, brand, previousBrand);
    }

    this.#updateFavicon(renderer, brand);
  }

  /**
   * Destroys the brand service, cleaning up any brand stylesheets.
   */
  public destroy(): void {
    this.#removeBrandStylesheet();
  }

  #updateBrandStylesheet(
    renderer: Renderer2,
    currentBrand: SkyThemeBrand | undefined,
    previousBrand: SkyThemeBrand | undefined,
  ): void {
    if (previousBrand && previousBrand.name !== BRAND_BLACKBAUD) {
      this.#removeBrandStylesheet();
    }

    if (currentBrand && currentBrand.name !== BRAND_BLACKBAUD) {
      this.#addBrandStylesheet(renderer, currentBrand);
    }
  }

  #updateBrandHostClass(
    hostEl: Element,
    renderer: Renderer2,
    previousClass: string | undefined,
    currentClass: string | undefined,
  ): void {
    if (previousClass) {
      renderer.removeClass(hostEl, previousClass);
    }

    if (currentClass && !previousClass) {
      renderer.addClass(hostEl, 'sky-theme-brand-base');
    } else if (!currentClass && previousClass) {
      renderer.removeClass(hostEl, 'sky-theme-brand-base');
    }

    if (currentClass) {
      renderer.addClass(hostEl, currentClass);
    }
  }

  #addBrandStylesheet(renderer: Renderer2, brand: SkyThemeBrand): void {
    if (brand.name !== BRAND_BLACKBAUD) {
      // Use styleUrl if provided, otherwise build the default URL
      const styleUrl =
        brand.styleUrl ||
        `https://sky.blackbaudcdn.net/static/skyux-brand-${brand.name}/${brand.version}/assets/scss/${brand.name}.css`;

      this.#stylesheetEl = renderer.createElement('link') as HTMLLinkElement;

      renderer.setAttribute(this.#stylesheetEl, 'rel', 'stylesheet');
      renderer.setAttribute(this.#stylesheetEl, 'href', styleUrl);

      if (brand.sriHash) {
        renderer.setAttribute(this.#stylesheetEl, 'integrity', brand.sriHash);
        renderer.setAttribute(this.#stylesheetEl, 'crossorigin', 'anonymous');
      }

      this.#appendToHead(renderer, this.#stylesheetEl);
    }
  }

  #removeBrandStylesheet(): void {
    if (this.#stylesheetEl) {
      this.#stylesheetEl.remove();
      this.#stylesheetEl = undefined;
    }
  }

  #updateFavicon(renderer: Renderer2, brand: SkyThemeBrand | undefined): void {
    if (brand?.faviconUrl) {
      const faviconUrl = brand.faviconUrl;

      // Create favicon elements if they don't exist, or reuse existing ones
      while (this.#faviconEls.length < FAVICON_CONFIGS.length) {
        const faviconEl = renderer.createElement('link') as HTMLLinkElement;
        this.#faviconEls.push(faviconEl);
        this.#appendToHead(renderer, faviconEl);
      }

      // Update each favicon element with its configuration
      for (let i = 0; i < FAVICON_CONFIGS.length; i++) {
        const config = FAVICON_CONFIGS[i];
        const faviconEl = this.#faviconEls[i];

        renderer.setAttribute(faviconEl, 'rel', config.rel);
        renderer.setAttribute(faviconEl, 'sizes', config.sizes);
        renderer.setAttribute(faviconEl, 'href', faviconUrl);
      }
    } else {
      // Remove all favicon elements when no favicon URL is provided
      for (const faviconEl of this.#faviconEls) {
        faviconEl.remove();
      }

      this.#faviconEls = [];
    }

    // Handle mask icon
    if (brand?.maskIcon) {
      if (!this.#maskIconEl) {
        this.#maskIconEl = renderer.createElement('link') as HTMLLinkElement;
        this.#appendToHead(renderer, this.#maskIconEl);
      }

      renderer.setAttribute(this.#maskIconEl, 'rel', 'mask-icon');
      renderer.setAttribute(this.#maskIconEl, 'href', brand.maskIcon.url);
      renderer.setAttribute(this.#maskIconEl, 'color', brand.maskIcon.color);
    } else if (this.#maskIconEl) {
      this.#maskIconEl.remove();
      this.#maskIconEl = undefined;
    }
  }

  #appendToHead(renderer: Renderer2, el: HTMLElement): void {
    renderer.appendChild(this.#document.head, el);
  }
}
