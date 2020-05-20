import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  SkyProgressIndicatorChange,
  SkyProgressIndicatorDisplayMode
} from '../../public/public_api';

@Component({
  selector: 'sky-progress-indicator-horizontal-visual',
  templateUrl: './progress-indicator-horizontal-visual.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressIndicatorWizardDemoComponent {

  public title = 'Progress indicator wizard example';
  public displayMode = SkyProgressIndicatorDisplayMode.Horizontal;

  constructor(
    public instance: SkyModalInstance
  ) { }

  public onProgressChanges(changes: SkyProgressIndicatorChange): void {
    if (changes.isComplete) {
      this.instance.save();
    }
  }
}
