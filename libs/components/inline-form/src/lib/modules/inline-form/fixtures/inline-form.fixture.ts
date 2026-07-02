import { Component, input } from '@angular/core';

import { SkyInlineFormCloseArgs } from '../types/inline-form-close-args';
import { SkyInlineFormConfig } from '../types/inline-form-config';

@Component({
  selector: 'sky-inline-form-fixture',
  templateUrl: './inline-form.fixture.html',
  standalone: false,
})
export class SkyInlineFormFixtureComponent {
  public config = input<SkyInlineFormConfig | undefined>(undefined);

  public showForm = input<boolean>(false);

  public showFormWithAutocomplete = input<boolean>(false);

  public showFormWithOutAutocomplete = input<boolean>(false);

  public showFormWithHiddenElements = input<boolean>(false);

  public showFormWithNoElements = input<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onClose(event: SkyInlineFormCloseArgs): void {
    return;
  }
}
