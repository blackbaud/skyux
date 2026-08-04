import { Component, inject } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyDescriptionListModule } from '@skyux/layout';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-description-list-modal',
  templateUrl: './description-list-modal.component.html',
  imports: [SkyDescriptionListModule, SkyHelpInlineModule, SkyModalModule],
})
export class DescriptionListModalComponent {
  protected readonly instance = inject(SkyModalInstance);

  protected items: { term: string; description: string }[] = [
    { term: 'College', description: 'Humanities and Social Sciences' },
    { term: 'Department', description: 'Anthropology' },
    { term: 'Advisor', description: 'Cathy Green' },
    { term: 'Class year', description: '2024' },
  ];
}
