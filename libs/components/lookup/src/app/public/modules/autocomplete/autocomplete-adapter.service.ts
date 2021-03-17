import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  SkyCoreAdapterService,
  SkyOverlayInstance
} from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyAutocompleteAdapterService {
  private renderer: Renderer2;

  constructor(
    private coreAdapterService: SkyCoreAdapterService,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  public getActiveElement(): Element {
    return document.activeElement;
  }

  public getBodyFocusable(): HTMLElement[] {
    return this.coreAdapterService.getFocusableChildren(document.body);
  }

  public getFocasableActions(overlay: SkyOverlayInstance): HTMLElement[] {
    /* Sanity check */
    /* istanbul ignore else */
    if (overlay) {
      const actionsArea: HTMLElement = overlay.componentRef.location.nativeElement
        .querySelector('.sky-autocomplete-actions');

      if (actionsArea) {
        return this.coreAdapterService.getFocusableChildren(actionsArea);
      }
    }
  }

  public overlayContainsActiveElement(overlay: SkyOverlayInstance): boolean {
    return overlay.componentRef.location.nativeElement.contains(this.getActiveElement());
  }

  public setDropdownWidth(elementRef: ElementRef, dropdownRef: ElementRef): void {
    const width = elementRef.nativeElement.getBoundingClientRect().width;
    this.renderer.setStyle(dropdownRef.nativeElement, 'width', `${width}px`);
  }
}
