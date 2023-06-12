import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';
import { SkySectionedFormComponent } from '@skyux/tabs';

@Component({
  selector: 'app-sectioned-form-modal',
  templateUrl: './sectioned-form-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionedFormModalComponent {
  @ViewChild('sectionedFormComponent', { static: true })
  public sectionedFormComponent: SkySectionedFormComponent | undefined;

  public maintainSectionContent = false;

  public readonly modal = inject(SkyModalInstance);

  public tabsHidden(): boolean {
    return !this.sectionedFormComponent?.tabsVisible();
  }

  public showTabs(): void {
    this.sectionedFormComponent?.showTabs();
  }
}
