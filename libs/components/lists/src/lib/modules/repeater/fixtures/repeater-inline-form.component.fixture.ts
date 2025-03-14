import { Component, ViewChild } from '@angular/core';
import {
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig,
} from '@skyux/inline-form';

import { SkyRepeaterComponent } from '../repeater.component';

@Component({
  selector: 'sky-test-repeater-inline-form',
  templateUrl: './repeater-inline-form.component.fixture.html',
  standalone: false,
})
export class RepeaterInlineFormFixtureComponent {
  @ViewChild(SkyRepeaterComponent, {
    read: SkyRepeaterComponent,
    static: true,
  })
  public repeater: SkyRepeaterComponent | undefined;

  public showInlineForm = false;

  public inlineFormConfig: SkyInlineFormConfig | undefined;

  public inlineFormCloseArgs: SkyInlineFormCloseArgs | undefined;

  public onInlineFormClose(inlineFormCloseArgs: SkyInlineFormCloseArgs): void {
    this.inlineFormCloseArgs = inlineFormCloseArgs;
    this.showInlineForm = false;
  }
}
