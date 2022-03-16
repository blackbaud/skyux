import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SkyDocsInterfaceDefinition } from './interface-definition';
import { SkyDocsTypeDefinitionsFormatService } from './type-definitions-format.service';

@Component({
  selector: 'sky-docs-interface-definition',
  templateUrl: './interface-definition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsInterfaceDefinitionComponent {
  @Input()
  public set config(value: SkyDocsInterfaceDefinition) {
    this._config = value;
    this.updateView();
  }

  public get config(): SkyDocsInterfaceDefinition {
    return this._config;
  }

  public sourceCode: string;

  private _config: SkyDocsInterfaceDefinition;

  constructor(private formatService: SkyDocsTypeDefinitionsFormatService) {}

  private updateView(): void {
    this.sourceCode = this.config
      ? this.formatService.getInterfaceSourceCode(this.config)
      : undefined;
  }
}
