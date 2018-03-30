import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import { StacheWindowRef } from './window-ref';

@Injectable()
export class StacheOmnibarAdapterService {
  private static readonly HAS_OMNIBAR_CLASS_NAME: string = 'stache-omnibar-enabled';
  public static readonly EXPECTED_OMNIBAR_HEIGHT: number = 50;
  private renderer: Renderer2;
  private element: any = this.windowRef.nativeWindow.document.querySelector('.sky-omnibar-iframe');

  constructor(
    private windowRef: StacheWindowRef,
    private rendererFactory: RendererFactory2) {
      this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
    }

  public checkForOmnibar(): void {
    if (this.omnibarEnabled()) {
      this.applyClassToBody();
    }
  }

  public getHeight(): number {
    if (this.omnibarEnabled()) {
      return StacheOmnibarAdapterService.EXPECTED_OMNIBAR_HEIGHT;
    }
    return 0;
  }

  public omnibarEnabled(): boolean {
    // Converts the element's existence to a boolean.
    return !!this.element;
  }

  private applyClassToBody(): void {
    this.renderer.addClass(
      this.windowRef.nativeWindow.document.body,
      StacheOmnibarAdapterService.HAS_OMNIBAR_CLASS_NAME
    );
  }
}
