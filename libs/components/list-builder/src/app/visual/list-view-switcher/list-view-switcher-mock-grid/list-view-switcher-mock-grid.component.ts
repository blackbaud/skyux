import {
  Component,
  forwardRef
} from '@angular/core';

 import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  ListViewComponent
} from '../../../public/modules/list';

import {
  ListState
} from '../../../public/modules/list/state';

 // Internal component only used to get at ListStateDispatcher.
@Component({
  selector: 'sky-list-view-switcher-mock-grid',
  templateUrl: './list-view-switcher-mock-grid.component.html',
  providers: [
    {
      provide: ListViewComponent,
      /* tslint:disable-next-line */
      useExisting: forwardRef(() => SkyListViewGridComponent)
    }
  ]
})
export class SkyListViewGridComponent extends ListViewComponent {

   public localItems: ListItemModel[];

   constructor(
    state: ListState
  ) {
    super(state, 'Grid View');
  }
 }
