import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';

import { SkyDocsCallSignatureDefinition } from './call-signature-definition';
import { SkyDocsClassPropertyDefinition } from './property-definition';
import { SkyDocsTypeDefinitionsFormatService } from './type-definitions-format.service';

interface PropertyViewModel {
  callSignature: SkyDocsCallSignatureDefinition;
  defaultValue: string;
  deprecationWarning: string;
  description: string;
  formattedName: string;
  isOptional: boolean;
}

@Component({
  selector: 'sky-docs-property-definitions',
  templateUrl: './property-definitions.component.html',
  styleUrls: ['./property-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsPropertyDefinitionsComponent implements OnInit {
  @Input()
  public set config(value: { properties?: SkyDocsClassPropertyDefinition[] }) {
    this._config = value;
    this.updateView();
  }

  public get config(): { properties?: SkyDocsClassPropertyDefinition[] } {
    return this._config || {};
  }

  @Input()
  public propertyType = 'Property';

  @Input()
  public showOptionalStatus: boolean = true;

  public deprecationWarningPrefix = `<span class="sky-text-warning"></span>**Deprecated.** `;

  public isMobile: boolean = true;

  public properties: PropertyViewModel[] = [];

  private _config: {
    properties?: SkyDocsClassPropertyDefinition[];
  };

  constructor(
    private changeDetector: ChangeDetectorRef,
    private formatService: SkyDocsTypeDefinitionsFormatService,
    private mediaQueryService: SkyMediaQueryService
  ) {}

  public ngOnInit(): void {
    this.mediaQueryService.subscribe((breakpoints: SkyMediaBreakpoints) => {
      this.isMobile = breakpoints <= SkyMediaBreakpoints.sm;
      this.changeDetector.markForCheck();
    });
  }

  private updateView(): void {
    this.properties = this.config?.properties?.map((property) => {
      const vm: PropertyViewModel = {
        callSignature: property.type?.callSignature,
        defaultValue: this.formatService.escapeSpecialCharacters(
          property.defaultValue || ''
        ),
        deprecationWarning: property.deprecationWarning,
        description: property.description,
        formattedName: this.formatService.getFormattedPropertyName(property),
        isOptional: property.isOptional,
      };

      return vm;
    });
  }
}
