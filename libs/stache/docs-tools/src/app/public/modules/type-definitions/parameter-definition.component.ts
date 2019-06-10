import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'sky-docs-parameter-definition',
  template: `
  <ng-template #templateRef>
    <ng-content></ng-content>
  </ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsParameterDefinitionComponent {

  @Input()
  public parameterType: string;

  @Input()
  public defaultValue: string;

  @Input()
  public isOptional: boolean = false;

  @Input()
  public parameterName: string;

  @ViewChild('templateRef', { read: TemplateRef })
  public templateRef: TemplateRef<any>;

}
