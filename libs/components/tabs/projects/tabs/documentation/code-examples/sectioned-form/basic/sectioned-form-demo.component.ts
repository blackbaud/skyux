import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-sectioned-form-demo',
  templateUrl: './sectioned-form-demo.component.html'
})
export class SectionedFormDemoComponent {

  public activeIndexDisplay: number;

  public onIndexChanged(newIndex: number): void {
    this.activeIndexDisplay = newIndex;
  }

}
