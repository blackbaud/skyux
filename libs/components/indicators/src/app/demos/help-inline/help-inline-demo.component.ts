import { Component } from '@angular/core';

@Component({
  selector: 'sky-help-inline-demo',
  templateUrl: './help-inline-demo.component.html'
})
export class SkyHelpInlineDemoComponent {
  public givingActionClick() {
    alert('Giving help inline clicked');
  }

  public emailActionClick() {
    alert('enter email in format joe@abc.com');
  }
}
