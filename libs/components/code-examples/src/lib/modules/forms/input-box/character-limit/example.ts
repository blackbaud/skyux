import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';

/**
 * @title Input box with a character limit
 */
@Component({
  imports: [ReactiveFormsModule, SkyInputBoxModule],
  selector: 'app-forms-input-box-character-limit-example',
  templateUrl: './example.html',
})
export class FormsInputBoxCharacterLimitExample {
  protected readonly formGroup = inject(FormBuilder).group({
    nickname: 'Kelly',
    bio: 'Volunteer coordinator for the annual fundraising gala.',
  });
}
