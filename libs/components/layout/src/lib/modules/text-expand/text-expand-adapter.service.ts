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
export class SkyTextExpandAdapterService {
  #renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  public getContainerHeight(containerEl: ElementRef) {
    return containerEl.nativeElement.offsetHeight;
  }

  public setContainerHeight(containerEl: ElementRef, height?: string) {
    if (height === undefined) {
      this.#renderer.removeStyle(containerEl.nativeElement, 'max-height');
    } else {
      this.#renderer.setStyle(containerEl.nativeElement, 'max-height', height);
    }
  }

  public setText(textEl: ElementRef, text: string) {
    textEl.nativeElement.textContent = text;
  }
}
