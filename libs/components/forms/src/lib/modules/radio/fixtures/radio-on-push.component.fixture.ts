import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

@Component({
  templateUrl: './radio.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyRadioOnPushTestComponent {
  public selectedValue = '1';
  public disabled2 = false;

  public value1 = '1';
  public value2 = '2';
  public value3 = '3';

  public label1: string;
  public labelledBy3: string;

  public tabindex2: string;

  constructor(public ref: ChangeDetectorRef) {}
}
