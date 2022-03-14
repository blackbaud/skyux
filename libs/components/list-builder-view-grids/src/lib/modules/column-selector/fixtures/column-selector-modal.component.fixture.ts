import { Component, OnDestroy } from '@angular/core';
import {
  SkyModalCloseArgs,
  SkyModalInstance,
  SkyModalService,
} from '@skyux/modals';

import { SkyColumnSelectorContext } from '../column-selector-context';
import { SkyColumnSelectorComponent } from '../column-selector-modal.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './column-selector-modal.component.fixture.html',
})
export class ColumnSelectorTestComponent implements OnDestroy {
  public columns = [
    {
      id: '1',
      heading: 'Column 1',
      description: 'Column 1 desc',
    },
    {
      id: '2',
      heading: 'Column 2',
      description: 'Column 2 desc',
    },
    {
      id: '3',
      heading: 'Column 3',
      description: 'Column 3 desc',
    },
  ];

  public selectedColumnIds = ['1', '2', '3'];

  private modalInstance: SkyModalInstance;

  constructor(private modalService: SkyModalService) {}

  public ngOnDestroy(): void {
    this.modalInstance.close();
    this.modalInstance = undefined;
  }

  public openColumnSelector() {
    this.modalInstance = this.modalService.open(SkyColumnSelectorComponent, [
      {
        provide: SkyColumnSelectorContext,
        useValue: {
          columns: this.columns,
          selectedColumnIds: this.selectedColumnIds,
        },
      },
    ]);

    this.modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save' && result.data) {
        this.selectedColumnIds = result.data;
      }
    });
  }
}
