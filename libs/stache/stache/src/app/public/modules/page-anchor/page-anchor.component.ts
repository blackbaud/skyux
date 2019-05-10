import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  OnInit,
  AfterViewChecked,
  AfterContentInit
} from '@angular/core';

import {
  BehaviorSubject,
  Subject
 } from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  StacheWindowRef
} from '../shared/window-ref';

import {
  StacheRouteService
} from '../router/route.service';

import {
  StacheNavLink
} from '../nav/nav-link';

import {
  StachePageAnchorService
} from './page-anchor.service';

@Component({
  selector: 'stache-page-anchor',
  templateUrl: './page-anchor.component.html',
  styleUrls: ['./page-anchor.component.scss']
})
export class StachePageAnchorComponent implements
  StacheNavLink,
  OnDestroy,
  AfterViewInit,
  OnInit,
  AfterViewChecked,
  AfterContentInit {
  public name: string = '';
  public fragment: string;
  public path: string[];
  public offsetTop: number;
  public anchorStream = new BehaviorSubject<StacheNavLink>({
    name: this.name,
    fragment: this.fragment,
    path: this.path,
    offsetTop: this.offsetTop
  });

  @Input()
  public anchorId?: string;

  private textContent = '';
  private ngUnsubscribe: Subject<any> = new Subject();

  public constructor(
    private elementRef: ElementRef,
    private windowRef: StacheWindowRef,
    private anchorService: StachePageAnchorService,
    private changeDetectorRef: ChangeDetectorRef,
    private routeService: StacheRouteService) { }

  public scrollToAnchor(): void {
    this.windowRef.nativeWindow.document.querySelector(`#${this.fragment}`).scrollIntoView();
  }

  public ngOnInit() {
    this.anchorService.refreshRequestedStream
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.updatePageAnchor();
      });
  }

  public ngAfterViewInit(): void {
    this.path = [this.routeService.getActiveUrl()];
    this.updatePageAnchor();
    this.anchorService.addAnchor(this.anchorStream);
    this.changeDetectorRef.detectChanges();
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.anchorStream.complete();
  }

  public ngAfterContentInit(): void {
    this.textContent = this.elementRef.nativeElement.textContent;
    this.offsetTop = this.getOffset(this.elementRef.nativeElement);
  }

  public ngAfterViewChecked(): void {
    const currentContent = this.elementRef.nativeElement.textContent;
    const currentOffset = this.getOffset(this.elementRef.nativeElement);

    if (currentContent !== this.textContent
      || currentOffset !== this.offsetTop) {
        this.textContent = currentContent;
        this.updatePageAnchor();
    }
}

  private setValues() {
    const element = this.elementRef.nativeElement;
    this.name = this.getName(element);
    this.fragment = this.anchorId || this.getFragment(this.name);
    this.offsetTop = this.getOffset(element);
  }

  private updatePageAnchor() {
    this.setValues();

    this.anchorStream.next({
      path: this.path,
      name: this.name,
      fragment: this.fragment,
      offsetTop: this.offsetTop
    } as StacheNavLink);
    this.changeDetectorRef.detectChanges();
  }

  private getOffset(element: any) {
    let offset = element.offsetTop;
    let el = element;

    while (el.offsetParent) {
      offset += el.offsetParent.offsetTop;
      el = el.offsetParent;
    }

    return offset;
  }

  private getName(element: any): string {
    return element.textContent.trim();
  }

  private getFragment(name: string): string {
    return name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
}
