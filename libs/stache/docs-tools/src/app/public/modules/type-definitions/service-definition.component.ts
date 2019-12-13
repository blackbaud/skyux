import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsMethodDefinition,
  SkyDocsServiceDefinition
} from './type-definitions';

import {
  SkyDocsTypeDefinitionsFormatService
} from './type-definitions-format.service';

@Component({
  selector: 'sky-docs-service-definition',
  templateUrl: './service-definition.component.html',
  styleUrls: ['./service-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsServiceDefinitionComponent {

  @Input()
  public config: SkyDocsServiceDefinition;

  constructor(
    private formatService: SkyDocsTypeDefinitionsFormatService
  ) { }

  public getMethodSignature(method: SkyDocsMethodDefinition): string {
    return this.formatService.getMethodSignature(method);
  }

}
