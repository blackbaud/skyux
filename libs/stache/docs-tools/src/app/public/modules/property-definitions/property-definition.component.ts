import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'sky-property-definition',
  templateUrl: './property-definition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyPropertyDefinitionComponent {

  @Input()
  public defaultValue: string;

  @Input()
  public isRequired = false;

  @Input()
  public propertyName: string;

  @ViewChild('templateRef', { read: TemplateRef })
  public templateRef: TemplateRef<any>;

}
