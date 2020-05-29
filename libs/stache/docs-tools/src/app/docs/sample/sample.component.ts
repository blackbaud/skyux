import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '../../public/public_api';

@Component({
  selector: 'app-sample-docs',
  templateUrl: './sample.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppTypeDocComponent {

  public alignmentChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
    { value: 'center', label: 'Center' }
  ];

  public demoSettings: any = {};

  public placementChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'above', label: 'Above' },
    { value: 'below', label: 'Below' },
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' }
  ];

  public get showAlignmentOptions(): boolean {
    const placement = this.demoSettings.skyPopoverPlacement;
    return (placement === 'above' || placement === 'below');
  }

  public onDemoReset(): void {
    console.log('Reset button clicked!');
  }

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
