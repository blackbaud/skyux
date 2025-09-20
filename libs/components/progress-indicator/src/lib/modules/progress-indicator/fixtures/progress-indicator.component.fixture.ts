import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { Subject } from 'rxjs';

import { SkyProgressIndicatorItemComponent } from '../progress-indicator-item/progress-indicator-item.component';
import { SkyProgressIndicatorNavButtonComponent } from '../progress-indicator-nav-button/progress-indicator-nav-button.component';
import { SkyProgressIndicatorResetButtonComponent } from '../progress-indicator-reset-button/progress-indicator-reset-button.component';
import { SkyProgressIndicatorComponent } from '../progress-indicator.component';
import { SkyProgressIndicatorChange } from '../types/progress-indicator-change';
import { SkyProgressIndicatorDisplayModeType } from '../types/progress-indicator-display-mode-type';
import { SkyProgressIndicatorMessage } from '../types/progress-indicator-message';
import { SkyProgressIndicatorMessageType } from '../types/progress-indicator-message-type';
import { SkyProgressIndicatorNavButtonType } from '../types/progress-indicator-nav-button-type';

@Component({
  selector: 'sky-progress-indicator-fixture',
  templateUrl: './progress-indicator.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyProgressIndicatorFixtureComponent {
  @ViewChild(SkyProgressIndicatorComponent, {
    static: true,
  })
  public emptyProgressIndicator: SkyProgressIndicatorComponent | undefined;

  @ViewChild(SkyProgressIndicatorComponent, {
    static: true,
  })
  public progressIndicator: SkyProgressIndicatorComponent | undefined;

  @ViewChild('progressIndicator', {
    read: TemplateRef,
    static: true,
  })
  public progressIndicatorTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild(SkyProgressIndicatorResetButtonComponent, {
    static: true,
  })
  public resetButtonComponentLegacy:
    | SkyProgressIndicatorResetButtonComponent
    | undefined;

  @ViewChild('legacyResetButton', {
    read: ElementRef,
    static: false,
  })
  public legacyResetButton: ElementRef | undefined;

  @ViewChild('legacyIsolatedResetButton', {
    read: ElementRef,
    static: false,
  })
  public legacyIsolatedResetButton: ElementRef | undefined;

  @ViewChild('defaultNavButton', {
    read: SkyProgressIndicatorNavButtonComponent,
    static: false,
  })
  public defaultNavButtonComponent:
    | SkyProgressIndicatorNavButtonComponent
    | undefined;

  @ViewChild('defaultNavButton', {
    read: ElementRef,
    static: false,
  })
  public defaultNavButtonElement: ElementRef | undefined;

  @ViewChildren(SkyProgressIndicatorItemComponent)
  public progressItems:
    | QueryList<SkyProgressIndicatorItemComponent>
    | undefined;

  @ViewChildren(SkyProgressIndicatorNavButtonComponent)
  public navButtonComponents:
    | QueryList<SkyProgressIndicatorNavButtonComponent>
    | undefined;

  @ViewChildren(SkyProgressIndicatorNavButtonComponent, { read: ElementRef })
  public navButtonElements: QueryList<ElementRef> | undefined;

  // Progress indicator component inputs.
  public displayMode: SkyProgressIndicatorDisplayModeType | undefined;
  public isPassive: boolean | undefined;
  public messageStream:
    | Subject<SkyProgressIndicatorMessage | SkyProgressIndicatorMessageType>
    | undefined = new Subject();
  public startingIndex: number | undefined;

  // Nav button inputs.
  public disabled: boolean | undefined;

  // Template values.
  public buttonConfigs: {
    text?: string;
    type: SkyProgressIndicatorNavButtonType | undefined;
  }[];
  public defaultNavButtonProgressIndicatorRef:
    | SkyProgressIndicatorComponent
    | undefined;
  public lastChange: SkyProgressIndicatorChange | undefined;
  public showNavButtons = false;
  public showIsolatedLegacyResetButton = false;
  public progressIndicatorTemplateRefLegacy:
    | SkyProgressIndicatorComponent
    | undefined;
  public showFourthItem = false;

  public helpKey: string | undefined;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;

  #changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;

    this.buttonConfigs = [
      {
        type: 'finish',
      },
      {
        type: 'next',
      },
      {
        type: 'previous',
      },
      {
        type: 'reset',
      },
    ];
  }

  public onProgressChanges(change: SkyProgressIndicatorChange): void {
    this.lastChange = change;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onResetClick(): void {}

  public sendMessage(message: SkyProgressIndicatorMessage): void {
    this.messageStream?.next(message);
  }

  public sendMessageLegacy(type: SkyProgressIndicatorMessageType): void {
    this.messageStream?.next(type);
  }

  public setNavButtonText(): void {
    this.buttonConfigs = [
      {
        text: 'My Finish',
        type: 'finish',
      },
      {
        text: 'My Next',
        type: 'next',
      },
      {
        text: 'My Previous',
        type: 'previous',
      },
      {
        text: 'My Reset',
        type: 'reset',
      },
    ];
  }

  public displayFourthItem(): void {
    this.showFourthItem = true;
    this.#changeDetector.markForCheck();
  }

  public hideFourthItem(): void {
    this.showFourthItem = false;
    this.#changeDetector.markForCheck();
  }

  public updateHelpContent(content?: string): void {
    this.helpPopoverContent = content;
    this.#changeDetector.markForCheck();
  }
}
