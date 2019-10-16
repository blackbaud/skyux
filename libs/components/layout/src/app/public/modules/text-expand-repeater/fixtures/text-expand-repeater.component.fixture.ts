import {
  Component,
  QueryList,
  ViewChildren
} from '@angular/core';

import {
  SkyTextExpandRepeaterComponent
} from '../text-expand-repeater.component';

@Component({
  selector: 'sky-text-expand-repeater-demo',
  templateUrl: './text-expand-repeater.component.fixture.html'
})
export class TextExpandRepeaterTestComponent {

  public customTemplateData: any[];

  public data: string[];

  public numItems: number;

  @ViewChildren(SkyTextExpandRepeaterComponent, {
    read: SkyTextExpandRepeaterComponent
  })
  public textExpand: QueryList<SkyTextExpandRepeaterComponent>;

}
