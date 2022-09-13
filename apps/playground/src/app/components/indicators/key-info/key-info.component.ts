import { Component } from '@angular/core';

@Component({
  selector: 'app-key-info',
  templateUrl: './key-info.component.html',
  styleUrls: ['./key-info.component.scss'],
})
export class KeyInfoComponent {
  public showHelp = false;

  public onHelpClick() {
    alert(`Help is available for this component.`);
  }
}
