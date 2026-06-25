import { AfterContentChecked, Component, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';

import { SkySectionedFormComponent } from '../sectioned-form.component';
import { SkySectionedFormMessage } from '../types/sectioned-form-message';

@Component({
  selector: 'sky-sectioned-form-fixture',
  templateUrl: './sectioned-form.component.fixture.html',
  standalone: false,
})
export class SkySectionedFormFixtureComponent implements AfterContentChecked {
  @ViewChild(SkySectionedFormComponent)
  public sectionedForm: SkySectionedFormComponent | undefined;

  public activeTab = true;
  public activeIndexDisplay: number | undefined;
  public maintainSectionContent = false;
  public tabsVisible: boolean | undefined;
  public messageStream: Subject<SkySectionedFormMessage> | undefined =
    new Subject();

  #activeIndex: number | undefined;

  public ngAfterContentChecked(): void {
    this.activeIndexDisplay = this.#activeIndex;
  }

  public updateIndex(newIndex: number | undefined): void {
    this.#activeIndex = newIndex;
  }

  public tabsVisibleChanged(visible: boolean): void {
    this.tabsVisible = visible;
  }
}
