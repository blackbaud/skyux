import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

@Component({
  templateUrl: './radio-on-push.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyRadioOnPushTestComponent {
  public selectedValue = '1';
  public disabled2 = false;

  public value1 = '1';
  public value2 = '2';
  public value3 = '3';

  public label1: string | undefined;
  public labelledBy3: string | undefined;

  public tabindex2: number | undefined;

  constructor(public ref: ChangeDetectorRef) {}
}
