import { ElementRef, Injectable } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyTextExpandAdapterService {
  public setText(textEl: ElementRef, text: string): void {
    textEl.nativeElement.textContent = text;
  }
}
