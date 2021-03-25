import {
  Component
} from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './action-button-ngfor.component.fixture.html'
})
export class ActionButtonNgforTestComponent {

  public items: any[] = [
    {
      iconType: 'square-o',
      header: 'Action button',
      details: 'The action button module creates a large button with an icon, heading, and details.'
    },
    {
      iconType: 'bell',
      header: 'Alert',
      details: 'The alert component highlights critical information that users must see.'
    },
    {
      iconType: 'search',
      header: 'Autocomplete',
      details: 'The autocomplete component creates a text input that filters data based on user entries.'
    }
  ];

}
