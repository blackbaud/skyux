import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkySectionedFormComponent, SkySectionedFormModule } from '@skyux/tabs';

@Component({
  selector: 'app-sectioned-form-modal-with-columns',
  templateUrl: './sectioned-form-modal-with-columns.component.html',
  styleUrl: './sectioned-form-modal-with-columns.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyFluidGridModule,
    SkyIconModule,
    SkyModalModule,
    SkySectionedFormModule,
  ],
})
export class SectionedFormModalWithColumnsComponent {
  public maintainSectionContent = false;
  public activeIndexDisplay: number | undefined;

  public activeTab = true;

  @ViewChild(SkySectionedFormComponent)
  public sectionedFormComponent: SkySectionedFormComponent | undefined;

  #changeDetector: ChangeDetectorRef;

  constructor(
    public modalInstance: SkyModalInstance,
    changeDetector: ChangeDetectorRef,
  ) {
    this.#changeDetector = changeDetector;
  }

  public onIndexChanged(newIndex: number): void {
    this.activeIndexDisplay = newIndex;
    this.#changeDetector.markForCheck();
  }

  public tabsHidden(): boolean {
    return !this.sectionedFormComponent?.tabsVisible();
  }

  public showTabs(): void {
    this.sectionedFormComponent?.showTabs();
  }
}
