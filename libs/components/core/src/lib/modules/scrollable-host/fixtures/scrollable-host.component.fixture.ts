import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyScrollableHostService } from '../scrollable-host.service';

@Component({
  selector: 'sky-scrollable-host-fixture',
  styleUrls: ['./scrollable-host.component.fixture.scss'],
  templateUrl: './scrollable-host.component.fixture.html',
})
export class ScrollableHostFixtureComponent implements OnDestroy {
  public isParentDisplayNoneClass = false;
  public isParentDisplayNoneStyle = false;
  public isParentHidden = false;
  public isParentScrollable = true;
  public isParentScrollableStyle = false;
  public isParentPositioned = false;
  public positionedParentWidth = '100px';

  public isGrandparentScrollable = false;

  @ViewChild('alternate')
  public alternateParent!: ElementRef;

  @ViewChild('grandparent')
  public grandparent!: ElementRef;

  @ViewChild('parent')
  public parent!: ElementRef;

  @ViewChild('target')
  public target!: ElementRef;

  public ngUnsubscribe = new Subject<void>();

  #scrollableHostService: SkyScrollableHostService;

  constructor(scrollableHostService: SkyScrollableHostService) {
    this.#scrollableHostService = scrollableHostService;
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getScrollableHost(alternative?: ElementRef): HTMLElement | Window {
    return this.#scrollableHostService.getScrollableHost(
      alternative || this.target
    );
  }

  public moveTarget(): void {
    this.alternateParent.nativeElement.appendChild(this.target.nativeElement);
  }

  public watchScrollableHost(
    alternativeTarget?: ElementRef
  ): Observable<HTMLElement | Window> {
    return this.#scrollableHostService
      .watchScrollableHost(alternativeTarget || this.target)
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  public watchScrollableHostScrollEvents(
    alternativeTarget?: ElementRef
  ): Observable<void> {
    return this.#scrollableHostService
      .watchScrollableHostScrollEvents(alternativeTarget || this.target)
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  public watchScrollableHostClipPathChanges(
    alternativeTarget?: ElementRef
  ): Observable<string> {
    return this.#scrollableHostService
      .watchScrollableHostClipPathChanges(alternativeTarget || this.target)
      .pipe(takeUntil(this.ngUnsubscribe));
  }
}
