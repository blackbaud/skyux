import { Component, TemplateRef, ViewChild } from '@angular/core';

import { SkyListToolbarComponent } from '../list-toolbar.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-toolbar.component.fixture.html',
  standalone: false,
})
export class ListToolbarTestComponent {
  public inMemorySearchEnabled: boolean;
  public toolbarType: string;
  public searchEnabled: boolean;
  public sortEnabled: boolean;
  public searchText: string;
  public showCustomItem1 = true;

  @ViewChild(SkyListToolbarComponent, {
    read: SkyListToolbarComponent,
    static: false,
  })
  public toolbar: SkyListToolbarComponent;

  @ViewChild('default', {
    read: TemplateRef,
    static: true,
  })
  public default: TemplateRef<unknown>;
}
