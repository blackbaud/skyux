import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';
import { SkySectionedFormComponent } from '@skyux/tabs';

@Component({
  selector: 'app-sectioned-form-modal-demo',
  templateUrl: './sectioned-form-modal-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionedFormModalDemoComponent {
  public activeIndexDisplay: number | undefined;

  public activeTab = true;

  @ViewChild(SkySectionedFormComponent)
  public sectionedFormComponent: SkySectionedFormComponent | undefined;

  constructor(
    public modalInstance: SkyModalInstance,
    private changeDetector: ChangeDetectorRef
  ) {}

  public onIndexChanged(newIndex: number): void {
    this.activeIndexDisplay = newIndex;
    this.changeDetector.markForCheck();
  }

  public tabsHidden(): boolean {
    return !this.sectionedFormComponent?.tabsVisible();
  }

  public showTabs(): void {
    this.sectionedFormComponent!.showTabs();
  }
}
