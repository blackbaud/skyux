// #region imports
import {
  ElementRef,
  Injectable
} from '@angular/core';

import {
  SkyWindowRefService
} from '@skyux/core';
// #endregion

@Injectable()
export class SkyToastAdapterService {

  constructor(
    private windowRef: SkyWindowRefService
  ) { }

  public scrollBottom(elementRef: ElementRef): void {
    const element = elementRef.nativeElement;
    this.windowRef.getWindow().setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    });
  }
}
