import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'character-count-visual',
  templateUrl: './character-count-visual.component.html'
})
export class CharacterCountVisualComponent implements OnInit {
  public characterCountForm: FormGroup;

  public firstName: FormControl;

  public firstNameLabel: string = 'Field label';

  public maxCharacterCount: number = 10;

  public nameValue: string = '';

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.firstName = this.formBuilder.control('John');

    this.characterCountForm = this.formBuilder.group({
      firstName: this.firstName
    });
  }
}
