import { Component, inject, input } from '@angular/core';
import {
  SkyDocsTypeDefinitionAnchorIdsService,
  SkyDocsTypeDefinitionModule,
} from '@skyux/docs-tools';
import type { SkyManifestDocumentationTypeDefinition } from '@skyux/manifest';

import { ANCHOR_IDS } from './type-definition-fixtures';

@Component({
  imports: [SkyDocsTypeDefinitionModule],
  providers: [SkyDocsTypeDefinitionAnchorIdsService],
  selector: 'app-type-definition',
  templateUrl: './type-definition.component.html',
  styleUrls: ['./type-definition.component.scss'],
})
export class TypeDefinitionComponent {
  public readonly definitions = input<SkyManifestDocumentationTypeDefinition[]>(
    [],
  );

  constructor() {
    inject(SkyDocsTypeDefinitionAnchorIdsService).updateAnchorIds(ANCHOR_IDS);
  }
}
