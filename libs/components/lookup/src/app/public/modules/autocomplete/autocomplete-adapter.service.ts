import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyAutocompleteAdapterService {
  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  public setDropdownWidth(elementRef: ElementRef, dropdownRef: ElementRef): void {
    const width = elementRef.nativeElement.getBoundingClientRect().width;
    this.renderer.setStyle(dropdownRef.nativeElement, 'width', `${width}px`);
  }
}
