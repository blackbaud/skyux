import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import {
  HelpPopoverHarnessMethods,
  clickHelpInline,
  getHelpPopoverContent,
  getHelpPopoverTitle,
} from './help-inline-utils';

@Component({
  template: `
    <div class="integration-test-component">
      <!-- Simple help inline test -->
      <div class="section-1">
        <sky-help-inline
          [popoverContent]="'Section 1 help content'"
          [popoverTitle]="'Section 1 Help'"
        />
        Section 1 content
      </div>

      <!-- Help inline with ancestor selector -->
      <div class="section-2">
        <div class="nested-content">
          <sky-help-inline
            [popoverContent]="'Section 2 help content'"
            [popoverTitle]="'Section 2 Help'"
          />
        </div>
        Section 2 content
      </div>
    </div>
  `,
  standalone: false,
})
class IntegrationTestComponent {}

// Test harness using utility functions
class TestHarnessWithUtils
  extends SkyComponentHarness
  implements HelpPopoverHarnessMethods
{
  public static hostSelector = '.integration-test-component';

  public async clickHelpInline(): Promise<void> {
    return await clickHelpInline(this);
  }

  public async getHelpPopoverContent(): Promise<string | undefined> {
    return await getHelpPopoverContent(this);
  }

  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await getHelpPopoverTitle(this);
  }

  // Additional methods for testing different sections
  public async clickSection1Help(): Promise<void> {
    return await clickHelpInline(this, { ancestor: '.section-1' });
  }

  public async getSection1HelpContent(): Promise<string | undefined> {
    return await getHelpPopoverContent(this, { ancestor: '.section-1' });
  }

  public async clickSection2Help(): Promise<void> {
    return await clickHelpInline(this, { ancestor: '.section-2' });
  }

  public async getSection2HelpContent(): Promise<string | undefined> {
    return await getHelpPopoverContent(this, { ancestor: '.section-2' });
  }
}

describe('Help Inline Utility Functions Integration Tests', () => {
  let fixture: ComponentFixture<IntegrationTestComponent>;
  let harness: TestHarnessWithUtils;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [IntegrationTestComponent],
      imports: [SkyHelpInlineModule, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(IntegrationTestComponent);
    fixture.detectChanges();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    harness = await loader.getHarness(TestHarnessWithUtils);
  });

  describe('Basic Utility Function Usage', () => {
    it('should implement HelpPopoverHarnessMethods interface correctly', () => {
      // Verify the harness implements the interface
      expect(typeof harness.clickHelpInline).toBe('function');
      expect(typeof harness.getHelpPopoverContent).toBe('function');
      expect(typeof harness.getHelpPopoverTitle).toBe('function');
    });

    it('should get help popover content from first section', async () => {
      await harness.clickSection1Help();
      const content = await harness.getSection1HelpContent();
      expect(content).toBe('Section 1 help content');
    });

    it('should get help popover content from second section', async () => {
      await harness.clickSection2Help();
      const content = await harness.getSection2HelpContent();
      expect(content).toBe('Section 2 help content');
    });

    it('should work with direct utility function calls', async () => {
      // Test direct utility function usage with base harness
      await clickHelpInline(harness, { ancestor: '.section-1' });
      const content = await getHelpPopoverContent(harness, {
        ancestor: '.section-1',
      });
      const title = await getHelpPopoverTitle(harness, {
        ancestor: '.section-1',
      });

      expect(content).toBe('Section 1 help content');
      expect(title).toBe('Section 1 Help');
    });
  });

  describe('Advanced Ancestor Selector Usage', () => {
    it('should handle nested ancestor selectors', async () => {
      // Test deeply nested selector
      const content = await getHelpPopoverContent(harness, {
        ancestor: '.section-2 .nested-content',
      });
      expect(content).toBe('Section 2 help content');
    });

    it('should differentiate between different sections', async () => {
      // Get content from both sections
      const section1Content = await getHelpPopoverContent(harness, {
        ancestor: '.section-1',
      });
      const section2Content = await getHelpPopoverContent(harness, {
        ancestor: '.section-2',
      });

      expect(section1Content).toBe('Section 1 help content');
      expect(section2Content).toBe('Section 2 help content');
      expect(section1Content).not.toBe(section2Content);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing help inline consistently', async () => {
      // Test that utility functions throw consistent errors
      await expectAsync(
        getHelpPopoverContent(harness, { ancestor: '.non-existent-section' }),
      ).toBeRejectedWithError('No help inline found.');

      await expectAsync(
        getHelpPopoverTitle(harness, { ancestor: '.non-existent-section' }),
      ).toBeRejectedWithError('No help inline found.');

      await expectAsync(
        clickHelpInline(harness, { ancestor: '.non-existent-section' }),
      ).toBeRejectedWithError('No help inline found.');
    });

    it('should handle invalid selector gracefully', async () => {
      await expectAsync(
        getHelpPopoverContent(harness, { ancestor: '&&invalid-selector' }),
      ).toBeRejected();
    });
  });

  describe('Performance and Type Safety', () => {
    it('should maintain type safety', async () => {
      // TypeScript should ensure these return the correct types
      const content: string | undefined = await harness.getHelpPopoverContent();
      const title: string | undefined = await harness.getHelpPopoverTitle();

      if (content) {
        expect(typeof content).toBe('string');
      }
      if (title) {
        expect(typeof title).toBe('string');
      }
    });

    it('should perform efficiently with multiple operations', async () => {
      const startTime = performance.now();

      // Perform multiple operations
      for (let i = 0; i < 3; i++) {
        await harness.clickSection1Help();
        await harness.getSection1HelpContent();
        await harness.clickSection2Help();
        await harness.getSection2HelpContent();
      }

      const duration = performance.now() - startTime;

      // Should complete within reasonable time
      expect(duration).toBeLessThan(1500); // 1.5 seconds
    });
  });

  describe('Composition Patterns', () => {
    it('should work with composition over inheritance', async () => {
      // Create a custom harness that uses utility functions differently
      class CustomHarness extends SkyComponentHarness {
        public static hostSelector = '.integration-test-component';

        // Custom method that combines utility functions
        public async getAllHelpContent(): Promise<{
          section1?: string;
          section2?: string;
        }> {
          const results: { section1?: string; section2?: string } = {};

          try {
            results.section1 = await getHelpPopoverContent(this, {
              ancestor: '.section-1',
            });
          } catch {
            // Section 1 doesn't have help
          }

          try {
            results.section2 = await getHelpPopoverContent(this, {
              ancestor: '.section-2',
            });
          } catch {
            // Section 2 doesn't have help
          }

          return results;
        }
      }

      const loader = TestbedHarnessEnvironment.loader(fixture);
      const customHarness = await loader.getHarness(CustomHarness);

      const allContent = await customHarness.getAllHelpContent();
      expect(allContent.section1).toBe('Section 1 help content');
      expect(allContent.section2).toBe('Section 2 help content');
    });
  });
});
