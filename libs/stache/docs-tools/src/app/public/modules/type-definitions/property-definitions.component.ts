import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  TemplateRef,
  QueryList,
  Input
} from '@angular/core';

import {
  SkyDocsPropertyDefinitionComponent
} from './property-definition.component';

export interface SkyDocsPropertyModel {
  defaultValue: string;
  deprecationWarning: string;
  description?: string;
  isOptional: boolean;
  propertyDecorator: 'Input' | 'Output';
  propertyName: string;
  propertyType: string;
  templateRef: TemplateRef<any>;
}

@Component({
  selector: 'sky-docs-property-definitions',
  templateUrl: './property-definitions.component.html',
  styleUrls: ['./property-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsPropertyDefinitionsComponent implements AfterContentInit {

  @Input()
  public nameHeadingText = 'Name';

  public data: SkyDocsPropertyModel[] = [];

  @ContentChildren(SkyDocsPropertyDefinitionComponent)
  private definitionRefs: QueryList<SkyDocsPropertyDefinitionComponent>;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngAfterContentInit(): void {
    this.definitionRefs.forEach((definitionRef) => {
      this.data.push({
        propertyType: definitionRef.propertyType,
        defaultValue: definitionRef.defaultValue,
        deprecationWarning: definitionRef.deprecationWarning,
        propertyDecorator: definitionRef.propertyDecorator,
        propertyName: definitionRef.propertyName,
        templateRef: definitionRef.templateRef,
        isOptional: definitionRef.isOptional
      });
    });

    this.changeDetector.markForCheck();
  }

  public getPropertySignature(item: any): string {
    let signature = '';

    signature += `${item.propertyName}`;

    if (item.isOptional) {
      signature += '?';
    }

    if (item.propertyType) {
      signature += `: ${item.propertyType}`;
    }

    return signature;
  }

}
