import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import { SkyDefinitionListService } from './definition-list.service';

@Component({
  selector: 'sky-definition-list',
  templateUrl: './definition-list.component.html',
  styleUrls: ['./definition-list.component.scss'],
  providers: [SkyDefinitionListService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDefinitionListComponent {

  // TODO: figure out how to manage state here.
  @Input()
  public set labelWidth(value: string) {
    this.service.labelWidth.next(value);
  }

  @Input()
  public set defaultValue(value: string) {
    this.service.defaultValue.next(value);
  }

  constructor(
    public service: SkyDefinitionListService) { }
}
