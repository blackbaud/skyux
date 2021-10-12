import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  SkyDocsTypeDefinitionsService
} from '../type-definitions/type-definitions.service';

import {
  SkyDocsTypeDefinitions
} from '../type-definitions/type-definitions';

/**
 * @internal
 */
@Component({
  selector: 'sky-docs-demo-page-type-definitions',
  templateUrl: './demo-page-type-definitions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoPageTypeDefinitionsComponent implements OnInit {

  @Input()
  public moduleSourceCodePath: string;

  public types: SkyDocsTypeDefinitions;

  constructor(
    private typeDefinitionService: SkyDocsTypeDefinitionsService
  ) { }

  public ngOnInit(): void {
    if (this.moduleSourceCodePath) {
      this.types = this.typeDefinitionService.getTypeDefinitions(
        this.moduleSourceCodePath
      );
    }
  }
}
