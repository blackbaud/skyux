import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange
} from '../../public';

@Component({
  selector: 'app-typedoc',
  templateUrl: './typedoc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppTypeDocComponent {

  public get showAlignmentOptions(): boolean {
    const placement = this.demoSettings.skyPopoverPlacement;
    return (placement === 'above' || placement === 'below');
  }

  public demoSettings: any = {};

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.showTitle === true) {
      this.demoSettings.popoverTitle = 'Popover title';
    } else if (change.showTitle === false) {
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
