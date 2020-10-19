import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-list-toolbar-demo',
  templateUrl: './list-toolbar-demo.component.html'
})
export class ListToolbarDemoComponent {

  public data: any[] = [
    { id: '1', name: 'Niels Bohr', email: 'niels.bohr@example.com', amount: 170.75, status: 'Paid' },
    { id: '2', name: 'Ada Lovelace', email: 'ada.lovelace@example.com', amount: 114.13, status: 'Paid' },
    { id: '3', name: 'Marie Curie', email: 'marie.curie@example.com', amount: 111, status: 'Past due' },
    { id: '4', name: 'Barbara McClintock', email: 'barbara.mcclintock@example.com', amount: 84.63, status: 'Paid' },
    { id: '5', name: 'Michael Faraday', email: 'michael.faraday@example.com', amount: 83.97, status: 'Paid' },
    { id: '6', name: 'Enrico Fermi', email: 'enrico.fermi@example.com', amount: 74.5, status: 'Past due' },
    { id: '7', name: 'Mae C. Jemison', email: 'mae.jemison@example.com', amount: 70.86, status: 'Paid' },
    { id: '8', name: 'Nikola Tesla', email: 'nikola.tesla@example.com', amount: 15.00, status: 'Paid' },
    { id: '9', name: 'Hubert J. Farnsworth', email: 'hubert.j.farnsworth@example.com', amount: 999.99, status: 'Past Due' }
  ];

}
