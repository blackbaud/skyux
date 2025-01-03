import { Component, input } from '@angular/core';
import { SkyIllustrationModule, SkyIllustrationSize } from '@skyux/indicators';

@Component({
  imports: [SkyIllustrationModule],
  template: `
    <sky-illustration
      data-sky-id="illustration-test"
      [name]="name()"
      [size]="size()"
    />
  `,
})
export class SkyIllustrationTestComponent {
  public name = input('success');
  public size = input<SkyIllustrationSize>('sm');
}
