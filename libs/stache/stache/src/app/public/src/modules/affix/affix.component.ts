import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'stache-affix',
  templateUrl: './affix.component.html',
  styleUrls: ['./affix.component.scss']
})
export class StacheAffixComponent implements AfterViewInit {
  @ViewChild('stacheAffixTarget')
  public stacheAffixTarget: ElementRef;
  public minHeightFormatted: string;

  public ngAfterViewInit() {
    this.minHeightFormatted = `${this.stacheAffixTarget.nativeElement.offsetHeight}px`;
  }
}
