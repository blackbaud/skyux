import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';

@Component({
  templateUrl: './toggle-switch-on-push.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyToggleSwitchOnPushFixtureComponent {

  public isChecked: boolean = false;

  public showLabel: boolean = true;

  constructor(
    public ref: ChangeDetectorRef
  ) { }

}
