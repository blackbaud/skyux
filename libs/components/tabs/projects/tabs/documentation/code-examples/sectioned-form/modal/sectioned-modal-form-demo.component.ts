import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  SkySectionedFormComponent
} from '@skyux/tabs';

@Component({
  selector: 'app-sectioned-modal-form-demo',
  templateUrl: './sectioned-modal-form-demo.component.html'
})
export class SectionedModalFormDemoComponent {

  public activeIndexDisplay: number = undefined;

  public activeTab = true;

  @ViewChild(SkySectionedFormComponent)
  public sectionedFormComponent: SkySectionedFormComponent;

  constructor(
    public modalInstance: SkyModalInstance
  ) { }

  public onIndexChanged(newIndex: number): void {
    this.activeIndexDisplay = newIndex;
  }

  public tabsHidden(): boolean {
    return !this.sectionedFormComponent?.tabsVisible();
  }

  public showTabs(): void {
    this.sectionedFormComponent.showTabs();
  }

}
