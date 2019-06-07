import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'sky-docs-method-definition-parameter',
  templateUrl: './method-definition-parameter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsMethodDefinitionParameterComponent {

  @Input()
  public parameterName: string;

  @Input()
  public parameterType: string;

  @Input()
  public defaultValue: string;

  @ViewChild('templateRef', { read: TemplateRef })
  public templateRef: TemplateRef<any>;

}
