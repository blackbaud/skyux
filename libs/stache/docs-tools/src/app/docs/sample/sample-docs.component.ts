import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'app-sample-docs',
  templateUrl: './sample-docs.component.html',
  styleUrls: ['./sample-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppSampleDocsComponent {

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
