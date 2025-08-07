import { Component } from '@angular/core';

import { SkyInlineFormCloseArgs } from '../types/inline-form-close-args';
import { SkyInlineFormConfig } from '../types/inline-form-config';

@Component({
  selector: 'sky-inline-form-fixture',
  templateUrl: './inline-form.fixture.html',
  standalone: false,
})
export class SkyInlineFormFixtureComponent {
  public config: SkyInlineFormConfig | undefined;

  public showForm = false;

  public showFormWithAutocomplete = false;

  public showFormWithOutAutocomplete = false;

  public showFormWithHiddenElements = false;

  public showFormWithNoElements = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onClose(event: SkyInlineFormCloseArgs): void {
    return;
  }
}
