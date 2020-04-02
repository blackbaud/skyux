import {
  Component,
  Input
} from '@angular/core';

import {
  SkyIconDocsIconItem
} from './icon-item';

@Component({
  selector: 'app-icon-docs-icon-list',
  templateUrl: './icon-list.component.html',
  styleUrls: ['./icon-list.component.scss']
})
export class IconDocsIconListComponent {

  @Input()
  public iconType: string;

  @Input()
  public icons: SkyIconDocsIconItem[];

}
