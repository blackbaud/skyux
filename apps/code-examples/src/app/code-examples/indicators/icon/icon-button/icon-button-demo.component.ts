import { Component } from '@angular/core';

@Component({
  selector: 'app-icon-demo',
  templateUrl: './icon-button-demo.component.html',
})
export class IconDemoComponent {
  public TextButtonClick(): void {
    alert('Text with icon button clicked');
  }
  public IconOnlyButtonClick(): void {
    alert('Icon only button clicked');
  }
}
