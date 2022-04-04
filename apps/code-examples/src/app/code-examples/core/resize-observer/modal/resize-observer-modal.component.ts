import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';
import { SkySectionedFormComponent } from '@skyux/tabs';

@Component({
  selector: 'app-resize-observer-modal',
  templateUrl: './resize-observer-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizeObserverModalComponent implements AfterViewInit {
  @ViewChild(SkySectionedFormComponent)
  public sectionedFormComponent: SkySectionedFormComponent;

  public tabsHidden = false;

  constructor(
    public instance: SkyModalInstance,
    public changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngAfterViewInit(): void {
    this.tabsHidden = !this.sectionedFormComponent.tabsVisible();
    if (this.tabsHidden) {
      this.changeDetectorRef.markForCheck();
    }
  }

  public showTabs(): void {
    this.sectionedFormComponent.showTabs();
  }
}
