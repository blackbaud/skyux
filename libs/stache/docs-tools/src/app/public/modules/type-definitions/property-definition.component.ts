import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  SkyDocsPropertyDecorator
} from './property-decorator';

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
  public defaultValue: string;

  @Input()
  public deprecationWarning: string;

  @Input()
  public set isOptional(value: boolean) {
    this._isOptional = value;
  }

  public get isOptional(): boolean {
    return this._isOptional || false;
  }

  @Input()
  public propertyDecorator: SkyDocsPropertyDecorator;

  @Input()
  public propertyName: string;

  @Input()
  public propertyType: string;

  @ViewChild('templateRef', {
    read: TemplateRef,
    static: false
  })
  public templateRef: TemplateRef<any>;

  private _isOptional: boolean;

}
