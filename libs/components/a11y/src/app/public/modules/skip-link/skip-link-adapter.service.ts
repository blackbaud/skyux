import {
  Injectable
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkySkipLink
} from './skip-link';

@Injectable()
export class SkySkipLinkAdapterService {

  constructor(
    private windowRef: SkyAppWindowRef
  ) { }

  public skipTo(link: SkySkipLink): void {
    const targetElement = link.elementRef.nativeElement;
    const win = this.windowRef.nativeWindow;
    const bodyElement = win.document.body;

    const bodyMarginTop = parseInt(win.getComputedStyle(bodyElement).marginTop, 10);
    const bodyDefaultPadding = 10;
    const scrollTop = targetElement.offsetTop - bodyMarginTop - bodyDefaultPadding;

    win.scroll(0, scrollTop);

    targetElement.focus();
  }
}
