import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig
} from '@skyux/inline-form';

import {
  SkyRepeaterComponent
} from '../repeater.component';

@Component({
  selector: 'sky-test-repeater-inline-form',
  templateUrl: './repeater-inline-form.component.fixture.html'
})
export class RepeaterInlineFormFixtureComponent {
  @ViewChild(SkyRepeaterComponent)
  public repeater: SkyRepeaterComponent;

  public showInlineForm = false;

  public inlineFormConfig: SkyInlineFormConfig;

  public inlineFormCloseArgs: SkyInlineFormCloseArgs;

  public onInlineFormClose(inlineFormCloseArgs: SkyInlineFormCloseArgs): void {
    this.inlineFormCloseArgs = inlineFormCloseArgs;
    this.showInlineForm = false;
  }
}
