import { AfterContentChecked, Component, ViewChild } from '@angular/core';

import { SkySectionedFormComponent } from '../sectioned-form.component';

@Component({
  selector: 'sky-sectioned-form-fixture',
  templateUrl: './sectioned-form.component.fixture.html',
})
export class SkySectionedFormFixtureComponent implements AfterContentChecked {
  @ViewChild(SkySectionedFormComponent)
  public sectionedForm: SkySectionedFormComponent | undefined;

  public activeTab = true;
  public activeIndexDisplay: number | undefined;
  public maintainSectionContent = false;

  #activeIndex: number | undefined;

  public ngAfterContentChecked(): void {
    this.activeIndexDisplay = this.#activeIndex;
  }

  public updateIndex(newIndex: number | undefined): void {
    this.#activeIndex = newIndex;
  }
}
