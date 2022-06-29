import { Component } from '@angular/core';

@Component({
  selector: 'app-viewkeeper',
  templateUrl: './viewkeeper.component.html',
  styleUrls: ['./viewkeeper.component.scss'],
})
export class ViewkeeperComponent {
  public el2Visible = false;

  public scrollableHost = false;

  public toggleEl2(): void {
    this.el2Visible = !this.el2Visible;
  }

  public toggleScrollableHost(): void {
    this.scrollableHost = !this.scrollableHost;
  }
}
