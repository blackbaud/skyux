import { Component, ElementRef, ViewChild } from "@angular/core";

@Component({
  selector: 'sky-scrollable-host-fixture',
  styleUrls: ['./scrollable-host.component.fixture.scss'],
  templateUrl: './scrollable-host.component.fixture.html'
})
export class ScrollableHostFixtureComponent {

  public isParentScrollable: boolean = true;

  @ViewChild('parent')
  public parent: ElementRef;

  @ViewChild('target')
  public target: ElementRef;

}
