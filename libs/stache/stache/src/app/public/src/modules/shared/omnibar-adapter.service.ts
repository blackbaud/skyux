import { Injectable } from '@angular/core';

import { StacheWindowRef } from './window-ref';

@Injectable()
export class StacheOmnibarAdapterService {
  private static readonly HAS_OMNIBAR_CLASS_NAME: string = 'stache-omnibar-enabled';
  private element: any = this.windowRef.nativeWindow.document.querySelector('.sky-omnibar-iframe');
  private omnibarHeight: number = 0;

  constructor(private windowRef: StacheWindowRef) {
    if (this.omnibarEnabled()) {
      this.applyClassToBody();
      this.setHeight();
    }
  }

  public getHeight(): number {
    return this.omnibarHeight;
  }

  public omnibarEnabled(): boolean {
    // Converts the elements existence to a boolean.
    return !!this.element;
  }

  private setHeight(): void {
    this.omnibarHeight = this.element.offsetHeight;
  }

  private applyClassToBody(): void {
    const bodyElement = this.windowRef.nativeWindow.document.querySelector('body');
    bodyElement.classList.add(StacheOmnibarAdapterService.HAS_OMNIBAR_CLASS_NAME);
  }
}
