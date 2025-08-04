import { ComponentHarness } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import {
  HelpPopoverHarnessMethods,
  clickHelpInline,
  createHelpPopoverHarnessMethods,
  getHelpPopoverContent,
  getHelpPopoverTitle,
} from '@skyux/help-inline/testing';

// ========================================
// Pattern 1: Custom Ancestor Selectors
// ========================================

export class SkyAdvancedFormHarness
  extends SkyComponentHarness
  implements HelpPopoverHarnessMethods
{
  // Help inline in form header
  public async clickHeaderHelpInline(): Promise<void> {
    return await clickHelpInline(this, { ancestor: '.form-header' });
  }

  // Help inline in form footer
  public async clickFooterHelpInline(): Promise<void> {
    return await clickHelpInline(this, { ancestor: '.form-footer' });
  }

  // Help inline in specific field group
  public async getFieldGroupHelpContent(
    fieldGroup: string,
  ): Promise<string | undefined> {
    return await getHelpPopoverContent(this, {
      ancestor: `[data-field-group="${fieldGroup}"]`,
    });
  }

  // Default help inline (no ancestor)
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

// ========================================
// Pattern 2: Conditional Help Inline
// ========================================

export class SkyConditionalHelpHarness extends SkyComponentHarness {
  /**
   * Checks if help inline exists before trying to interact with it
   */
  public async hasHelpInline(): Promise<boolean> {
    try {
      await clickHelpInline(this);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Safely get help content, returns null if no help inline exists
   */
  public async getHelpContentSafe(): Promise<string | null> {
    try {
      return (await getHelpPopoverContent(this)) ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Conditional click - only clicks if help inline exists
   */
  public async clickHelpInlineIfExists(): Promise<boolean> {
    if (await this.hasHelpInline()) {
      await clickHelpInline(this);
      return true;
    }
    return false;
  }
}

// ========================================
// Pattern 3: Multiple Help Inline Sections
// ========================================

export class SkyMultiSectionHarness extends SkyComponentHarness {
  private readonly sections = [
    { name: 'header', selector: '.section-header' },
    { name: 'content', selector: '.section-content' },
    { name: 'footer', selector: '.section-footer' },
  ];

  /**
   * Get help content from all sections that have help inline
   */
  public async getAllHelpContent(): Promise<
    Record<string, string | undefined>
  > {
    const content: Record<string, string | undefined> = {};

    for (const section of this.sections) {
      try {
        content[section.name] = await getHelpPopoverContent(this, {
          ancestor: section.selector,
        });
      } catch {
        // Section doesn't have help inline, skip it
        content[section.name] = undefined;
      }
    }

    return content;
  }

  /**
   * Click help inline in a specific section by name
   */
  public async clickSectionHelpInline(sectionName: string): Promise<void> {
    const section = this.sections.find((s) => s.name === sectionName);
    if (!section) {
      throw new Error(`Unknown section: ${sectionName}`);
    }

    return await clickHelpInline(this, { ancestor: section.selector });
  }
}

// ========================================
// Pattern 4: Composition with Mixins
// ========================================

/**
 * Mixin function that adds help popover functionality to any harness
 */
export function withHelpPopover<
  T extends new (...args: any[]) => ComponentHarness,
>(BaseClass: T, options?: { ancestor?: string }) {
  return class extends BaseClass implements HelpPopoverHarnessMethods {
    public async clickHelpInline(): Promise<void> {
      return await clickHelpInline(this, options);
    }

    public async getHelpPopoverContent(): Promise<string | undefined> {
      return await getHelpPopoverContent(this, options);
    }

    public async getHelpPopoverTitle(): Promise<string | undefined> {
      return await getHelpPopoverTitle(this, options);
    }
  };
}

// Usage with mixin:
export class SkyBasicHarness extends SkyComponentHarness {
  // Basic harness functionality
}

export class SkyBasicHarnessWithHelp extends withHelpPopover(SkyBasicHarness, {
  ancestor: '.help-section',
}) {
  // Now has help popover functionality automatically!
}

// ========================================
// Pattern 5: Factory Pattern for Complex Configuration
// ========================================

export class SkyHelpInlineFactory {
  /**
   * Creates a configured help inline handler for a specific harness and configuration
   */
  public static createHelpHandler(
    harness: ComponentHarness,
    config: {
      ancestor?: string;
      fallbackAncestor?: string;
      retryCount?: number;
    } = {},
  ) {
    const { ancestor, fallbackAncestor, retryCount = 1 } = config;

    return {
      async getContent(): Promise<string | undefined> {
        try {
          return await getHelpPopoverContent(harness, { ancestor });
        } catch (error) {
          if (fallbackAncestor && retryCount > 0) {
            return await getHelpPopoverContent(harness, {
              ancestor: fallbackAncestor,
            });
          }
          throw error;
        }
      },

      async getTitle(): Promise<string | undefined> {
        try {
          return await getHelpPopoverTitle(harness, { ancestor });
        } catch (error) {
          if (fallbackAncestor && retryCount > 0) {
            return await getHelpPopoverTitle(harness, {
              ancestor: fallbackAncestor,
            });
          }
          throw error;
        }
      },

      async click(): Promise<void> {
        try {
          return await clickHelpInline(harness, { ancestor });
        } catch (error) {
          if (fallbackAncestor && retryCount > 0) {
            return await clickHelpInline(harness, {
              ancestor: fallbackAncestor,
            });
          }
          throw error;
        }
      },
    };
  }
}

// Usage:
export class SkyAdvancedHarness extends SkyComponentHarness {
  private helpHandler = SkyHelpInlineFactory.createHelpHandler(this, {
    ancestor: '.primary-help-location',
    fallbackAncestor: '.secondary-help-location',
    retryCount: 2,
  });

  public async getHelpContent(): Promise<string | undefined> {
    return await this.helpHandler.getContent();
  }

  public async clickHelp(): Promise<void> {
    return await this.helpHandler.click();
  }
}

// ========================================
// Pattern 6: Delegate Pattern for Complex Hierarchies
// ========================================

export class SkyComplexFormHarness extends SkyComponentHarness {
  // Use createHelpPopoverHarnessMethods for automatic delegation
  private helpMethods = createHelpPopoverHarnessMethods(this, {
    ancestor: '.form-help-section',
  });

  // Delegate the interface methods
  public async clickHelpInline(): Promise<void> {
    return await this.helpMethods.clickHelpInline();
  }

  public async getHelpPopoverContent(): Promise<string | undefined> {
    return await this.helpMethods.getHelpPopoverContent();
  }

  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return await this.helpMethods.getHelpPopoverTitle();
  }

  // Add custom functionality
  public async getFormHelpSummary(): Promise<{
    hasHelp: boolean;
    title?: string;
    content?: string;
  }> {
    try {
      const title = await this.getHelpPopoverTitle();
      const content = await this.getHelpPopoverContent();

      return {
        hasHelp: !!(title || content),
        title,
        content,
      };
    } catch {
      return { hasHelp: false };
    }
  }
}

// ========================================
// Pattern 7: Type-Safe Builder Pattern
// ========================================

export class SkyHelpInlineBuilder {
  private harness: ComponentHarness;
  private config: { ancestor?: string } = {};

  constructor(harness: ComponentHarness) {
    this.harness = harness;
  }

  public withAncestor(ancestor: string): this {
    this.config.ancestor = ancestor;
    return this;
  }

  public async getContent(): Promise<string | undefined> {
    return await getHelpPopoverContent(this.harness, this.config);
  }

  public async getTitle(): Promise<string | undefined> {
    return await getHelpPopoverTitle(this.harness, this.config);
  }

  public async click(): Promise<void> {
    return await clickHelpInline(this.harness, this.config);
  }
}

// Usage:
export class SkyBuilderHarness extends SkyComponentHarness {
  public help(): SkyHelpInlineBuilder {
    return new SkyHelpInlineBuilder(this);
  }
}

// Usage example:
// const content = await harness.help().withAncestor('.header').getContent();
// await harness.help().withAncestor('.footer').click();

// ========================================
// Pattern 8: Async Iterator for Multiple Help Sections
// ========================================

export class SkyIterableHelpHarness extends SkyComponentHarness {
  private readonly helpSelectors = [
    '.section-1-help',
    '.section-2-help',
    '.section-3-help',
  ];

  /**
   * Iterate through all help sections that exist
   */
  public async *iterateHelpSections(): AsyncIterableIterator<{
    selector: string;
    content?: string;
    title?: string;
  }> {
    for (const selector of this.helpSelectors) {
      try {
        const content = await getHelpPopoverContent(this, {
          ancestor: selector,
        });
        const title = await getHelpPopoverTitle(this, { ancestor: selector });

        if (content || title) {
          yield { selector, content, title };
        }
      } catch {
        // Section doesn't have help, continue to next
      }
    }
  }

  /**
   * Get all help sections as an array
   */
  public async getAllHelpSections(): Promise<
    Array<{
      selector: string;
      content?: string;
      title?: string;
    }>
  > {
    const sections = [];
    for await (const section of this.iterateHelpSections()) {
      sections.push(section);
    }
    return sections;
  }
}
