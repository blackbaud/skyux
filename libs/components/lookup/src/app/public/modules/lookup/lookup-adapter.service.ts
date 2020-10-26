import {
  ElementRef,
  Injectable
} from '@angular/core';

@Injectable()
export class SkyLookupAdapterService {

  public focusInput(elRef: ElementRef): void {
    const inputEl: HTMLElement = elRef.nativeElement.querySelector('.sky-lookup-input');

    if (inputEl) {
      inputEl.focus();
    }
  }

}
