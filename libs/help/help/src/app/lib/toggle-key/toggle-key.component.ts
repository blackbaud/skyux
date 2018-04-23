import { Component } from '@angular/core';

@Component({
  selector: 'toggle-key',
  templateUrl: './toggle-key.component.html',
  styleUrls: ['./toggle-key.component.scss']
})
export class ToggleKeyComponent {
  public helpKey1: string = 'advocacy.html';
  public helpKey2: string = 'bb-new-features.html';

  public helpKey: string = this.helpKey1;

  public toggleHelpKey(): void {
    this.helpKey = (this.helpKey === this.helpKey1) ? this.helpKey2 : this.helpKey1;
  }
}
