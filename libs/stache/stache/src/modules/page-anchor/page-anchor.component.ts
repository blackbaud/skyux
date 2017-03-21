import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { StacheNavLink } from '../nav/nav-link';

@Component({
  selector: 'stache-page-anchor',
  templateUrl: './page-anchor.component.html'
})
export class StachePageAnchorComponent implements OnInit, StacheNavLink {
  public label: string;
  public fragment: string;
  public path: string[];

  public constructor(
    private router: Router,
    private elementRef: ElementRef) { }

  public ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    let label, fragment;

    label = element.innerText || element.textContent;
    label = label.trim();
    fragment = label.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    this.label = label;
    this.fragment = fragment;
    this.path = [this.router.url.split('#')[0]];
  }
}
