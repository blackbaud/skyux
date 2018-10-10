import { ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'vertical-tabs-visual',
  templateUrl: './vertical-tabs-visual.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalTabsVisualComponent {
  public group1Open: boolean = true;
  public group1Disabled: boolean = false;

  public group2Open: boolean = false;
  public group2Disabled: boolean = false;

  public group3Open: boolean = false;
  public group3Disabled: boolean = true;

  public active: boolean = true;
  public tabDisabled: boolean = true;
}
