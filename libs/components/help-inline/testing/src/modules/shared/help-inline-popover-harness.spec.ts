import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SkyHelpInlineHarness } from '../help-inline/help-inline-harness';

import { SkyHelpInlinePopoverHarness } from './help-inline-popover-harness';
import {
  HelpPopoverHarnessMethods,
  clickHelpInline,
  getHelpPopoverContent,
  getHelpPopoverTitle,
} from './help-inline-utils';

@Component({
  template: `
    <div class="test-component">
      <sky-help-inline [popoverContent]="content" [popoverTitle]="title" />
    </div>
  `,
  standalone: false,
})
class TestComponent {
  public content: string | undefined = 'Test content';
  public title: string | undefined = 'Test title';
}

// Legacy test harness using deprecated inheritance approach
class LegacyTestHarness extends SkyHelpInlinePopoverHarness {
  public static hostSelector = '.test-component';

  public async clickHelpInline(): Promise<void> {
    const helpInline = await this.locatorFor(SkyHelpInlineHarness)();
    await helpInline.click();
  }
}

// New test harness using utility function approach
class UtilityFunctionTestHarness
  extends SkyComponentHarness
  implements HelpPopoverHarnessMethods
{
  public static hostSelector = '.test-component';

  public async clickHelpInline(): Promise<void> {
    return await clickHelpInline(this);
  }

  public async getHelpPopoverContent(): Promise<string | undefined> {
    return await getHelpPopoverContent(this);
  }

  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await getHelpPopoverTitle(this);
  }
}

describe('Help Inline Harness Tests', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyHelpInlineModule, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(TestComponent);
  });

  // Test the deprecated SkyHelpInlinePopoverHarness for backward compatibility
  describe('SkyHelpInlinePopoverHarness (deprecated)', () => {
    let harness: LegacyTestHarness;

    beforeEach(async () => {
      const loader = TestbedHarnessEnvironment.loader(fixture);
      harness = await loader.getHarness(LegacyTestHarness);
    });

    it('should get popover content using deprecated class', async () => {
      fixture.detectChanges();

      await harness.clickHelpInline();

      const content = await harness.getHelpPopoverContent();
      expect(content).toBe('Test content');
    });

    it('should get popover title using deprecated class', async () => {
      fixture.detectChanges();

      await harness.clickHelpInline();

      const title = await harness.getHelpPopoverTitle();
      expect(title).toBe('Test title');
    });

    it('should throw error when no help inline popover is found', async () => {
      fixture.componentInstance.content = undefined;
      fixture.nativeElement.querySelector('sky-help-inline').remove();
      fixture.detectChanges();

      await expectAsync(harness.getHelpPopoverContent()).toBeRejectedWithError(
        'No help inline found.',
      );
    });
  });

  // Test the new utility function approach
  describe('Help Inline Utility Functions', () => {
    let harness: UtilityFunctionTestHarness;

    beforeEach(async () => {
      const loader = TestbedHarnessEnvironment.loader(fixture);
      harness = await loader.getHarness(UtilityFunctionTestHarness);
    });

    it('should get popover content using utility functions', async () => {
      fixture.detectChanges();

      await harness.clickHelpInline();

      const content = await harness.getHelpPopoverContent();
      expect(content).toBe('Test content');
    });

    it('should get popover title using utility functions', async () => {
      fixture.detectChanges();

      await harness.clickHelpInline();

      const title = await harness.getHelpPopoverTitle();
      expect(title).toBe('Test title');
    });

    it('should throw error when no help inline popover is found', async () => {
      fixture.componentInstance.content = undefined;
      fixture.nativeElement.querySelector('sky-help-inline').remove();
      fixture.detectChanges();

      await expectAsync(harness.getHelpPopoverContent()).toBeRejectedWithError(
        'No help inline found.',
      );
    });

    it('should work with custom ancestor selectors', async () => {
      fixture.detectChanges();

      // Test with ancestor selector pointing to the test component
      const content = await getHelpPopoverContent(harness, {
        ancestor: '.test-component',
      });
      await clickHelpInline(harness, { ancestor: '.test-component' });

      expect(content).toBe('Test content');
    });

    it('should handle missing ancestor gracefully', async () => {
      fixture.detectChanges();

      await expectAsync(
        getHelpPopoverContent(harness, { ancestor: '.non-existent' }),
      ).toBeRejectedWithError('No help inline found.');
    });
  });

  // Test direct utility function usage without harness wrapper
  describe('Direct Utility Function Usage', () => {
    let baseHarness: SkyComponentHarness;

    beforeEach(async () => {
      const loader = TestbedHarnessEnvironment.loader(fixture);
      baseHarness = await loader.getHarness(UtilityFunctionTestHarness);
    });

    it('should work with direct function calls', async () => {
      fixture.detectChanges();

      await clickHelpInline(baseHarness);
      const content = await getHelpPopoverContent(baseHarness);
      const title = await getHelpPopoverTitle(baseHarness);

      expect(content).toBe('Test content');
      expect(title).toBe('Test title');
    });

    it('should support different configurations', async () => {
      fixture.detectChanges();

      // Test with default configuration
      await clickHelpInline(baseHarness);
      const defaultContent = await getHelpPopoverContent(baseHarness);
      expect(defaultContent).toBe('Test content');

      // Test with ancestor configuration
      const ancestorContent = await getHelpPopoverContent(baseHarness, {
        ancestor: '.test-component',
      });
      expect(ancestorContent).toBe('Test content');
    });
  });
});
