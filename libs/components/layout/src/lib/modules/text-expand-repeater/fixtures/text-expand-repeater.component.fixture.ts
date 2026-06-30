import { Component, QueryList, ViewChildren, input } from '@angular/core';

import { SkyTextExpandRepeaterComponent } from '../text-expand-repeater.component';
import { SkyTextExpandRepeaterListStyleType } from '../types/text-expand-repeater-list-style-type';

@Component({
  selector: 'sky-text-expand-repeater-demo',
  templateUrl: './text-expand-repeater.component.fixture.html',
  standalone: false,
})
export class TextExpandRepeaterTestComponent {
  public customTemplateData = input<any[] | undefined>(undefined);

  public data = input<string[] | undefined>(undefined);

  public numItems = input<number | undefined>(undefined);

  @ViewChildren(SkyTextExpandRepeaterComponent, {
    read: SkyTextExpandRepeaterComponent,
  })
  public textExpand!: QueryList<SkyTextExpandRepeaterComponent>;

  public listStyle = input<SkyTextExpandRepeaterListStyleType>('unordered');
}
