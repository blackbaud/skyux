import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Input,
  TemplateRef
} from '@angular/core';

import {
  SkyDocsMethodDefinitionParameterComponent
} from './method-definition-parameter.component';

@Component({
  selector: 'sky-docs-method-definition',
  templateUrl: './method-definition.component.html',
  styleUrls: ['./method-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsMethodDefinitionComponent implements AfterContentInit {

  @Input()
  public methodName: string;

  @Input()
  public returnType = 'void';

  public parameters: {
    name: string;
    type: string;
    defaultValue: string;
    templateRef: TemplateRef<any>
  }[];

  /**
   * @internal
   */
  public get methodSignature(): string {
    let signature = `public ${this.methodName}(`;

    if (this.parameters.length) {
      const parameters: string[] = [];

      this.parameters.forEach((parameter) => {
        const optionalMarker = (parameter.defaultValue) ? '?' : '';

        parameters.push(
          `${parameter.name}${optionalMarker}: ${parameter.type}`
        );
      });

      signature += parameters.join(', ');
    }

    signature += `): ${this.returnType}`;

    return signature;
  }

  @ContentChildren(SkyDocsMethodDefinitionParameterComponent)
  private parameterComponents: QueryList<SkyDocsMethodDefinitionParameterComponent>;

  /**
   * @internal
   */
  public ngAfterContentInit(): void {
    this.parameters = this.parameterComponents.map((parameterComponent) => {
      return {
        name: parameterComponent.parameterName,
        type: parameterComponent.parameterType,
        defaultValue: parameterComponent.defaultValue,
        templateRef: parameterComponent.templateRef
      };
    });
  }

}
