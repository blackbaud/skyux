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
export class SkyTextExpandRepeaterAdapterService {

  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  public getItems(elRef: ElementRef) {
    return elRef.nativeElement.querySelectorAll('.sky-text-expand-repeater-item');
  }

  public hideItem(item: HTMLElement) {
    this.renderer.setStyle(item, 'display', 'none');
  }

  public showItem(item: HTMLElement) {
    this.renderer.setStyle(item, 'display', 'list-item');
  }

  public getContainerHeight(containerEl: ElementRef) {
    return containerEl.nativeElement.offsetHeight;
  }

  public setContainerHeight(containerEl: ElementRef, height: string) {
    if (height === undefined) {
      this.renderer.removeStyle(containerEl.nativeElement, 'max-height');
    } else {
      this.renderer.setStyle(containerEl.nativeElement, 'max-height', height);
    }
  }
}
