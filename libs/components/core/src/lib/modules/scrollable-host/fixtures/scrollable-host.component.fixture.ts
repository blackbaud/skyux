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
  public isParentScrollable = true;
  public isGrandparentScrollable = false;

  @ViewChild('alternate')
  public alternateParent: ElementRef;

  @ViewChild('grandparent')
  public grandparent: ElementRef;

  @ViewChild('parent')
  public parent: ElementRef;

  @ViewChild('target')
  public target: ElementRef;

  public ngUnsubscribe = new Subject();

  constructor(private scrollableHostService: SkyScrollableHostService) {}

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getScrollableHost(alernative?: ElementRef): HTMLElement | Window {
    return this.scrollableHostService.getScrollableHost(
      alernative || this.target
    );
  }

  public moveTarget(): void {
    this.alternateParent.nativeElement.appendChild(this.target.nativeElement);
  }

  public watchScrollableHost(
    alternativeTarget?: ElementRef
  ): Observable<HTMLElement | Window> {
    return this.scrollableHostService
      .watchScrollableHost(alternativeTarget || this.target)
      .pipe(takeUntil(this.ngUnsubscribe));
  }

  public watchScrollableHostScrollEvents(
    alternativeTarget?: ElementRef
  ): Observable<void> {
    return this.scrollableHostService
      .watchScrollableHostScrollEvents(alternativeTarget || this.target)
      .pipe(takeUntil(this.ngUnsubscribe));
  }
}
