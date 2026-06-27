import { Component, input } from '@angular/core';

import { SkyBoxHeadingLevel } from '../box-heading-level';
import { SkyBoxHeadingStyle } from '../box-heading-style';

@Component({
  selector: 'sky-box-test',
  templateUrl: 'box.component.fixture.html',
  standalone: false,
})
export class BoxTestComponent {
  public ariaLabel = input<string | undefined>(undefined);
  public ariaLabelledBy = input<string | undefined>(undefined);
  public ariaRole = input<string | undefined>(undefined);
  public headingHidden = input<boolean>(false);
  public headingLevel = input<SkyBoxHeadingLevel | undefined>(2);
  public headingStyle = input<SkyBoxHeadingStyle | undefined>(2);
  public headingText = input<string | undefined>('Heading text');
  public helpKey = input<string | undefined>(undefined);
  public helpPopoverContent = input<string | undefined>(undefined);
  public helpPopoverTitle = input<string | undefined>(undefined);
  public showHeader = input<boolean>(true);
}
