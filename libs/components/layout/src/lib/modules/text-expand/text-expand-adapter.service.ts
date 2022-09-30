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

  public removeContainerMaxHeight(containerEl: ElementRef) {
    this.#renderer.removeStyle(containerEl.nativeElement, 'max-height');
  }

  public setText(textEl: ElementRef, text: string) {
    textEl.nativeElement.textContent = text;
  }
}
