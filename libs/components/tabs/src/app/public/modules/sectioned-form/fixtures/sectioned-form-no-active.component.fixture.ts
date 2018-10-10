import { Component, ViewChild } from '@angular/core';
import { SkySectionedFormComponent } from '../sectioned-form.component';

@Component({
  selector: 'sky-sectioned-form-no-active-fixture',
  templateUrl: './sectioned-form-no-active.component.fixture.html'
})
export class SkySectionedFormNoActiveFixtureComponent {
  @ViewChild(SkySectionedFormComponent)
  public sectionedForm: SkySectionedFormComponent;
}
