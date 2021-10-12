import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsCallSignatureDefinition
} from './call-signature-definition';

import {
  SkyDocsTypeDefinitionsFormatService
} from './type-definitions-format.service';

interface ParameterViewModel {
  defaultValue: string;
  description: string;
  formattedName: string;
  isOptional: boolean;
}

/**
 * "Call signatures" include methods, functions, and inline arrow functions.
 * This component is used to document both the return type and parameters of a given call signature.
 */
@Component({
  selector: 'sky-docs-call-signature-definition',
  templateUrl: './call-signature-definition.component.html',
  styleUrls: ['./call-signature-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsCallSignatureDefinitionComponent {

  @Input()
  public set config(value: SkyDocsCallSignatureDefinition) {
    this._config = value;
    this.updateView();
  }

  public get config(): SkyDocsCallSignatureDefinition {
    return this._config;
  }

  public parameters: ParameterViewModel[];

  public returnTypeFormatted: string;

  private _config: SkyDocsCallSignatureDefinition;

  constructor(
    private formatService: SkyDocsTypeDefinitionsFormatService
  ) { }

  private updateView(): void {
    this.parameters = this.config?.parameters?.map(p => {
      const vm: ParameterViewModel = {
        defaultValue: p.defaultValue,
        description: p.description,
        formattedName: this.formatService.getFormattedParameterName(p),
        isOptional: p.isOptional
      };

      return vm;
    });

    this.returnTypeFormatted = this.formatService.getFormattedType(this.config?.returnType);
  }

}
