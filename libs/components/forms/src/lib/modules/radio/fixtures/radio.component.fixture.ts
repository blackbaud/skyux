import { Component, ViewChild } from '@angular/core';

import { SkyRadioComponent } from '../radio.component';

@Component({
  templateUrl: './radio.component.fixture.html',
})
export class SkyRadioTestComponent {
  public selectedValue = '1';
  public disabled1 = false;

  public value1 = '1';
  public value2 = '2';
  public value3 = '3';

  public label1: string | undefined;
  public labelledBy3: string | undefined;

  public provideIds = true;

  public tabindex2: number | undefined;

  @ViewChild(SkyRadioComponent)
  public checkboxComponent!: SkyRadioComponent;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onCheckedChange(checked: boolean): void {
    /* */
  }

  public onClick(): void {
    /* */
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onDisabledChange(disabled: boolean): void {
    /* */
  }
}
