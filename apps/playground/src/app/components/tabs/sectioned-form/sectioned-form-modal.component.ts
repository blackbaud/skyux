import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sectioned-form-modal',
  templateUrl: './sectioned-form-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionedFormModalComponent {
  public maintainSectionContent = false;
}
