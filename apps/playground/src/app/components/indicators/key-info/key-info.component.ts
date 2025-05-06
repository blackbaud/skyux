import { Component } from '@angular/core';

@Component({
  selector: 'app-key-info',
  templateUrl: './key-info.component.html',
  styleUrls: ['./key-info.component.scss'],
  standalone: false,
})
export class KeyInfoComponent {
  public showHelp = false;

  public onHelpClick(): void {
    alert(`Help is available for this component.`);
  }
}
