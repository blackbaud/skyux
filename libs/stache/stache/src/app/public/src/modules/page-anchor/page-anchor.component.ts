import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  AfterViewInit
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { StacheNavLink } from '../nav';
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
  public navLinkStream: Observable<StacheNavLink>;

  private _subject: BehaviorSubject<StacheNavLink>;

  public constructor(
    private routerService: StacheRouteService,
    private elementRef: ElementRef,
    private windowRef: StacheWindowRef,
    private cdRef: ChangeDetectorRef) {
      this._subject = new BehaviorSubject<StacheNavLink>({ name: '', path: '' });
      this.navLinkStream = this._subject.asObservable();
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
    this.sendChanges();
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

  private sendChanges(): void {
    this._subject.next({
      path: this.path,
      name: this.name,
      fragment: this.fragment
    } as StacheNavLink);
  }
}
