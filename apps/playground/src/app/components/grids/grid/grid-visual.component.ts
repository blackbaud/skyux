import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { SkyGridModule } from '@skyux/grids';
import { ListSortFieldSelectorModel } from '@skyux/list-builder-common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-visual',
  standalone: false,
  styles: `
    :host {
      display: block;
      padding: 16px;
    }
  `,
  templateUrl: './grid-visual.component.html',
})
export class GridVisualComponent {
  public data = [
    {
      id: '1',
      name: 'Niels Bohr',
      email: 'niels.bohr@example.com',
      amount: 170.75,
      status: 'Paid',
      role: 'Admin',
    },
    {
      id: '2',
      name: 'Ada Lovelace',
      email: 'ada.lovelace@example.com',
      amount: 114.13,
      status: 'Paid',
      role: 'Editor',
    },
    {
      id: '3',
      name: 'Marie Curie',
      email: 'marie.curie@example.com',
      amount: 111,
      status: 'Past due',
      role: 'Viewer',
    },
    {
      id: '4',
      name: 'Barbara McClintock',
      email: 'barbara.mcclintock@example.com',
      amount: 84.63,
      status: 'Paid',
      role: 'Admin',
    },
    {
      id: '5',
      name: 'Michael Faraday',
      email: 'michael.faraday@example.com',
      amount: 83.97,
      status: 'Paid',
      role: 'Editor',
    },
    {
      id: '6',
      name: 'Enrico Fermi',
      email: 'enrico.fermi@example.com',
      amount: 74.5,
      status: 'Past due',
      role: 'Viewer',
    },
    {
      id: '7',
      name: 'Mae C. Jemison',
      email: 'mae.jemison@example.com',
      amount: 70.86,
      status: 'Paid',
      role: 'Admin',
    },
  ];

  public selectedColumnIds = ['name', 'email', 'amount', 'status', 'role'];

  public onSelectedColumnIdsChange(selectedColumnIds: string[]): void {
    this.selectedColumnIds = selectedColumnIds;
    console.log('Column order changed:', selectedColumnIds);
  }

  public onSortFieldChange(sortField: ListSortFieldSelectorModel): void {
    console.log('Sort field changed:', sortField);
  }
}

@NgModule({
  imports: [SkyGridModule],
  declarations: [GridVisualComponent],
  exports: [GridVisualComponent],
})
export class GridVisualComponentModule {}
