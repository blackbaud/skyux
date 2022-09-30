import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyTextExpandRepeaterAdapterService {
  #renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  public getItems(elRef: ElementRef) {
    return (elRef.nativeElement as HTMLElement).querySelectorAll(
      '.sky-text-expand-repeater-item'
    ) as NodeListOf<HTMLElement>;
  }

  public hideItem(item: HTMLElement) {
    this.#renderer.setStyle(item, 'display', 'none');
  }

  public showItem(item: HTMLElement) {
    this.#renderer.removeStyle(item, 'display');
  }

  public getContainerHeight(containerEl: ElementRef) {
    return containerEl.nativeElement.offsetHeight;
  }

  public removeContainerMaxHeight(containerEl: HTMLElement) {
    this.#renderer.removeStyle(containerEl, 'max-height');
  }
}
