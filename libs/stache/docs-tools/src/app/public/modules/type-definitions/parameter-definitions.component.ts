import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  TemplateRef
} from '@angular/core';

import {
  SkyDocsParameterDefinitionComponent
} from './parameter-definition.component';

import {
  SkyDocsTypeDefinitionsFormatService
} from './type-definitions-format.service';

interface SkyDocsParameterModel {
  defaultValue: string;
  isOptional: boolean;
  name: string;
  templateRef: TemplateRef<any>;
  type: string;
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

  constructor(
    private formatService: SkyDocsTypeDefinitionsFormatService
  ) { }

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
    return this.formatService.getParameterSignature(item);
  }
}
