import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { SkyRadioComponent } from '../radio.component';

@Component({
  templateUrl: './radio.component.fixture.html',
})
export class SkyRadioTestComponent implements AfterViewInit {
  public selectedValue = '1';
  public disabled1 = false;

  public value1 = '1';
  public value2 = '2';
  public value3 = '3';

  public label1: string;
  public labelledBy3: string;

  public tabindex2: string;

  @ViewChild(SkyRadioComponent)
  public checkboxComponent: SkyRadioComponent;

  public ngAfterViewInit() {
    this.checkboxComponent.disabledChange.subscribe((value) => {
      this.onDisabledChange(value);
    });
  }

  public onDisabledChange(value: boolean): void {}

  public onClick() {}
}
