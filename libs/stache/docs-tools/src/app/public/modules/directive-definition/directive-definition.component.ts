import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-docs-directive-definition',
  templateUrl: './directive-definition.component.html',
  styleUrls: ['./directive-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDirectiveDefinitionComponent {

  @Input()
  public directiveName: string;

  @Input()
  public directiveSelector: string;

}
