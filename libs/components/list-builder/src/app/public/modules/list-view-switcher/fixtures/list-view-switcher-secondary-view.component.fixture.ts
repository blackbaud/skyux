import {
  Component,
  forwardRef
} from '@angular/core';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  ListViewComponent
} from '../../list';

import {
  ListState
} from '../../list/state';

// Internal component only used to get at ListStateDispatcher.
@Component({
  selector: 'sky-list-view-switcher-secondary-view',
  templateUrl: './list-view-switcher-secondary-view.component.fixture.html',
  providers: [
    {
      provide: ListViewComponent,
      /* tslint:disable-next-line */
      useExisting: forwardRef(() => ListViewSwitcherSecondaryViewFixtureComponent)
    }
  ]
})
export class ListViewSwitcherSecondaryViewFixtureComponent extends ListViewComponent {

  public localItems: ListItemModel[];

  constructor(
    state: ListState
  ) {
    super(state, 'List View Switcher Secondary View');
  }
}
