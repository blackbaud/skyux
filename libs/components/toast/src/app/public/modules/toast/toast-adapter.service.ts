// #region imports
import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  SkyWindowRefService
} from '@skyux/core';
// #endregion

@Injectable()
export class SkyToastAdapterService {
  private hostElement: any;
  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    private windowRef: SkyWindowRefService
  ) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  public appendToBody(element: any): void {
    const body = this.windowRef.getWindow().document.body;
    this.hostElement = element;
    this.renderer.appendChild(body, element);
  }

  public removeHostElement(): void {
    const document = this.windowRef.getWindow().document;
    this.renderer.removeChild(document.body, this.hostElement);
  }

  public scrollBottom(elementRef: ElementRef): void {
    const element = elementRef.nativeElement;
    this.windowRef.getWindow().setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    });
  }
}
