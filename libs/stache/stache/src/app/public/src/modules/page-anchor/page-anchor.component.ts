import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  AfterViewInit
} from '@angular/core';

import { StacheNavLink } from '../nav';

import { StachePageAnchorService } from './page-anchor.service';
import { StacheWindowRef, StacheRouteService } from '../shared';

@Component({
  selector: 'stache-page-anchor',
  templateUrl: './page-anchor.component.html',
  styleUrls: ['./page-anchor.component.scss']
})
export class StachePageAnchorComponent implements OnInit, StacheNavLink, AfterViewInit {

  public name: string;
  public fragment: string;
  public path: string[];
  public order: number;

  public constructor(
    private routerService: StacheRouteService,
    private elementRef: ElementRef,
    private windowRef: StacheWindowRef,
    private cdRef: ChangeDetectorRef,
    private anchorService: StachePageAnchorService) {
      this.name = '';
    }

  public ngOnInit(): void {
    this.name = this.getName();
    this.fragment = this.getFragment();
    this.path = [this.routerService.getActiveUrl()];
  }

  public scrollToAnchor(): void {
    this.windowRef.nativeWindow.document.querySelector(`#${this.fragment}`).scrollIntoView();
  }

  public ngAfterViewInit(): void {
    this.name = this.getName();
    this.fragment = this.getFragment();
    this.getOrder();
    this.registerAnchor();
    this.cdRef.detectChanges();
  }

  private getName(): string {
    return this.elementRef.nativeElement.textContent.trim();
  }

  private getFragment(): string {
    return this.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  private getOrder(): void {
    let anchors = this.windowRef.nativeWindow.document.querySelectorAll('stache-page-anchor div');
    for (let i = 0; i < anchors.length; i++) {
      if (this.fragment === anchors[i].id) {
        this.order = i;
      }
    }
  }

  private registerAnchor(): void {
    this.anchorService.addPageAnchor({
      path: this.path,
      name: this.name,
      fragment: this.fragment,
      order: this.order
    } as StacheNavLink);
  }
}
