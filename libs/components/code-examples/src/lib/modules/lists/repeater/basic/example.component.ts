import { Component } from '@angular/core';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';

/**
 * @title Repeater with basic setup
 */
@Component({
  selector: 'app-lists-repeater-basic-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  imports: [SkyDropdownModule, SkyRepeaterModule],
})
export class ListsRepeaterBasicExampleComponent {
  protected items: {
    note: string;
    status?: string;
    title?: string;
    accessibilityLabel?: string;
  }[] = [
    {
      title: 'Call Robert Hernandez',
      note: 'Robert recently gave a very generous gift. We should call him to thank him.',
      status: 'Completed',
    },
    {
      title: 'Send invitation to Spring Ball',
      note: "The Spring Ball is coming up soon. Let's get those invitations out!",
      status: 'Past due',
    },
    {
      title: 'Assign prospects',
      note: 'There are 14 new prospects who are not assigned to fundraisers.',
      status: 'Due tomorrow',
    },
    {
      title: 'Process gift receipts',
      note: 'There are 28 recent gifts that are not receipted.',
      status: 'Due next week',
    },
    {
      note: 'Three other tasks were not displayed',
      accessibilityLabel: 'Other tasks',
    },
  ];

  protected onActionClicked(buttonText: string): void {
    alert(buttonText + ' was clicked!');
  }
}
