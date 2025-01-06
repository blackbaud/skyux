import { Component } from '@angular/core';
import {
  SkySelectionModalOpenArgs,
  SkySelectionModalService,
} from '@skyux/lookup';

@Component({
  selector: 'sky-selection-modal-harness-test',
  templateUrl: './selection-modal-harness-test.component.html',
  standalone: false,
})
export class SelectionModalHarnessTestComponent {
  public selectedItems: { id: string; name: string }[] | undefined;

  #selectionModalSvc: SkySelectionModalService;

  constructor(selectionModalSvc: SkySelectionModalService) {
    this.#selectionModalSvc = selectionModalSvc;
  }

  public showSelectionModal(args: SkySelectionModalOpenArgs): void {
    const instance = this.#selectionModalSvc.open(args);

    instance.closed.subscribe((args) => {
      if (args.reason === 'save') {
        this.selectedItems = args.selectedItems as {
          id: string;
          name: string;
        }[];
      }
    });
  }
}
