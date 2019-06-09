import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'sky-docs-property-definition',
  templateUrl: './property-definition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsPropertyDefinitionComponent {

  @Input()
  public propertyType: string;

  @Input()
  public defaultValue: string;

  @Input()
  public deprecationWarning: string;

  @Input()
  public propertyDecorator: 'Input' | 'Output';

  @Input()
  public propertyName: string;

  @ViewChild('templateRef', { read: TemplateRef })
  public templateRef: TemplateRef<any>;

}
