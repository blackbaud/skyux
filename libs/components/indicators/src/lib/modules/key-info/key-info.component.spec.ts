import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyKeyInfoFixturesModule } from './fixtures/key-info-fixtures.module';
import { KeyInfoTestComponent } from './fixtures/key-info.component.fixture';

describe('Key info component', () => {
  let fixture: ComponentFixture<KeyInfoTestComponent>;
  let cmp: KeyInfoTestComponent;

  // Helper function to wait for MutationObserver to process changes
  async function waitForMutations(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyKeyInfoFixturesModule],
    });

    fixture = TestBed.createComponent(KeyInfoTestComponent);
    cmp = fixture.componentInstance;
  });

  it('should support vertical and horizontal layouts', async () => {
    const el = fixture.nativeElement as Element;
    const horizontalCls = 'sky-key-info-horizontal';

    cmp.layout = 'horizontal';
    fixture.detectChanges();

    const keyInfoEl = el.querySelector('.sky-key-info');

    expect(keyInfoEl).not.toBeNull();
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    expect(keyInfoEl!.classList.contains(horizontalCls)).toBe(true);

    // Should treat any other value as vertical
    // (enforced by the default .sky-key-info class).
    cmp.layout = undefined;
    fixture.detectChanges();

    expect(keyInfoEl!.classList.contains(horizontalCls)).toBe(false);
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should have the appropriate content in expected areas', async () => {
    const el = fixture.nativeElement as Element;

    fixture.detectChanges();

    expect(
      el.querySelectorAll('.sky-key-info-value sky-key-info-value').length,
    ).toBe(1);
    expect(
      el.querySelectorAll('.sky-key-info-label sky-key-info-label').length,
    ).toBe(1);
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should show help when available', async () => {
    cmp.helpContent = 'Help.';
    fixture.detectChanges();
    await fixture.whenStable();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const helpInline = await loader.getHarness(SkyHelpInlineHarness);
    expect(await helpInline.getAriaLabelledBy()).toBeTruthy();

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  describe('a11y', () => {
    it('should be accessible when vertical', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when horizontal', async () => {
      cmp.layout = 'horizontal';

      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  describe('SkyKeyInfoValueComponent', () => {
    let valueElement: HTMLElement;

    beforeEach(() => {
      valueElement = fixture.nativeElement.querySelector('sky-key-info-value');
    });

    it('should apply sky-font-display-3 class by default when no other font display class exists', () => {
      fixture.detectChanges();

      expect(valueElement.classList.contains('sky-font-display-3')).toBe(true);
    });

    it('should not apply sky-font-display-3 when another sky-font-display-* class is present', async () => {
      fixture.componentRef.setInput('valueClass', 'sky-font-display-1');
      fixture.detectChanges();
      await waitForMutations();

      expect(valueElement.classList.contains('sky-font-display-1')).toBe(true);
      expect(valueElement.classList.contains('sky-font-display-3')).toBe(false);
    });

    it('should allow non-font-display classes to coexist with sky-font-display-3', async () => {
      fixture.componentRef.setInput('valueClass', 'custom-class another-class');
      fixture.detectChanges();
      await waitForMutations();

      expect(valueElement.classList.contains('custom-class')).toBe(true);
      expect(valueElement.classList.contains('another-class')).toBe(true);
      expect(valueElement.classList.contains('sky-font-display-3')).toBe(true);
    });

    it('should react to dynamically added font display classes', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      expect(valueElement.classList.contains('sky-font-display-3')).toBe(true);

      // Dynamically add a font display class
      valueElement.classList.add('sky-font-display-1');
      await waitForMutations();

      expect(valueElement.classList.contains('sky-font-display-1')).toBe(true);
      expect(valueElement.classList.contains('sky-font-display-3')).toBe(false);
    });

    it('should react to dynamically removed font display classes', async () => {
      fixture.componentRef.setInput('valueClass', 'sky-font-display-2');
      fixture.detectChanges();
      await waitForMutations();

      expect(valueElement.classList.contains('sky-font-display-2')).toBe(true);
      expect(valueElement.classList.contains('sky-font-display-3')).toBe(false);

      // Dynamically remove the font display class
      valueElement.classList.remove('sky-font-display-2');
      await waitForMutations();

      expect(valueElement.classList.contains('sky-font-display-2')).toBe(false);
      expect(valueElement.classList.contains('sky-font-display-3')).toBe(true);
    });

    it('should handle multiple class changes', async () => {
      // Start with custom class
      fixture.componentRef.setInput('valueClass', 'sky-font-display-1');
      fixture.detectChanges();
      await waitForMutations();

      expect(valueElement.classList.contains('sky-font-display-1')).toBe(true);
      expect(valueElement.classList.contains('sky-font-display-3')).toBe(false);

      // Remove custom class
      fixture.componentRef.setInput('valueClass', undefined);
      fixture.detectChanges();
      await waitForMutations();

      expect(valueElement.classList.contains('sky-font-display-1')).toBe(false);
      expect(valueElement.classList.contains('sky-font-display-3')).toBe(true);

      // Add different custom class
      fixture.componentRef.setInput('valueClass', 'sky-font-display-4');
      fixture.detectChanges();
      await waitForMutations();

      expect(valueElement.classList.contains('sky-font-display-4')).toBe(true);
      expect(valueElement.classList.contains('sky-font-display-3')).toBe(false);

      // Remove all custom classes
      fixture.componentRef.setInput('valueClass', undefined);
      fixture.detectChanges();
      await waitForMutations();

      expect(valueElement.classList.contains('sky-font-display-4')).toBe(false);
      expect(valueElement.classList.contains('sky-font-display-3')).toBe(true);
    });

    it('should render content', () => {
      fixture.detectChanges();
      expect(valueElement.textContent?.trim()).toBe('Value');
    });
  });
});
