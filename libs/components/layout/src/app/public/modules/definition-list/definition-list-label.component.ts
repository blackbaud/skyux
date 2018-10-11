import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import { SkyDefinitionListService } from './definition-list.service';

@Component({
  selector: 'sky-definition-list-label',
  templateUrl: './definition-list-label.component.html',
  styleUrls: ['./definition-list-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDefinitionListLabelComponent {
  public labelWidth: number;

  constructor(
    public service: SkyDefinitionListService) { }
}
