import { Component, OnInit } from '@angular/core';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';

@Component({
  selector: 'app-edit-complex-cells-in-modal-modal',
  templateUrl: './edit-complex-cells-in-modal.component.html',
})
export class EditComplexCellsInModalModalComponent {
  constructor(
    public modal: SkyModalInstance,
    private modalService: SkyModalService
  ) {}

  public openGridModal(): void {
    this.modalService.open(EditComplexCellsInModalModalGridComponent, {
      size: 'large',
    });
  }

  public openNotGridModal(): void {
    this.modalService.open(EditComplexCellsInModalModalNotGridComponent, {
      size: 'large',
    });
  }
}

@Component({
  template: `
    <app-edit-complex-cells-in-modal-modal>
      <app-edit-complex-cells-visual></app-edit-complex-cells-visual>
    </app-edit-complex-cells-in-modal-modal>
  `,
})
export class EditComplexCellsInModalModalGridComponent {}

@Component({
  template: `
    <app-edit-complex-cells-in-modal-modal>
      <p>Not a grid.</p>
    </app-edit-complex-cells-in-modal-modal>
  `,
})
export class EditComplexCellsInModalModalNotGridComponent {}

@Component({
  selector: 'app-edit-complex-cells-in-modal',
  template: '',
})
export class EditComplexCellsInModalComponent implements OnInit {
  constructor(private modalService: SkyModalService) {}

  public ngOnInit(): void {
    this.modalService.open(EditComplexCellsInModalModalGridComponent, {
      size: 'large',
    });
  }
}
