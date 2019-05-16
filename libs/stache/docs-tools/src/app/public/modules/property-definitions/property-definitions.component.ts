import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  TemplateRef,
  ChangeDetectorRef
} from '@angular/core';

import {
  SkyPropertyDefinitionComponent
} from './property-definition.component';

@Component({
  selector: 'sky-property-definitions',
  templateUrl: './property-definitions.component.html',
  styleUrls: ['./property-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsPropertyDefinitionsComponent implements AfterContentInit {

  public data: {
    dataType: string;
    defaultValue: string;
    isRequired: boolean;
    propertyName: string;
    templateRef: TemplateRef<any>;
  }[] = [];

  @ContentChildren(SkyPropertyDefinitionComponent)
  private definitionRefs: QueryList<SkyPropertyDefinitionComponent>;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngAfterContentInit(): void {
    this.definitionRefs.forEach((definitionRef) => {
      this.data.push({
        dataType: definitionRef.dataType,
        defaultValue: definitionRef.defaultValue,
        isRequired: definitionRef.isRequired,
        propertyName: definitionRef.propertyName,
        templateRef: definitionRef.templateRef
      });
    });

    this.changeDetector.markForCheck();
  }

}
