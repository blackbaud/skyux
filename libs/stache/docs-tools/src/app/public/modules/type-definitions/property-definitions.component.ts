import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList
} from '@angular/core';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  SkyDocsAnchorLinkService
} from './anchor-link.service';

import {
  SkyDocsPropertyDefinitionComponent
} from './property-definition.component';

import {
  SkyDocsPropertyDefinition
} from './type-definitions';

import {
  SkyDocsTypeDefinitionsFormatService
} from './type-definitions-format.service';

@Component({
  selector: 'sky-docs-property-definitions',
  templateUrl: './property-definitions.component.html',
  styleUrls: ['./property-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsPropertyDefinitionsComponent implements OnInit, AfterContentInit {

  @Input()
  public propertyType = 'Property';

  public isMobile: boolean = true;

  public properties: SkyDocsPropertyDefinition[] = [];

  @ContentChildren(SkyDocsPropertyDefinitionComponent)
  private definitionRefs: QueryList<SkyDocsPropertyDefinitionComponent>;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private anchorLinkService: SkyDocsAnchorLinkService,
    private formatService: SkyDocsTypeDefinitionsFormatService,
    private mediaQueryService: SkyMediaQueryService
  ) { }

  public ngOnInit(): void {
    this.mediaQueryService.subscribe((breakpoints: SkyMediaBreakpoints) => {
      this.isMobile = (breakpoints <= SkyMediaBreakpoints.sm);
      this.changeDetector.markForCheck();
    });
  }

  public ngAfterContentInit(): void {
    this.definitionRefs.forEach((definitionRef) => {
      this.properties.push({
        type: definitionRef.propertyType,
        defaultValue: definitionRef.defaultValue,
        deprecationWarning: definitionRef.deprecationWarning,
        decorator: definitionRef.propertyDecorator,
        name: definitionRef.propertyName,
        templateRef: definitionRef.templateRef,
        isOptional: definitionRef.isOptional
      });
    });

    this.changeDetector.markForCheck();
  }

  public getPropertySignature(item: SkyDocsPropertyDefinition): string {
    return this.formatService.getPropertySignature(item);
  }

  public formatDefaultValue(value: string): string {
    return this.anchorLinkService.wrapWithAnchorLink(value);
  }

}
