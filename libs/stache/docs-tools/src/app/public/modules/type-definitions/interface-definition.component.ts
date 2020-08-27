import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsInterfaceDefinition
} from './interface-definition';

import {
  SkyDocsTypeDefinitionsFormatService
} from './type-definitions-format.service';

@Component({
  selector: 'sky-docs-interface-definition',
  templateUrl: './interface-definition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsInterfaceDefinitionComponent {

  @Input()
  public config: SkyDocsInterfaceDefinition;

  public get sourceCode(): string {
    return this.formatService.getInterfaceSignature(this.config, {
      createAnchorLinks: false
    });
  }

  constructor(
    private formatService: SkyDocsTypeDefinitionsFormatService
  ) { }

}
