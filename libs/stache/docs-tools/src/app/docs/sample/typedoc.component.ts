import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-typedoc',
  templateUrl: './typedoc.component.html'
})
export class AppTypeDocComponent {

  public demoSettings: any = {};

  public onDemoSelectionChange(change: any): void {
    if (change.showTitle === true) {
      this.demoSettings.popoverTitle = 'Popover title';
    } else {
      this.demoSettings.popoverTitle = undefined;
    }

    if (change.alignment) {
      this.demoSettings.skyPopoverAlignment = change.alignment;
    }

    if (change.placement) {
      this.demoSettings.skyPopoverPlacement = change.placement;
    }
  }

}
