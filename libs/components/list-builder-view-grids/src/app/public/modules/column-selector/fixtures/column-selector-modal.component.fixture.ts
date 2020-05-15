import {
  Component
} from '@angular/core';

import {
  SkyModalService,
  SkyModalCloseArgs
} from '@skyux/modals';

import {
  SkyColumnSelectorComponent
} from '../column-selector-modal.component';

import {
  SkyColumnSelectorContext
} from '../column-selector-context';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './column-selector-modal.component.fixture.html'
})
export class ColumnSelectorTestComponent {
  public columns = [
      {
        id: '1',
        heading: 'Column 1',
        description: 'Column 1 desc'
      },
      {
        id: '2',
        heading: 'Column 2',
        description: 'Column 2 desc'
      },
      {
        id: '3',
        heading: 'Column 3',
        description: 'Column 3 desc'
      }
    ];

  public selectedColumnIds = [
      '1',
      '2',
      '3'
    ];

  constructor(private modalService: SkyModalService) {

  }

  public openColumnSelector() {
    this.modalService.open(SkyColumnSelectorComponent, [
      {
        provide: SkyColumnSelectorContext,
        useValue: {
          columns: this.columns,
          selectedColumnIds: this.selectedColumnIds
        }
      }
    ]).closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save' && result.data) {
        this.selectedColumnIds = result.data;
      }
    });
  }
}
