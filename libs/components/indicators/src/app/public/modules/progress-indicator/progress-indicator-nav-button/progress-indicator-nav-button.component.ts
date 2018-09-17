import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyResourcesService
} from '../../resources/resources.service';

import {
  SkyProgressIndicatorComponent
} from '../progress-indicator.component';
import {
  SkyProgressIndicatorMessageType,
  SkyProgressIndicatorChange
} from '../types';

@Component({
  selector: 'sky-progress-indicator-nav-button',
  templateUrl: './progress-indicator-nav-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyProgressIndicatorNavButtonComponent implements OnInit, OnDestroy {
  @Input()
  public progressIndicator: SkyProgressIndicatorComponent;

  @Input()
  public get buttonText(): string {
    if (this._buttonText) {
      return this._buttonText;
    }

    if (this.buttonType === 'previous') {
      return this.resources.getString('wizard_navigator_previous');
    }

    return this.resources.getString('wizard_navigator_next');
  }
  public set buttonText(value: string) {
    this._buttonText = value;
  }

  @Input()
  public get buttonType(): string {
    return this._buttonType || 'next';
  }
  public set buttonType(value: string) {
    if (value && (value.toLowerCase() === 'next' || value.toLowerCase() === 'previous')) {
      this._buttonType = value;
    }
  }

  @Input()
  public get disabled(): boolean {
    if (this._disabled !== undefined) {
      return this._disabled;
    }

    if (this.buttonType === 'previous') {
      return this.activeIndex === 0;
    }

    return this.activeIndex >= this.progressIndicator.progressItems.length - 1;
  }
  public set disabled(value: boolean) {
    this._disabled = value;
  }

  private idle = new Subject();
  private _buttonText: string;
  private _buttonType: string;
  private _disabled: boolean;
  private activeIndex = 0;

  constructor(
    private resources: SkyResourcesService,
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.progressIndicator.progressChanges
    .takeUntil(this.idle)
    .subscribe((changes: SkyProgressIndicatorChange) => {
      this.activeIndex = changes.activeIndex;
      this.changeDetector.detectChanges();
    });
  }

  public ngOnDestroy(): void {
    this.idle.next();
    this.idle.unsubscribe();
  }

  public buttonClick(): void {
    if (this.buttonType === 'previous') {
      this.progressIndicator.messageStream.next(SkyProgressIndicatorMessageType.Regress);
    } else {
      this.progressIndicator.messageStream.next(SkyProgressIndicatorMessageType.Progress);
    }
  }
}
