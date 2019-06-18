import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  OnInit
} from '@angular/core';

@Component({
  selector: 'sky-docs-method-definition',
  templateUrl: './method-definition.component.html',
  styleUrls: ['./method-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsMethodDefinitionComponent implements OnInit {

  @Input()
  public methodName: string;

  @Input()
  public returnType = 'void';

  @Input()
  public parameters: {
    description: string;
    name: string;
    type: string;
    isOptional: boolean;
    defaultValue: string;
    templateRef: TemplateRef<any>
  }[];

  @Input()
  public deprecationWarning: string;

  @Input()
  public codeExample: string;

  @Input()
  public codeExampleLanguage: string;

  public parametersConfig: any[] = [];

  public ngOnInit(): void {
    this.parametersConfig = this.parameters.filter((parameter) => {
      return (!parameter.description);
    });
  }

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
