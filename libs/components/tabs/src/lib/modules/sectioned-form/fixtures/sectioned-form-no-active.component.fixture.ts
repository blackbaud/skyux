import { Component, ViewChild } from '@angular/core';

import { SkySectionedFormComponent } from '../sectioned-form.component';

@Component({
  selector: 'sky-sectioned-form-no-active-fixture',
  templateUrl: './sectioned-form-no-active.component.fixture.html',
  standalone: false,
})
export class SkySectionedFormNoActiveFixtureComponent {
  public maintainSectionContent = false;

  @ViewChild(SkySectionedFormComponent)
  public sectionedForm: SkySectionedFormComponent | undefined;
}
