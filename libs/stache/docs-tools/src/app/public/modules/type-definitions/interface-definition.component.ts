import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsInterfaceDefinition
} from './type-definitions';

@Component({
  selector: 'sky-docs-interface-definition',
  templateUrl: './interface-definition.component.html',
  styleUrls: ['./interface-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsInterfaceDefinitionComponent {

  @Input()
  public config: SkyDocsInterfaceDefinition[];

}
