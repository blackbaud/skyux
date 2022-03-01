import { AfterContentChecked, Component, ViewChild } from '@angular/core';

import { SkySectionedFormComponent } from '../sectioned-form.component';

@Component({
  selector: 'sky-sectioned-form-fixture',
  templateUrl: './sectioned-form.component.fixture.html',
})
export class SkySectionedFormFixtureComponent implements AfterContentChecked {
  @ViewChild(SkySectionedFormComponent)
  public sectionedForm: SkySectionedFormComponent;

  public activeTab = true;
  public activeIndexDisplay: number;
  public maintainSectionContent = false;

  private _activeIndex: number;

  public ngAfterContentChecked() {
    this.activeIndexDisplay = this._activeIndex;
  }

  public updateIndex(newIndex: number) {
    this._activeIndex = newIndex;
  }
}
