import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

@Component({
  selector: 'app-character-count-demo',
  templateUrl: './character-count-demo.component.html'
})
export class CharacterCountDemoComponent implements OnInit {

  public characterCountForm: FormGroup;

  public description: FormControl;

  public maxDescriptionCharacterCount = 50;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.description = this.formBuilder.control('Boys and Girls Club of South Carolina donation');

    this.characterCountForm = this.formBuilder.group({
      description: this.description
    });
  }

}
