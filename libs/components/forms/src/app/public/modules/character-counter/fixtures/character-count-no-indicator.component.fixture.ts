import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyCharacterCounterInputDirective
} from '../character-counter.directive';

@Component({
  selector: 'character-count-test',
  templateUrl: './character-count-no-indicator.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterCountNoIndicatorTestComponent implements OnInit {
  public testForm: FormGroup;
  public firstName: FormControl;
  public firstNameLabel: string = 'Field label';
  public maxCharacterCount: number = 5;

  @ViewChild(SkyCharacterCounterInputDirective)
  public inputDirective: SkyCharacterCounterInputDirective;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.firstName = this.formBuilder.control('test');

    this.testForm = this.formBuilder.group({
      firstName: this.firstName
    });

  }

  public setCharacterCountLimit(limit: number): void {
    this.maxCharacterCount = limit;
    this.changeDetector.markForCheck();
  }
}
