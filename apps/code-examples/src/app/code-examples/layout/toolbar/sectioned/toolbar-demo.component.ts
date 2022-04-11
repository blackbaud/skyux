import { Component } from '@angular/core';

@Component({
  selector: 'app-toolbar-demo',
  templateUrl: './toolbar-demo.component.html',
})
export class ToolbarDemoComponent {
  public onButtonClicked(buttonText: string): void {
    alert(buttonText + ' clicked!');
  }
}
