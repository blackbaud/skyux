import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

@Component({
  selector: 'app-repeater-docs',
  templateUrl: './repeater-docs.component.html',
  styleUrls: ['./repeater-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepeaterDocsComponent {

  public demoSettings: any = {
    expandMode: 'single'
  };

  public items: any[] = [
    {
      title: 'Call Robert Hernandez',
      note: 'Robert recently gave a very generous gift.  We should call him to thank him.',
      selected: false,
      status: 'Completed'
    },
    {
      title: 'Send invitation to Spring Ball',
      note: 'The Spring Ball is coming up soon.  Let\'s get those invitations out!',
      selected: false,
      status: 'Past due'
    }
  ];

  public expandModeChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'none', label: 'None' },
    { value: 'single', label: 'Single' },
    { value: 'multiple', label: 'Multiple' }
  ];

  public expandMode: string = 'single';

  public reorderable: boolean = false;

  public selectable: boolean = false;

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.expandMode) {
      this.demoSettings.expandMode = change.expandMode;
    }
    if (change.reorderable !== undefined) {
      this.demoSettings.reorderable = change.reorderable;
    }
    if (change.selectable !== undefined) {
      this.demoSettings.selectable = change.selectable;
      this.items.forEach(item => item.selected = false);
    }
  }

}
