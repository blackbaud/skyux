import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

import {
  SkyDocsTypeDefinitionsService
} from '../type-definitions/type-definitions.service';

import {
  SkyDocsTypeDefinitions
} from '../type-definitions/type-definitions';

@Component({
  selector: 'sky-docs-demo-page-type-definitions',
  templateUrl: './demo-page-type-definitions.component.html',
  styleUrls: ['./demo-page-type-definitions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoPageTypeDefinitionsComponent implements OnInit {

  @Input()
  public sourceCodeLocation: string;

  public types: SkyDocsTypeDefinitions;

  constructor(
    private typeDefinitionService: SkyDocsTypeDefinitionsService
  ) { }

  public ngOnInit(): void {
    if (!this.sourceCodeLocation) {
      throw 'Please provide a source code location! `<sky-docs-demo-page sourceCodeLocation="path/to/source">`';
    }

    this.types = this.typeDefinitionService.getTypeDefinitions(
      this.sourceCodeLocation
    );
  }
}
