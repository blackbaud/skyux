import {
  fakeAsync,
  TestBed,
  ComponentFixture,
  tick,
  async
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyProgressIndicatorFixtureComponent
} from './fixtures/progress-indicator.component.fixture';

import {
  SkyProgressIndicatorFixtureModule
} from './fixtures/progress-indicator.module.fixture';

import {
  SkyProgressIndicatorDisplayMode,
  SkyProgressIndicatorMessageType
} from './types';

describe('Progress indicator component', function () {

  let fixture: ComponentFixture<SkyProgressIndicatorFixtureComponent>;
  let componentInstance: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyProgressIndicatorFixtureModule
      ]
    });

    fixture = TestBed.createComponent(SkyProgressIndicatorFixtureComponent);
  });

  it('should not run the progressChanges emitter until a tick has occurred.', fakeAsync(() => {
    fixture.detectChanges();
    expect(fixture.componentInstance.progressChangesEmitted).toBeFalsy();
    tick();
    expect(fixture.componentInstance.progressChangesEmitted).toBeTruthy();
  }));

  it('should use horizontal display if set', fakeAsync(() => {
    fixture.componentInstance.displayMode = SkyProgressIndicatorDisplayMode.Horizontal;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    componentInstance = fixture.componentInstance.progressIndicator;
    let element = fixture.nativeElement;

    expect(componentInstance.isHorizontal).toBeTruthy();
    for (let item of componentInstance.progressItems.toArray()) {
      expect(item.isHorizontal).toBeTruthy();
    }

    expect(element.querySelector('.sky-progress-indicator-display')).toBeTruthy();
    expect(element.querySelector('.sky-progress-indicator-item-step')).toBeFalsy();
  }));

  it('should use passive mode if set', fakeAsync(() => {
    fixture.componentInstance.isPassive = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    componentInstance = fixture.componentInstance.progressIndicator;

    expect(componentInstance.isPassive).toBeTruthy();
    for (let item of componentInstance.progressItems.toArray()) {
      expect(item.isPassive).toBeTruthy();
    }
  }));

  // May be removed in the future if support is added
  it('should not use passive mode if set for horizontal display', fakeAsync(() => {
    fixture.componentInstance.displayMode = SkyProgressIndicatorDisplayMode.Horizontal;
    fixture.componentInstance.isPassive = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    componentInstance = fixture.componentInstance.progressIndicator;

    expect(componentInstance.isPassive).toBeFalsy();
    for (let item of componentInstance.progressItems.toArray()) {
      expect(item.isPassive).toBeFalsy();
    }
  }));

  it('should use starting index if set', fakeAsync(() => {
    fixture.componentInstance.startingIndex = 2;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    componentInstance = fixture.componentInstance.progressIndicator;
    let itemArr = componentInstance.progressItems.toArray();

    expect(componentInstance.activeIndex).toBe(2);
    expect(itemArr[0].isComplete).toBeTruthy();
    expect(itemArr[0].isActive).toBeFalsy();

    expect(itemArr[1].isComplete).toBeTruthy();
    expect(itemArr[1].isActive).toBeFalsy();

    expect(itemArr[2].isComplete).toBeFalsy();
    expect(itemArr[2].isActive).toBeTruthy();
  }));

  describe('standard setup', () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();
      componentInstance = fixture.componentInstance.progressIndicator;
    }));

    it('should use vertical display by default', fakeAsync(() => {
      let element = fixture.nativeElement;

      expect(componentInstance.isHorizontal).toBeFalsy();
      for (let item of componentInstance.progressItems.toArray()) {
        expect(item.isHorizontal).toBeFalsy();
      }

      expect(element.querySelector('.sky-progress-indicator-display')).toBeFalsy();
      expect(element.querySelector('.sky-progress-indicator-item-step')).toBeTruthy();
    }));

    it('should not use passive mode by default', fakeAsync(() => {
      expect(componentInstance.isPassive).toBeFalsy();
      for (let item of componentInstance.progressItems.toArray()) {
        expect(item.isPassive).toBeFalsy();
      }
    }));

    it('should set item numbers', () => {
      componentInstance.progressItems.forEach((item: any, index: number) => {
        expect(item.itemNumber).toBe(index + 1);
      });
    });

    it('should advance progress and complete current item when a complete message is received.', () => {
      expect(componentInstance.activeIndex).toBe(0);
      expect(componentInstance.progressItems.first.isActive).toBeTruthy();
      expect(componentInstance.progressItems.first.isComplete).toBeFalsy();

      componentInstance.sendMessage(SkyProgressIndicatorMessageType.Progress);
      fixture.detectChanges();

      expect(componentInstance.activeIndex).toBe(1);
      expect(componentInstance.progressItems.first.isActive).toBeFalsy();
      expect(componentInstance.progressItems.first.isComplete).toBeTruthy();
      expect(componentInstance.progressItems.first.isNextToInactive).toBeFalsy();

      expect(componentInstance.progressItems.toArray()[1].isActive).toBeTruthy();
      expect(componentInstance.progressItems.toArray()[1].isComplete).toBeFalsy();
    });

    it('should not advance once past the final step', () => {
      componentInstance.sendMessage(SkyProgressIndicatorMessageType.Progress);
      fixture.detectChanges();
      componentInstance.sendMessage(SkyProgressIndicatorMessageType.Progress);
      fixture.detectChanges();
      componentInstance.sendMessage(SkyProgressIndicatorMessageType.Progress);
      fixture.detectChanges();

      expect(componentInstance.activeIndex).toBe(2);
      expect(componentInstance.progressItems.last.isActive).toBeTruthy();
      expect(componentInstance.progressItems.last.isComplete).toBeTruthy();

      componentInstance.sendMessage(SkyProgressIndicatorMessageType.Progress);
      fixture.detectChanges();

      expect(componentInstance.activeIndex).toBe(2);
    });

    it('should not regress when on the first step', () => {
      expect(componentInstance.activeIndex).toBe(0);
      expect(componentInstance.progressItems.first.isActive).toBeTruthy();
      expect(componentInstance.progressItems.first.isComplete).toBeFalsy();

      componentInstance.sendMessage(SkyProgressIndicatorMessageType.Regress);
      fixture.detectChanges();

      expect(componentInstance.activeIndex).toBe(0);
      expect(componentInstance.progressItems.first.isActive).toBeTruthy();
      expect(componentInstance.progressItems.first.isComplete).toBeFalsy();
    });

    it('should leave completed tasks marked as such when regressing progress', () => {
      componentInstance.sendMessage(SkyProgressIndicatorMessageType.Progress);
      fixture.detectChanges();
      componentInstance.sendMessage(SkyProgressIndicatorMessageType.Progress);
      fixture.detectChanges();

      expect(componentInstance.progressItems.first.isComplete).toBeTruthy();
      expect(componentInstance.progressItems.first.isActive).toBeFalsy();
      expect(componentInstance.progressItems.first.isNextToInactive).toBeFalsy();

      expect(componentInstance.progressItems.toArray()[1].isComplete).toBeTruthy();
      expect(componentInstance.progressItems.toArray()[1].isActive).toBeFalsy();
      expect(componentInstance.progressItems.first.isNextToInactive).toBeFalsy();

      expect(componentInstance.progressItems.last.isComplete).toBeFalsy();
      expect(componentInstance.progressItems.last.isActive).toBeTruthy();

      componentInstance.sendMessage(SkyProgressIndicatorMessageType.Regress);
      fixture.detectChanges();
      componentInstance.sendMessage(SkyProgressIndicatorMessageType.Regress);
      fixture.detectChanges();

      expect(componentInstance.progressItems.first.isComplete).toBeTruthy();
      expect(componentInstance.progressItems.first.isActive).toBeTruthy();
      expect(componentInstance.progressItems.first.isNextToInactive).toBeFalsy();

      expect(componentInstance.progressItems.toArray()[1].isComplete).toBeTruthy();
      expect(componentInstance.progressItems.toArray()[1].isActive).toBeFalsy();
      expect(componentInstance.progressItems.toArray()[1].isNextToInactive).toBeTruthy();

      expect(componentInstance.progressItems.last.isComplete).toBeFalsy();
      expect(componentInstance.progressItems.last.isActive).toBeFalsy();
    });

    it('should reset progress when a reset progress message is passed', () => {
      componentInstance.sendMessage(SkyProgressIndicatorMessageType.Progress);
      fixture.detectChanges();
      componentInstance.sendMessage(SkyProgressIndicatorMessageType.Progress);
      fixture.detectChanges();

      expect(componentInstance.progressItems.first.isComplete).toBeTruthy();
      expect(componentInstance.progressItems.first.isActive).toBeFalsy();
      expect(componentInstance.progressItems.first.isNextToInactive).toBeFalsy();

      expect(componentInstance.progressItems.toArray()[1].isComplete).toBeTruthy();
      expect(componentInstance.progressItems.toArray()[1].isActive).toBeFalsy();
      expect(componentInstance.progressItems.first.isNextToInactive).toBeFalsy();

      expect(componentInstance.progressItems.last.isComplete).toBeFalsy();
      expect(componentInstance.progressItems.last.isActive).toBeTruthy();

      componentInstance.sendMessage(SkyProgressIndicatorMessageType.Reset);
      fixture.detectChanges();

      expect(componentInstance.progressItems.first.isComplete).toBeFalsy();
      expect(componentInstance.progressItems.first.isActive).toBeTruthy();
      expect(componentInstance.progressItems.first.isNextToInactive).toBeTruthy();

      expect(componentInstance.progressItems.toArray()[1].isComplete).toBeFalsy();
      expect(componentInstance.progressItems.toArray()[1].isActive).toBeFalsy();
      expect(componentInstance.progressItems.first.isNextToInactive).toBeTruthy();

      expect(componentInstance.progressItems.last.isComplete).toBeFalsy();
      expect(componentInstance.progressItems.last.isActive).toBeFalsy();
    });

    it('should throw an error when an unknown message is passed', () => {
      try {
        componentInstance.sendMessage(4);
        fail('Should have thrown an exception.');
      } catch (e) {
        expect(e).toBe('SkyProgressIndicatorMessageType unrecognized.');
      }
    });
  });

  describe('progress indicator nav buttons', () => {
    it('should be able to control progress', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      componentInstance = fixture.componentInstance.progressIndicator;
      let debugElement = fixture.nativeElement;
      let prevButton = debugElement.querySelector('#previous-btn button');
      let nextButton = debugElement.querySelector('#next-btn button');
      let resetButton = debugElement.querySelector('#reset-btn button');

      // next button
      nextButton.click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(componentInstance.activeIndex).toBe(1);
      expect(componentInstance.progressItems.first.isActive).toBeFalsy();
      expect(componentInstance.progressItems.first.isComplete).toBeTruthy();

      expect(componentInstance.progressItems.toArray()[1].isActive).toBeTruthy();
      expect(componentInstance.progressItems.toArray()[1].isComplete).toBeFalsy();

      // previous button
      prevButton.click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(componentInstance.activeIndex).toBe(0);
      expect(componentInstance.progressItems.first.isActive).toBeTruthy();
      expect(componentInstance.progressItems.first.isComplete).toBeTruthy();

      expect(componentInstance.progressItems.toArray()[1].isActive).toBeFalsy();
      expect(componentInstance.progressItems.toArray()[1].isComplete).toBeFalsy();

      nextButton.click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      nextButton.click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      resetButton.click();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(componentInstance.activeIndex).toBe(0);
      expect(componentInstance.progressItems.first.isActive).toBeTruthy();
      expect(componentInstance.progressItems.first.isComplete).toBeFalsy();

      expect(componentInstance.progressItems.toArray()[1].isActive).toBeFalsy();
      expect(componentInstance.progressItems.toArray()[1].isComplete).toBeFalsy();

      expect(fixture.componentInstance.resetWasClicked).toBeTruthy();
    }));

    it('should use inputted button type', fakeAsync(() => {
      fixture.componentInstance.previousButtonType = 'next';
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.navButtons.first.buttonType).toBe('next');
    }));

    it('should default button type to next', fakeAsync(() => {
      fixture.componentInstance.previousButtonType = undefined;
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.navButtons.first.buttonType).toBe('next');
    }));

    it('should use inputted button text', fakeAsync(() => {
      fixture.componentInstance.previousButtonText = 'good text';
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.navButtons.first.buttonText).toBe('good text');
    }));

    it('should default button text for each button type', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(fixture.nativeElement.querySelector('#previous-btn button').innerText.trim()).toBe('Previous');
      expect(fixture.nativeElement.querySelector('#next-btn button').innerText.trim()).toBe('Next');
    }));

    it('should use inputted disabled state', fakeAsync(() => {
      fixture.componentInstance.previousButtonDisabled = true;
      fixture.componentInstance.nextButtonDisabled = true;
      fixture.componentInstance.resetButtonDisabled = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      let buttonElements = fixture.nativeElement.querySelectorAll('sky-progress-indicator-nav-button button');
      let resetButton = fixture.nativeElement.querySelector('#reset-btn button');

      expect(fixture.componentInstance.navButtons.first.disabled).toBeTruthy();
      expect(buttonElements[0].disabled).toBeTruthy();

      expect(fixture.componentInstance.navButtons.last.disabled).toBeTruthy();
      expect(buttonElements[1].disabled).toBeTruthy();

      expect(fixture.componentInstance.resetButton.disabled).toBeTruthy();
      expect(resetButton.disabled).toBeTruthy();
    }));

    it('should be accessible', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    it('should be accessible in passive mode', async(() => {
      fixture.componentInstance.isPassive = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));

    it('should be accessible with disabled buttons', async(() => {
      fixture.componentInstance.previousButtonDisabled = true;
      fixture.componentInstance.nextButtonDisabled = true;
      fixture.componentInstance.resetButtonDisabled = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
      });
    }));
  });
});
