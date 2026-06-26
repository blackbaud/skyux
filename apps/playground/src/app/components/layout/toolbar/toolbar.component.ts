import { Component } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  standalone: false,
})
export class ToolbarComponent {
  public activeViewId = 'table';
}
