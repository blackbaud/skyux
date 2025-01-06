import { Component } from '@angular/core';

import { SkyBoxHeadingLevel } from '../box-heading-level';
import { SkyBoxHeadingStyle } from '../box-heading-style';

@Component({
  selector: 'sky-box-test',
  templateUrl: 'box.component.fixture.html',
  standalone: false,
})
export class BoxTestComponent {
  public ariaLabel: string | undefined;
  public ariaLabelledBy: string | undefined;
  public ariaRole: string | undefined;
  public headingHidden = false;
  public headingLevel: SkyBoxHeadingLevel | undefined = 2;
  public headingStyle: SkyBoxHeadingStyle | undefined = 2;
  public headingText: string | undefined = 'Heading text';
  public helpKey: string | undefined;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
  public showHeader = true;
}
