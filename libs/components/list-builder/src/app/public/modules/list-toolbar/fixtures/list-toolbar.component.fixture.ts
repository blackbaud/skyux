import {
  Component,
  ViewChild,
  TemplateRef
} from '@angular/core';

import {
  SkyListToolbarComponent
} from '../list-toolbar.component';

 @Component({
   selector: 'sky-test-cmp',
   templateUrl: './list-toolbar.component.fixture.html'
 })
 export class ListToolbarTestComponent {
  public inMemorySearchEnabled: boolean;
  public toolbarType: string;
  public searchEnabled: boolean;
  public sortEnabled: boolean;
  public searchText: string;
  public showCutomItem1 = true;

  @ViewChild(SkyListToolbarComponent)
  public toolbar: SkyListToolbarComponent;

  @ViewChild('default')
  public default: TemplateRef<any>;
}
