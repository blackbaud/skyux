import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';

import { SkyDocsCallSignatureDefinition } from './call-signature-definition';
import { SkyDocsClassMethodDefinition } from './method-definition';
import { SkyDocsTypeDefinitionsFormatService } from './type-definitions-format.service';

interface MethodViewModel {
  callSignature: SkyDocsCallSignatureDefinition;
  codeExample: string;
  codeExampleLanguage: string;
  deprecationWarning: string;
  description: string;
  formattedName: string;
  sourceCode: string;
}

@Component({
  selector: 'sky-docs-method-definitions',
  templateUrl: './method-definitions.component.html',
  styleUrls: ['./method-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsMethodDefinitionsComponent implements OnInit {
  @Input()
  public set config(value: { methods?: SkyDocsClassMethodDefinition[] }) {
    this._config = value;
    this.updateView();
  }

  public get config(): { methods?: SkyDocsClassMethodDefinition[] } {
    return this._config || {};
  }

  public deprecationWarningPrefix = `<span class="sky-text-warning"></span>**Deprecated.** `;

  public isMobile: boolean = true;

  public methods: MethodViewModel[];

  private _config: {
    methods?: SkyDocsClassMethodDefinition[];
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
    this.methods = this.config?.methods?.map((method) => {
      const vm: MethodViewModel = {
        callSignature: method.type.callSignature,
        codeExample: method.codeExample,
        codeExampleLanguage: method.codeExampleLanguage,
        deprecationWarning: method.deprecationWarning,
        description: method.description,
        formattedName: this.formatService.getFormattedMethodName(method),
        sourceCode: this.formatService.getMethodSourceCode(method),
      };

      return vm;
    });
  }
}
