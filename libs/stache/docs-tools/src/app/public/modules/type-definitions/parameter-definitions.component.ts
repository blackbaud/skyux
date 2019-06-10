import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ContentChildren,
  QueryList,
  AfterContentInit
} from '@angular/core';

import { SkyDocsParameterDefinitionComponent } from './parameter-definition.component';

@Component({
  selector: 'sky-docs-parameter-definitions',
  templateUrl: './parameter-definitions.component.html',
  styleUrls: ['./parameter-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsParameterDefinitionsComponent implements AfterContentInit {

  public parameters: {
    isOptional: boolean;
    name: string;
    type: string;
    defaultValue: string;
    templateRef: TemplateRef<any>
  }[];

  @ContentChildren(SkyDocsParameterDefinitionComponent)
  private parameterComponents: QueryList<SkyDocsParameterDefinitionComponent>;

  /**
   * @internal
   */
  public ngAfterContentInit(): void {
    this.parameters = this.parameterComponents.map((parameterComponent) => {
      return {
        isOptional: parameterComponent.isOptional,
        name: parameterComponent.parameterName,
        type: parameterComponent.parameterType,
        defaultValue: parameterComponent.defaultValue,
        templateRef: parameterComponent.templateRef
      };
    });
  }
}
