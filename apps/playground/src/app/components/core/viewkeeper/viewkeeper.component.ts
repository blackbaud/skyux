import { Component } from '@angular/core';

@Component({
  selector: 'app-viewkeeper',
  templateUrl: './viewkeeper.component.html',
  styleUrls: ['./viewkeeper.component.scss'],
  standalone: false,
})
export class ViewkeeperComponent {
  protected el2Visible = false;

  protected scrollableHost = false;

  protected sidebarExpanded = false;

  protected toggleEl2(): void {
    this.el2Visible = !this.el2Visible;
  }

  protected toggleScrollableHost(): void {
    this.scrollableHost = !this.scrollableHost;
  }

  protected toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
}
