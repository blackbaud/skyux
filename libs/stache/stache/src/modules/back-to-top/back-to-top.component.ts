import { Component, HostListener, Input } from '@angular/core';

import { InputConverter } from '../shared';
import { WindowRefService } from '../shared';

@Component({
  selector: 'stache-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss']
})
export class StacheBackToTopComponent {
  @Input()
  @InputConverter()
  public offset: number = 200;

  public isHidden: boolean = true;

  public constructor(private windowRef: WindowRefService) {}

  @HostListener('window:scroll')
  public onWindowScroll() {
    this.isHidden = (this.windowRef.nativeWindow.pageYOffset < this.offset);
  }

  public scrollToTop() {
    this.windowRef.nativeWindow.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
