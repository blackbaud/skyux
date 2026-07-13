import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';

@Component({
  templateUrl: './toggle-switch-on-push.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyToggleSwitchOnPushFixtureComponent {
  public readonly ref = inject(ChangeDetectorRef);

  public isChecked = false;

  public showLabel = true;
}
