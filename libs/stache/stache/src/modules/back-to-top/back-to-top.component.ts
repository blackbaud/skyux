import { Component, HostListener, Input } from '@angular/core';

import { InputConverter } from '../shared';

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

  @HostListener('window:scroll')
  public onWindowScroll() {
    this.isHidden = (window.pageYOffset < this.offset);
  }

  public scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
