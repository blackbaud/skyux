import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  TemplateRef
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyProgressIndicatorItemComponent
} from '../progress-indicator-item/progress-indicator-item.component';

import {
  SkyProgressIndicatorNavButtonComponent
} from '../progress-indicator-nav-button/progress-indicator-nav-button.component';

import {
  SkyProgressIndicatorResetButtonComponent
} from '../progress-indicator-reset-button/progress-indicator-reset-button.component';

import {
  SkyProgressIndicatorDisplayMode,
  SkyProgressIndicatorMessage,
  SkyProgressIndicatorMessageType,
  SkyProgressIndicatorNavButtonType,
  SkyProgressIndicatorChange
} from '../types';

import {
  SkyProgressIndicatorComponent
} from '../progress-indicator.component';

@Component({
  selector: 'sky-progress-indicator-fixture',
  templateUrl: './progress-indicator.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyProgressIndicatorFixtureComponent {

  @ViewChild(SkyProgressIndicatorComponent)
  public emptyProgressIndicator: SkyProgressIndicatorComponent;

  @ViewChild(SkyProgressIndicatorComponent)
  public progressIndicator: SkyProgressIndicatorComponent;

  @ViewChild('progressIndicator', { read: TemplateRef })
  public progressIndicatorTemplateRef: TemplateRef<any>;

  @ViewChild(SkyProgressIndicatorResetButtonComponent)
  public resetButtonComponentLegacy: SkyProgressIndicatorResetButtonComponent;

  @ViewChild('legacyResetButton', { read: ElementRef })
  public legacyResetButton: ElementRef;

  @ViewChild('legacyIsolatedResetButton', { read: ElementRef })
  public legacyIsolatedResetButton: ElementRef;

  @ViewChild('defaultNavButton', { read: SkyProgressIndicatorNavButtonComponent })
  public defaultNavButtonComponent: SkyProgressIndicatorNavButtonComponent;

  @ViewChild('defaultNavButton', { read: ElementRef })
  public defaultNavButtonElement: ElementRef;

  @ViewChildren(SkyProgressIndicatorItemComponent)
  public progressItems: QueryList<SkyProgressIndicatorItemComponent>;

  @ViewChildren(SkyProgressIndicatorNavButtonComponent)
  public navButtonComponents: QueryList<SkyProgressIndicatorNavButtonComponent>;

  @ViewChildren(SkyProgressIndicatorNavButtonComponent, { read: ElementRef })
  public navButtonElements: QueryList<ElementRef>;

  // Progress indicator component inputs.
  public displayMode: SkyProgressIndicatorDisplayMode;
  public isPassive: boolean;
  public messageStream = new Subject<SkyProgressIndicatorMessage | SkyProgressIndicatorMessageType>();
  public startingIndex: number;

  // Nav button inputs.
  public disabled: boolean;

  // Template values.
  public buttonConfigs: {
    text?: string;
    type: SkyProgressIndicatorNavButtonType;
  }[];
  public defaultNavButtonProgressIndicatorRef: SkyProgressIndicatorComponent;
  public lastChange: SkyProgressIndicatorChange;
  public showNavButtons = false;
  public showIsolatedLegacyResetButton = false;
  public progressIndicatorTemplateRefLegacy: SkyProgressIndicatorComponent;

  constructor() {
    this.buttonConfigs = [
      {
        type: 'finish'
      },
      {
        type: 'next'
      },
      {
        type: 'previous'
      },
      {
        type: 'reset'
      }
    ];
  }

  public onProgressChanges(change: SkyProgressIndicatorChange): void {
    this.lastChange = change;
  }

  public onResetClick(): void { }

  public sendMessage(message: SkyProgressIndicatorMessage): void {
    this.messageStream.next(message);
  }

  public sendMessageLegacy(type: SkyProgressIndicatorMessageType): void {
    this.messageStream.next(type);
  }

  public setNavButtonText(): void {
    this.buttonConfigs = [
      {
        text: 'My Finish',
        type: 'finish'
      },
      {
        text: 'My Next',
        type: 'next'
      },
      {
        text: 'My Previous',
        type: 'previous'
      },
      {
        text: 'My Reset',
        type: 'reset'
      }
    ];
  }
}
