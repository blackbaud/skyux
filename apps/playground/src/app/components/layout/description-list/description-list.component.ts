import { Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { DescriptionListModalComponent } from './description-list-modal.component';

@Component({
  selector: 'app-description-list',
  templateUrl: './description-list.component.html',
  standalone: false,
})
export class DescriptionListComponent {
  readonly #modalSvc = inject(SkyModalService);

  public items: { term: string; description: string; showHelp?: boolean }[] = [
    {
      term: 'College',
      description: 'Humanities and Social Sciences',
    },
    {
      term: 'Department',
      description: 'Anthropology',
    },
    {
      term: 'Advisor',
      description: 'Cathy Green',
      showHelp: true,
    },
    {
      term: 'Class year',
      description: '2024',
    },
  ];

  public showHelp = false;

  public toggleHelp(): void {
    this.showHelp = !this.showHelp;
  }

  protected openInModal(): void {
    this.#modalSvc.open(DescriptionListModalComponent, { size: 'large' });
  }
}
