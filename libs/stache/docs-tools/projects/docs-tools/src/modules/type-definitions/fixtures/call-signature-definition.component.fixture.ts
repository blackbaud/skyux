import { Component, ViewChild } from '@angular/core';

import { SkyDocsCallSignatureDefinition } from '../call-signature-definition';

import { SkyDocsCallSignatureDefinitionComponent } from '../call-signature-definition.component';

@Component({
  selector: 'sky-call-signature-definition-test',
  templateUrl: './call-signature-definition.component.fixture.html',
})
export class CallSignatureDefinitionFixtureComponent {
  public config: SkyDocsCallSignatureDefinition;

  @ViewChild(SkyDocsCallSignatureDefinitionComponent)
  public callSignatureDefinitionRef: SkyDocsCallSignatureDefinitionComponent;
}
