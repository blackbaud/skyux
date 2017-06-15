import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { StacheAffixTopDirective } from './affix-top.directive';

@Component({
  selector: 'stache-affix',
  templateUrl: './affix.component.html',
  styleUrls: ['./affix.component.scss']
})
export class StacheAffixComponent implements AfterViewInit {
  @ViewChild('stacheAffixTarget')
  public stacheAffixTarget: ElementRef;
  public minHeightFormatted: string;
  public maxWidthFormatted: string;

  @ViewChild(StacheAffixTopDirective)
  public stacheAffixTop: StacheAffixTopDirective;

  public ngAfterViewInit() {
    this.minHeightFormatted = `${this.stacheAffixTarget.nativeElement.offsetHeight}px`;
    this.maxWidthFormatted = `${this.stacheAffixTarget.nativeElement.offsetWidth}px`;
  }

  public cssPosition(): string {
    if (this.stacheAffixTop.isAffixed) {
      return 'relative';
    }

    return 'static';
  }
}
