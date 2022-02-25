import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { SkyScrollableHostService } from '../scrollable-host.service';

@Component({
  selector: 'sky-scrollable-host-fixture',
  styleUrls: ['./scrollable-host.component.fixture.scss'],
  templateUrl: './scrollable-host.component.fixture.html',
})
export class ScrollableHostFixtureComponent {
  public isParentScrollable: boolean = true;
  public isGrandparentScrollable: boolean = false;

  @ViewChild('alternate')
  public alternateParent: ElementRef;

  @ViewChild('grandparent')
  public grandparent: ElementRef;

  @ViewChild('parent')
  public parent: ElementRef;

  @ViewChild('target')
  public target: ElementRef;

  constructor(private scrollableHostService: SkyScrollableHostService) {}

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
    return this.scrollableHostService.watchScrollableHost(
      alternativeTarget || this.target
    );
  }

  public watchScrollableHostScrollEvents(
    alternativeTarget?: ElementRef
  ): Observable<void> {
    return this.scrollableHostService.watchScrollableHostScrollEvents(
      alternativeTarget || this.target
    );
  }
}
