import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'stache-page-anchor',
  templateUrl: './page-anchor.component.html'
})
export class StachePageAnchorComponent implements OnInit {
  @Input() public navItemLabel: string;
  public label: string;
  public anchor: string;
  public path: string[];

  public constructor(
    private router: Router,
    private elementRef: ElementRef) { }

  public ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    let label, anchor;

    label = element.innerText || element.textContent;
    label = label.trim();
    anchor = label.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    this.label = label;
    this.anchor = anchor;
    this.path = [this.router.url.split('#')[0]];
  }
}
