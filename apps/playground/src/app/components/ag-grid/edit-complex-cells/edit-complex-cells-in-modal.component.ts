import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  SkyModalInstance,
  SkyModalModule,
  SkyModalService,
} from '@skyux/modals';

import { EditComplexCellsComponent } from './edit-complex-cells.component';

@Component({
  selector: 'app-edit-complex-cells-in-modal-modal',
  templateUrl: './edit-complex-cells-in-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyModalModule],
})
export class EditComplexCellsInModalModalComponent {
  public readonly modal = inject(SkyModalInstance);
  readonly #modalService = inject(SkyModalService);
  public openGridModal(): void {
    this.#modalService.open(EditComplexCellsInModalModalGridComponent, {
      size: 'large',
    });
  }

  public openNotGridModal(): void {
    this.#modalService.open(EditComplexCellsInModalModalNotGridComponent, {
      size: 'large',
    });
  }
}

@Component({
  selector: 'app-edit-complex-cells-in-modal-modal-grid',
  template: `
    <app-edit-complex-cells-in-modal-modal>
      <app-edit-complex-cells-visual />
    </app-edit-complex-cells-in-modal-modal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [EditComplexCellsComponent, EditComplexCellsInModalModalComponent],
})
export class EditComplexCellsInModalModalGridComponent {}

@Component({
  selector: 'app-edit-complex-cells-in-modal-modal-not-grid',
  template: `
    <app-edit-complex-cells-in-modal-modal>
      <p>Not a grid.</p>
    </app-edit-complex-cells-in-modal-modal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [EditComplexCellsInModalModalComponent],
})
export class EditComplexCellsInModalModalNotGridComponent {}

@Component({
  selector: 'app-edit-complex-cells-in-modal',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
})
export class EditComplexCellsInModalComponent implements OnInit {
  public readonly modal = inject(SkyModalInstance);
  readonly #modalService = inject(SkyModalService);

  public ngOnInit(): void {
    this.#modalService.open(EditComplexCellsInModalModalGridComponent, {
      size: 'large',
    });
  }
}
