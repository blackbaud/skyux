import { Injectable } from '@angular/core';

import { StacheWindowRef } from './window-ref';

@Injectable()
export class StacheOmnibarAdapterService {
  private static readonly HAS_OMNIBAR_CLASS_NAME: string = 'stache-omnibar-enabled';
  public static readonly EXPECTED_OMNIBAR_HEIGHT: number = 50;
  private element: any = this.windowRef.nativeWindow.document.querySelector('.sky-omnibar-iframe');

  constructor(private windowRef: StacheWindowRef) {
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
    const bodyElement = this.windowRef.nativeWindow.document.querySelector('body');
    bodyElement.classList.add(StacheOmnibarAdapterService.HAS_OMNIBAR_CLASS_NAME);
  }
}
