import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sectioned-form-visual',
  templateUrl: './sectioned-form-visual.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionedFormVisualComponent {
  public maintainSectionContent: boolean = false;
}
