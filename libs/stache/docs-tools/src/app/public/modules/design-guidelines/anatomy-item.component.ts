import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-docs-anatomy-item',
  templateUrl: './anatomy-item.component.html',
  styleUrls: ['./anatomy-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsAnatomyItemComponent {

  @Input()
  public isOptional: boolean = false;

  public marker: string;

}
