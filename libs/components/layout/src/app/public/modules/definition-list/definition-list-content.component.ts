import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'sky-definition-list-content',
  templateUrl: './definition-list-content.component.html',
  styleUrls: ['./definition-list-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDefinitionListContentComponent { }
