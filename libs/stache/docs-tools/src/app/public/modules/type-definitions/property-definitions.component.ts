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

import {
  SkyDocsAnchorLinkService
} from './anchor-link.service';

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
  public propertyType = 'Property';

  public properties: SkyDocsPropertyModel[] = [];

  @ContentChildren(SkyDocsPropertyDefinitionComponent)
  private definitionRefs: QueryList<SkyDocsPropertyDefinitionComponent>;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private anchorLinkService: SkyDocsAnchorLinkService
  ) { }

  public ngAfterContentInit(): void {
    this.definitionRefs.forEach((definitionRef) => {
      this.properties.push({
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

  public getPropertySignature(item: SkyDocsPropertyModel): string {
    let signature = '';

    signature += `${item.propertyName}`;

    if (item.isOptional) {
      signature += '?';
    }

    if (item.propertyType) {
      const propertyType = this.anchorLinkService.wrapWithAnchorLink(item.propertyType);

      signature += `: ${propertyType}`;
    }

    return signature;
  }

  public getDefaultValue(value: string): string {
    return this.anchorLinkService.wrapWithAnchorLink(value);
  }

}
