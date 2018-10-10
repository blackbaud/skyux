import { Component, ViewChild, AfterContentChecked } from '@angular/core';
import { SkySectionedFormComponent } from '../sectioned-form.component';

@Component({
  selector: 'sky-sectioned-form-fixture',
  templateUrl: './sectioned-form.component.fixture.html'
})
export class SkySectionedFormFixtureComponent implements AfterContentChecked {

  @ViewChild(SkySectionedFormComponent)
  public sectionedForm: SkySectionedFormComponent;

  public activeTab: boolean = true;
  public activeIndexDisplay: number;

  private _activeIndex: number;

  public ngAfterContentChecked() {
    this.activeIndexDisplay = this._activeIndex;
  }

  public updateIndex(newIndex: number) {
    this._activeIndex = newIndex;
  }
}
