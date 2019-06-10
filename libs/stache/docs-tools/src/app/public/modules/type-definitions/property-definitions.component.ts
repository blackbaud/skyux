import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  SkyDocsPropertyDefinitionComponent
} from './property-definition.component';

import {
  SkyPropertyDefinition
} from './property-definition';

@Component({
  selector: 'sky-docs-property-definitions',
  templateUrl: './property-definitions.component.html',
  styleUrls: ['./property-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsPropertyDefinitionsComponent implements AfterContentInit {

  public data: SkyPropertyDefinition[] = [];

  @ContentChildren(SkyDocsPropertyDefinitionComponent)
  private definitionRefs: QueryList<SkyDocsPropertyDefinitionComponent>;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngAfterContentInit(): void {
    this.definitionRefs.forEach((definitionRef) => {
      // const isRequired = (
      //   definitionRef.defaultValue === undefined
      // );

      this.data.push({
        propertyType: definitionRef.propertyType,
        defaultValue: definitionRef.defaultValue,
        deprecationWarning: definitionRef.deprecationWarning,
        // isRequired,
        propertyDecorator: definitionRef.propertyDecorator,
        propertyName: definitionRef.propertyName,
        templateRef: definitionRef.templateRef,
        isOptional: definitionRef.isOptional
      });
    });

    this.changeDetector.markForCheck();
  }

  /**
   * @internal
   */
  public getPropertySignature(item: SkyPropertyDefinition): string {
    let signature = '';

    if (item.propertyDecorator) {
      signature += `@${item.propertyDecorator}()<br>`;
    }

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
