import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-character-count-demo',
  templateUrl: './character-count-demo.component.html',
})
export class CharacterCountDemoComponent {
  public characterCountForm: FormGroup;

  public description: FormControl;

  public maxDescriptionCharacterCount = 50;

  constructor(formBuilder: FormBuilder) {
    this.description = formBuilder.control(
      'Boys and Girls Club of South Carolina donation'
    );

    this.characterCountForm = formBuilder.group({
      description: this.description,
    });
  }
}
