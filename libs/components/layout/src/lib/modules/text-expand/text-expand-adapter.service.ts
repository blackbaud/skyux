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

  public getContainerHeight(containerEl: ElementRef): number {
    return containerEl.nativeElement.offsetHeight;
  }

  public removeContainerMaxHeight(containerEl: ElementRef): void {
    this.#renderer.removeStyle(containerEl.nativeElement, 'max-height');
  }

  public setText(textEl: ElementRef, text: string): void {
    textEl.nativeElement.textContent = text;
  }
}
