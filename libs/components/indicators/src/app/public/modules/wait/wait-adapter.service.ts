import {
  ElementRef,
  Injectable,
  Renderer
} from '@angular/core';

@Injectable()
export class SkyWaitAdapterService {

  constructor(private renderer: Renderer) { }

  public setWaitBounds(waitEl: ElementRef) {
    this.renderer.setElementStyle(waitEl.nativeElement.parentElement, 'position', 'relative');
  }

  public removeWaitBounds(waitEl: ElementRef) {
    this.renderer.setElementStyle(waitEl.nativeElement.parentElement, 'position', undefined);
  }

  public setBusyState(waitEl: ElementRef, isFullPage: boolean, isWaiting: boolean) {
    let busyEl = isFullPage ? document.body : waitEl.nativeElement.parentElement;
    let state = isWaiting ? 'true' : undefined;
    this.renderer.setElementAttribute(busyEl, 'aria-busy', state);
  }
}
