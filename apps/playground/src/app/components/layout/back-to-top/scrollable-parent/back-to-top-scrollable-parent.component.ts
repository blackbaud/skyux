import { Component } from '@angular/core';

@Component({
  selector: 'app-back-to-top-scrollable-parent',
  templateUrl: './back-to-top-scrollable-parent.component.html',
})
export class BackToTopScrollableParentComponent {
  public moveStuff(): void {
    document
      .querySelector('#screenshot-back-to-top-2')
      .appendChild(document.querySelector('#screenshot-back-to-top div'));
  }
}
