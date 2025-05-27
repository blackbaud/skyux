import type { ComponentRef } from '@angular/core';
import { Injectable } from '@angular/core';
import type { SkyDynamicComponentService } from '@skyux/core';
import { SkyDynamicComponentLocation } from '@skyux/core';

import type { SkySkipLink } from './skip-link';
import type { SkySkipLinkArgs } from './skip-link-args';
import { SkySkipLinkHostComponent } from './skip-link-host.component';

/**
 * An Angular service that adds "skip links" to the page.  Skip links will only be displayed
 * when the page initially loads and the user presses the Tab key, in which case the first link will
 * be displayed and focused.  Clicking the button will skip to the specified element.  Pressing
 * the Tab key again will move to the next skip link if more than one skip link is specified;
 * otherwise, focus will move to the first focusable element on the page.
 */
@Injectable({
  providedIn: 'root',
})
export class SkySkipLinkService {
  private static host: ComponentRef<SkySkipLinkHostComponent> | undefined;

  #dynamicComponentService: SkyDynamicComponentService;

  constructor(dynamicComponentService: SkyDynamicComponentService) {
    this.#dynamicComponentService = dynamicComponentService;
  }

  public setSkipLinks(args: SkySkipLinkArgs): void {
    args.links = args.links.filter((link: SkySkipLink) => {
      const elementRefExists = link.elementRef;
      return elementRefExists;
    });

    // Timeout needed in case the consumer sets the skip links within an Angular lifecycle hook.
    setTimeout(() => {
      if (!SkySkipLinkService.host) {
        SkySkipLinkService.host = this.#createHostComponent();
      }

      SkySkipLinkService.host.instance.links = args.links;
    });
  }

  public removeHostComponent(): void {
    if (SkySkipLinkService.host) {
      this.#dynamicComponentService.removeComponent(SkySkipLinkService.host);
      SkySkipLinkService.host = undefined;
    }
  }

  #createHostComponent(): ComponentRef<SkySkipLinkHostComponent> {
    const componentRef = this.#dynamicComponentService.createComponent(
      SkySkipLinkHostComponent,
      {
        location: SkyDynamicComponentLocation.BodyTop,
      },
    );

    return componentRef;
  }
}
