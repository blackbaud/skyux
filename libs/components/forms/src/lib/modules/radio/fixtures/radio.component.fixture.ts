import { Component, ViewChild } from '@angular/core';

import { SkyRadioComponent } from '../radio.component';

@Component({
  templateUrl: './radio.component.fixture.html',
  standalone: false,
})
export class SkyRadioTestComponent {
  public selectedValue = '1';
  public disabled1 = false;

  public value1 = '1';
  public value2 = '2';
  public value3 = '3';

  public label1: string | undefined;
  public labelledBy3: string | undefined;

  public labelText1: string | undefined;
  public labelText2: string | undefined;
  public labelText3: string | undefined;

  public helpKey: string | undefined;

  public hintText1: string | undefined;
  public hintText2: string | undefined;
  public hintText3: string | undefined;

  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;

  public provideIds = true;

  public tabindex2: number | undefined;

  @ViewChild(SkyRadioComponent)
  public checkboxComponent!: SkyRadioComponent;

  public onCheckedChange(): void {
    /* */
  }

  public onClick(): void {
    /* */
  }

  public onDisabledChange(): void {
    /* */
  }
}
