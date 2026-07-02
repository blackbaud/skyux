import { Component, ViewChild, input, model } from '@angular/core';

import { SkyRadioComponent } from '../radio.component';

@Component({
  templateUrl: './radio.component.fixture.html',
  standalone: false,
})
export class SkyRadioTestComponent {
  public selectedValue = model<string>('1');
  public disabled1 = input<boolean>(false);

  public value1 = input<string>('1');
  public value2 = input<string>('2');
  public value3 = input<string>('3');

  public label1 = input<string | undefined>(undefined);
  public labelledBy3 = input<string | undefined>(undefined);

  public labelText1 = input<string | undefined>(undefined);
  public labelText2 = input<string | undefined>(undefined);
  public labelText3 = input<string | undefined>(undefined);

  public helpKey = input<string | undefined>(undefined);

  public hintText1 = input<string | undefined>(undefined);
  public hintText2 = input<string | undefined>(undefined);
  public hintText3 = input<string | undefined>(undefined);

  public helpPopoverContent = input<string | undefined>(undefined);
  public helpPopoverTitle = input<string | undefined>(undefined);

  public provideIds = input<boolean>(true);

  public tabindex2 = input<number | undefined>(undefined);

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
