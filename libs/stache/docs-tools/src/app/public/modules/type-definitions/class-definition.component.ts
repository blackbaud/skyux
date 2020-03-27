import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  SkyDocsMethodDefinition
} from './method-definition';

import {
  SkyDocsClassDefinition
} from './class-definition';

import {
  SkyDocsTypeDefinitionsFormatService
} from './type-definitions-format.service';

@Component({
  selector: 'sky-docs-class-definition',
  templateUrl: './class-definition.component.html',
  styleUrls: ['./class-definition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsClassDefinitionComponent {

  @Input()
  public config: SkyDocsClassDefinition;

  constructor(
    private formatService: SkyDocsTypeDefinitionsFormatService
  ) { }

  public getMethodSignature(method: SkyDocsMethodDefinition): string {
    return this.formatService.getMethodSignature(method);
  }

}
