import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef
} from '@angular/core';

@Component({
  selector: 'sky-docs-method-definition',
  templateUrl: './method-definition.component.html',
  styleUrls: ['./method-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsMethodDefinitionComponent {

  @Input()
  public methodName: string;

  @Input()
  public returnType = 'void';

  @Input()
  public parameters: {
    name: string;
    type: string;
    isOptional: boolean;
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
        const optionalMarker = (parameter.defaultValue || parameter.isOptional) ? '?' : '';

        parameters.push(
          `${parameter.name}${optionalMarker}: ${parameter.type}`
        );
      });

      signature += parameters.join(', ');
    }

    signature += `): ${this.returnType}`;

    return signature;
  }

}
