import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

@Injectable()
export class SkyTextExpandAdapterService {

  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
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

  public setText(textEl: ElementRef, text: string) {
    textEl.nativeElement.textContent = text;
  }
}
