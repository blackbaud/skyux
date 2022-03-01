import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { SkyCharacterCounterInputDirective } from '../character-counter.directive';

@Component({
  selector: 'sky-character-count-test',
  templateUrl: './character-count.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCountTestComponent implements OnInit {
  public testForm: FormGroup;
  public firstName: FormControl;
  public firstNameLabel = 'Field label';
  public maxCharacterCount = 5;

  @ViewChild(SkyCharacterCounterInputDirective)
  public inputDirective: SkyCharacterCounterInputDirective;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.firstName = this.formBuilder.control('test');

    this.testForm = this.formBuilder.group({
      firstName: this.firstName,
    });
  }

  public setCharacterCountLimit(limit: number): void {
    this.maxCharacterCount = limit;
    this.changeDetector.markForCheck();
  }
}
