import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'sky-docs-property-definition',
  template: `
  <ng-template #templateRef>
    <ng-content></ng-content>
  </ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsPropertyDefinitionComponent {

  @Input()
  public propertyType: string;

  @Input()
  public defaultValue: string;

  @Input()
  public isOptional: boolean = false;

  @Input()
  public deprecationWarning: string;

  @Input()
  public propertyDecorator: 'Input' | 'Output';

  @Input()
  public propertyName: string;

  @ViewChild('templateRef', { read: TemplateRef })
  public templateRef: TemplateRef<any>;

}
