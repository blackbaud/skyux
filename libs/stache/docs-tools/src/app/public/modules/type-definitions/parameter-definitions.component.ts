import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ContentChildren,
  QueryList,
  AfterContentInit
} from '@angular/core';

import { SkyDocsParameterDefinitionComponent } from './parameter-definition.component';

export interface SkyDocsParameterModel {
  isOptional: boolean;
  name: string;
  type: string;
  defaultValue: string;
  templateRef: TemplateRef<any>;
}

@Component({
  selector: 'sky-docs-parameter-definitions',
  templateUrl: './parameter-definitions.component.html',
  styleUrls: ['./parameter-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsParameterDefinitionsComponent implements AfterContentInit {

  public parameters: SkyDocsParameterModel[];

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

  public getParameterSignature(item: SkyDocsParameterModel): string {
    let signature = `${item.name}`;

    if (item.isOptional) {
      signature += '?';
    }

    if (item.type) {
      signature += `: ${item.type}`;
    }

    return signature;
  }
}
