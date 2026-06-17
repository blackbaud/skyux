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

import { ReadonlyGridComponent } from './readonly-grid.component';

@Component({
  selector: 'app-readonly-grid-in-modal-modal',
  templateUrl: './readonly-grid-in-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyModalModule],
})
export class ReadonlyGridInModalModalComponent {
  public readonly modal = inject(SkyModalInstance);
  readonly #modalService = inject(SkyModalService);

  public openGridModal(): void {
    this.#modalService.open(ReadonlyGridInModalModalGridComponent, {
      size: 'large',
    });
  }

  public openNotGridModal(): void {
    this.#modalService.open(ReadonlyGridInModalModalNotGridComponent, {
      size: 'large',
    });
  }
}

@Component({
  selector: 'app-readonly-grid-in-modal-modal-grid',
  template: `
    <app-readonly-grid-in-modal-modal>
      <app-readonly-grid-visual />
    </app-readonly-grid-in-modal-modal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReadonlyGridComponent, ReadonlyGridInModalModalComponent],
})
export class ReadonlyGridInModalModalGridComponent {}

@Component({
  selector: 'app-readonly-grid-in-modal-modal-not-grid',
  template: `
    <app-readonly-grid-in-modal-modal>
      <p>Not a grid.</p>
    </app-readonly-grid-in-modal-modal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReadonlyGridInModalModalComponent],
})
export class ReadonlyGridInModalModalNotGridComponent {}

@Component({
  selector: 'app-readonly-grid-in-modal',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
})
export class ReadonlyGridInModalComponent implements OnInit {
  public readonly modal = inject(SkyModalInstance);
  readonly #modalService = inject(SkyModalService);

  public ngOnInit(): void {
    this.#modalService.open(ReadonlyGridInModalModalGridComponent, {
      size: 'large',
    });
  }
}
