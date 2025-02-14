import { Component, ViewChild } from '@angular/core';

import { SkySectionedFormComponent } from '../sectioned-form.component';

@Component({
  selector: 'sky-sectioned-form-no-sections-fixture',
  templateUrl: './sectioned-form-no-sections.component.fixture.html',
  standalone: false,
})
export class SkySectionedFormNoSectionsFixtureComponent {
  public maintainSectionContent = false;

  @ViewChild(SkySectionedFormComponent)
  public sectionedForm: SkySectionedFormComponent | undefined;
}
