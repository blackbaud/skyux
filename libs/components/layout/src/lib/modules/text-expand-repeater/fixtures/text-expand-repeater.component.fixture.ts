import { Component, QueryList, TrackByFunction, ViewChildren } from '@angular/core';

import { SkyTextExpandRepeaterComponent } from '../text-expand-repeater.component';
import { SkyTextExpandRepeaterListStyleType } from '../types/text-expand-repeater-list-style-type';

@Component({
  selector: 'sky-text-expand-repeater-demo',
  templateUrl: './text-expand-repeater.component.fixture.html',
  standalone: false,
})
export class TextExpandRepeaterTestComponent {
  public customTemplateData: any[] | undefined;

  public data: string[] | undefined;

  public numItems: number | undefined;

  @ViewChildren(SkyTextExpandRepeaterComponent, {
    read: SkyTextExpandRepeaterComponent,
  })
  public textExpand!: QueryList<SkyTextExpandRepeaterComponent>;

  public listStyle: SkyTextExpandRepeaterListStyleType = 'unordered';

  public trackBy: TrackByFunction<{text: string;
    number: number}> = (_index: number, item: {text: string; number: number }): unknown => item.number;
}
