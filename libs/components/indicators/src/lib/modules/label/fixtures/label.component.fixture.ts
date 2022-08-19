import { Component, ViewChild } from '@angular/core';

import { SkyLabelType } from '../label-type';
import { SkyLabelComponent } from '../label.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './label.component.fixture.html',
})
export class LabelTestComponent {
  @ViewChild('labelCmp')
  public labelCmp: SkyLabelComponent;

  public labelType: SkyLabelType | undefined;
}
