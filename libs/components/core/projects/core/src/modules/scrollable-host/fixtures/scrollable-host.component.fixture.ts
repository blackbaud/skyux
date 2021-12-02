import { Component, ElementRef, ViewChild } from "@angular/core";
import { Observable } from "rxjs";

import { SkyScrollableHostService } from "../scrollable-host.service";

@Component({
  selector: 'sky-scrollable-host-fixture',
  styleUrls: ['./scrollable-host.component.fixture.scss'],
  templateUrl: './scrollable-host.component.fixture.html'
})
export class ScrollableHostFixtureComponent {

  public isParentScrollable: boolean = true;
  public isGrandparentScrollable: boolean = false;

  @ViewChild('grandparent')
  public grandparent: ElementRef;

  @ViewChild('parent')
  public parent: ElementRef;

  @ViewChild('target')
  public target: ElementRef;

  constructor(private scrollableHostService: SkyScrollableHostService) { }

  public getScrollableHost(alernative?: ElementRef): HTMLElement | Window {
    return this.scrollableHostService.getScrollableHost(alernative || this.target);
  }

  public watchScrollableHost(alternative?: ElementRef): Observable<HTMLElement | Window> {
    return this.scrollableHostService.watchScrollableHost(alternative || this.target);
  }

  public watchScrollableHostScrollEvents(alternative?: ElementRef): Observable<void> {
    return this.scrollableHostService.watchScrollableHostScrollEvents(alternative || this.target);
  }

}
