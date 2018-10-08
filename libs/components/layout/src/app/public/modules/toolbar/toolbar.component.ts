import {
  Component,
  AfterContentInit,
  ContentChildren,
  QueryList
} from '@angular/core';

import {
  SkyToolbarSectionComponent
} from './toolbar-section.component';

@Component({
  selector: 'sky-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html'
})
export class SkyToolbarComponent implements AfterContentInit {

  public hasSections: boolean = false;

  @ContentChildren(SkyToolbarSectionComponent, {descendants: true})
  private sectionComponents: QueryList<SkyToolbarSectionComponent>;

  public ngAfterContentInit() {
    this.hasSections = this.sectionComponents.length > 0;
  }
}
