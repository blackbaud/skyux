import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { DataManagerLargeComponent } from '../data-manager-large.component';

@Component({
  selector: 'app-delete-button',
  imports: [SkyIconModule],
  templateUrl: './delete-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteButtonComponent implements ICellRendererAngularComp {
  readonly #component = inject(DataManagerLargeComponent);
  #params: ICellRendererParams | undefined;

  public agInit(params: ICellRendererParams): void {
    this.#params = params;
  }

  public refresh(params: ICellRendererParams): boolean {
    this.#params = params;
    return false;
  }

  protected delete(): void {
    const id: string | undefined = this.#params?.data.id;
    if (id) {
      this.#component.markForDelete(id);
    }
  }
}
