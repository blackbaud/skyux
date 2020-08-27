import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  SkyDocsTypeDefinition
} from './type-definition';

@Component({
  selector: 'sky-docs-parameter-definition',
  templateUrl: './parameter-definition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsParameterDefinitionComponent {

  @Input()
  public defaultValue: string;

  @Input()
  public set isOptional(value: boolean) {
    this._isOptional = value;
  }

  public get isOptional(): boolean {
    return this._isOptional || false;
  }

  @Input()
  public parameterName: string;

  @Input()
  public parameterType: SkyDocsTypeDefinition;

  @ViewChild('templateRef', {
    read: TemplateRef,
    static: false
  })
  public templateRef: TemplateRef<any>;

  private _isOptional: boolean;

}
