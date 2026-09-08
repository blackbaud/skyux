import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyInputBoxCharacterLimit } from './input-box-character-limit';

describe('Input box character limit component', () => {
  let fixture: ComponentFixture<SkyInputBoxCharacterLimit>;

  async function setCharacterCount(characterCount: number): Promise<void> {
    fixture.componentRef.setInput('characterCount', characterCount);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getRatioEl(): HTMLElement {
    return fixture.nativeElement.querySelector(
      '.sky-character-count-label,.sky-input-box-character-limit-label',
    );
  }

  function getAnnouncement(): string {
    const announcerEl: HTMLElement =
      fixture.nativeElement.querySelector('[aria-live]');

    return announcerEl.textContent?.trim() ?? '';
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyInputBoxCharacterLimit],
    });

    fixture = TestBed.createComponent(SkyInputBoxCharacterLimit);
  });

  describe('visible count', () => {
    it('should display the count and limit', async () => {
      fixture.componentRef.setInput('characterLimit', 10);
      await setCharacterCount(3);

      expect(getRatioEl()).toHaveText('3/10');

      await setCharacterCount(6);

      expect(getRatioEl()).toHaveText('6/10');
    });

    it('should show the error class only when the count exceeds the limit', async () => {
      fixture.componentRef.setInput('characterLimit', 10);
      await setCharacterCount(10);

      expect(getRatioEl()).not.toHaveCssClass('sky-error-label');

      await setCharacterCount(11);

      expect(getRatioEl()).toHaveCssClass('sky-error-label');
    });
  });

  describe('screen reader announcement', () => {
    it('should announce the initial count', async () => {
      fixture.componentRef.setInput('characterLimit', 49);

      await setCharacterCount(4);

      expect(getAnnouncement()).toBe('4 characters out of 49');
    });

    it('should announce every 10 characters when within 50 of the limit', async () => {
      fixture.componentRef.setInput('characterLimit', 49);

      await setCharacterCount(4);

      // The announcement holds until the count reaches the next milestone.
      await setCharacterCount(9);

      expect(getAnnouncement()).toBe('4 characters out of 49');

      await setCharacterCount(10);

      expect(getAnnouncement()).toBe('10 characters out of 49');

      await setCharacterCount(0);

      expect(getAnnouncement()).toBe('0 characters out of 49');
    });

    it('should announce every 50 characters when not within 50 of the limit', async () => {
      fixture.componentRef.setInput('characterLimit', 99);

      await setCharacterCount(4);

      await setCharacterCount(10);

      expect(getAnnouncement()).toBe('4 characters out of 99');

      // 50 characters on a non-multiple of 10 is not a milestone at this limit.
      await setCharacterCount(49);

      expect(getAnnouncement()).toBe('4 characters out of 99');

      await setCharacterCount(50);

      expect(getAnnouncement()).toBe('50 characters out of 99');

      await setCharacterCount(60);

      expect(getAnnouncement()).toBe('60 characters out of 99');
    });

    it('should hold the announcement while backspacing below a milestone', async () => {
      fixture.componentRef.setInput('characterLimit', 99);

      await setCharacterCount(60);

      await setCharacterCount(59);

      expect(getAnnouncement()).toBe('60 characters out of 99');

      await setCharacterCount(50);

      expect(getAnnouncement()).toBe('50 characters out of 99');

      await setCharacterCount(49);

      expect(getAnnouncement()).toBe('50 characters out of 99');
    });

    it('should announce the nearest milestone when the count skips several', async () => {
      fixture.componentRef.setInput('characterLimit', 99);

      await setCharacterCount(4);

      await setCharacterCount(98);

      expect(getAnnouncement()).toBe('90 characters out of 99');
    });

    it('should re-anchor the announcement when the value is replaced wholesale', async () => {
      fixture.componentRef.setInput('characterLimit', 50);

      await setCharacterCount(43);

      await setCharacterCount(21);

      expect(getAnnouncement()).toBe('20 characters out of 50');
    });

    it('should announce the limit even when it is not a milestone', async () => {
      fixture.componentRef.setInput('characterLimit', 99);

      await setCharacterCount(90);

      await setCharacterCount(99);

      expect(getAnnouncement()).toBe('99 characters out of 99');
    });

    it('should announce when the count exceeds the limit', async () => {
      fixture.componentRef.setInput('characterLimit', 99);

      await setCharacterCount(99);

      await setCharacterCount(100);

      expect(getAnnouncement()).toBe('You are over the character limit.');
    });

    it('should announce the actual count when the limit drops below the last announcement', async () => {
      fixture.componentRef.setInput('characterLimit', 200);

      await setCharacterCount(100);

      expect(getAnnouncement()).toBe('100 characters out of 200');

      fixture.componentRef.setInput('characterLimit', 99);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getAnnouncement()).toBe('You are over the character limit.');

      await setCharacterCount(98);

      expect(getAnnouncement()).toBe('98 characters out of 99');
    });
  });

  describe('a11y', () => {
    it('should be accessible when within the limit', async () => {
      fixture.componentRef.setInput('characterLimit', 10);

      await setCharacterCount(3);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when over the limit', async () => {
      fixture.componentRef.setInput('characterLimit', 10);

      await setCharacterCount(11);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
