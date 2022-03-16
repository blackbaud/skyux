import { Component, HostListener, Input } from '@angular/core';

import { InputConverter, numberConverter } from '../shared/input-converter';
import { StacheWindowRef } from '../shared/window-ref';

@Component({
  selector: 'stache-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss'],
})
export class StacheBackToTopComponent {
  @Input()
  @InputConverter(numberConverter)
  public offset = 200;

  public isHidden = true;

  public constructor(private windowRef: StacheWindowRef) {}

  @HostListener('window:scroll')
  public onWindowScroll() {
    this.isHidden = this.windowRef.nativeWindow.pageYOffset < this.offset;
  }

  public scrollToTop() {
    this.windowRef.nativeWindow.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
