import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-docs-interface-definition',
  templateUrl: './interface-definition.component.html',
  styleUrls: ['./interface-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsInterfaceDefinitionComponent {

  @Input()
  public interfaceName: string;

  @Input()
  public sourceCode: string;

}
