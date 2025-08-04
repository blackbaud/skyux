# 🚀 Advanced Usage Patterns for Help Inline Utility Functions

## 📋 **Migration Guide: From Inheritance to Utility Functions**

### **Before (Inheritance Approach)**

```typescript
export class MyHarness extends SkyHelpInlinePopoverHarness {
  // Limited to single inheritance
  // Fixed ancestor selector
  // Not flexible for complex scenarios
}
```

### **After (Utility Function Approach)**

```typescript
export class MyHarness
  extends SkyComponentHarness
  implements HelpPopoverHarnessMethods
{
  public async clickHelpInline(): Promise<void> {
    return await clickHelpInline(this, { ancestor: '.my-selector' });
  }
  // Full flexibility and composition
}
```

## 🎯 **Pattern Selection Guide**

| **Scenario**               | **Recommended Pattern**   | **Example Use Case**                     |
| -------------------------- | ------------------------- | ---------------------------------------- |
| **Simple single help**     | Direct function calls     | Basic component with one help button     |
| **Multiple help sections** | Custom ancestor selectors | Form with help in header/footer/fields   |
| **Optional help**          | Conditional help pattern  | Components that may/may not have help    |
| **Complex hierarchies**    | Delegate pattern          | Nested components with various help      |
| **Reusable functionality** | Mixin pattern             | Multiple harnesses needing same behavior |
| **Dynamic configuration**  | Factory pattern           | Runtime-determined help configurations   |
| **Fluent API**             | Builder pattern           | Chainable help interactions              |

## 🔧 **Performance Optimization Patterns**

### **Pattern 1: Lazy Help Loading**

```typescript
export class SkyOptimizedHarness extends SkyComponentHarness {
  private _helpCache: Map<string, Promise<string | undefined>> = new Map();

  public async getHelpContentCached(
    ancestor?: string,
  ): Promise<string | undefined> {
    const key = ancestor || 'default';

    if (!this._helpCache.has(key)) {
      this._helpCache.set(key, getHelpPopoverContent(this, { ancestor }));
    }

    return this._helpCache.get(key)!;
  }
}
```

### **Pattern 2: Batch Help Operations**

```typescript
export class SkyBatchHelpHarness extends SkyComponentHarness {
  public async getAllHelpData(): Promise<{
    sections: Array<{ selector: string; content?: string; title?: string }>;
    totalSections: number;
    sectionsWithHelp: number;
  }> {
    const selectors = ['.header', '.content', '.footer'];

    // Batch all operations for better performance
    const operations = selectors.map(async (selector) => {
      try {
        const [content, title] = await Promise.all([
          getHelpPopoverContent(this, { ancestor: selector }),
          getHelpPopoverTitle(this, { ancestor: selector }),
        ]);
        return { selector, content, title };
      } catch {
        return { selector, content: undefined, title: undefined };
      }
    });

    const sections = await Promise.all(operations);
    const sectionsWithHelp = sections.filter(
      (s) => s.content || s.title,
    ).length;

    return {
      sections,
      totalSections: selectors.length,
      sectionsWithHelp,
    };
  }
}
```

## 🛡️ **Error Handling Patterns**

### **Pattern 1: Graceful Degradation**

```typescript
export class SkyRobustHelpHarness extends SkyComponentHarness {
  public async safeHelpOperation<T>(
    operation: () => Promise<T>,
    fallback: T,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.warn('Help operation failed:', error);
      return fallback;
    }
  }

  public async getHelpOrDefault(defaultText: string): Promise<string> {
    return this.safeHelpOperation(
      () =>
        getHelpPopoverContent(this).then((content) => content || defaultText),
      defaultText,
    );
  }
}
```

### **Pattern 2: Retry with Exponential Backoff**

```typescript
export class SkyRetryHelpHarness extends SkyComponentHarness {
  private async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 100,
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) throw error;

        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  }

  public async getHelpWithRetry(): Promise<string | undefined> {
    return this.retryOperation(() => getHelpPopoverContent(this));
  }
}
```

## 🧪 **Testing Patterns**

### **Pattern 1: Parameterized Help Tests**

```typescript
describe('Help Inline Tests', () => {
  const helpTestCases = [
    {
      selector: '.header-help',
      expectedContent: 'Header help content',
      expectedTitle: 'Header Help',
    },
    {
      selector: '.footer-help',
      expectedContent: 'Footer help content',
      expectedTitle: 'Footer Help',
    },
  ];

  helpTestCases.forEach((testCase) => {
    it(`should display correct help for ${testCase.selector}`, async () => {
      const harness = await loader.getHarness(MyHarness);

      const content = await getHelpPopoverContent(harness, {
        ancestor: testCase.selector,
      });
      const title = await getHelpPopoverTitle(harness, {
        ancestor: testCase.selector,
      });

      expect(content).toContain(testCase.expectedContent);
      expect(title).toContain(testCase.expectedTitle);
    });
  });
});
```

### **Pattern 2: State-Based Help Testing**

```typescript
export class SkyStateBasedHelpTester {
  public static async testHelpInAllStates(
    harness: any,
    states: string[],
    getExpectedContent: (state: string) => string,
  ): Promise<void> {
    for (const state of states) {
      await harness.setState(state);

      const content = await getHelpPopoverContent(harness);
      expect(content).toContain(getExpectedContent(state));
    }
  }
}

// Usage:
await SkyStateBasedHelpTester.testHelpInAllStates(
  harness,
  ['loading', 'success', 'error'],
  (state) => `Help content for ${state} state`,
);
```

## 📊 **Monitoring and Analytics Patterns**

### **Pattern 1: Help Usage Tracking**

```typescript
export class SkyHelpAnalyticsHarness extends SkyComponentHarness {
  private static helpInteractions: Array<{
    component: string;
    ancestor?: string;
    action: 'click' | 'view_content' | 'view_title';
    timestamp: number;
  }> = [];

  private trackHelpInteraction(
    action: 'click' | 'view_content' | 'view_title',
    ancestor?: string,
  ): void {
    SkyHelpAnalyticsHarness.helpInteractions.push({
      component: this.constructor.name,
      ancestor,
      action,
      timestamp: Date.now(),
    });
  }

  public async clickHelpInline(): Promise<void> {
    this.trackHelpInteraction('click');
    return await clickHelpInline(this);
  }

  public static getHelpAnalytics() {
    return {
      totalInteractions: this.helpInteractions.length,
      byComponent: this.groupBy(this.helpInteractions, 'component'),
      byAction: this.groupBy(this.helpInteractions, 'action'),
      interactions: this.helpInteractions,
    };
  }

  private static groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce(
      (result, item) => {
        const group = String(item[key]);
        result[group] = result[group] || [];
        result[group].push(item);
        return result;
      },
      {} as Record<string, T[]>,
    );
  }
}
```

## 🎭 **Advanced Composition Patterns**

### **Pattern 1: Trait-Based Composition**

```typescript
// Define traits as interfaces with default implementations
interface HelpInlineTrait {
  clickHelpInline(): Promise<void>;
  getHelpPopoverContent(): Promise<string | undefined>;
  getHelpPopoverTitle(): Promise<string | undefined>;
}

interface ConditionalHelpTrait {
  hasHelpInline(): Promise<boolean>;
  clickHelpIfExists(): Promise<boolean>;
}

interface MultiSectionHelpTrait {
  getAllHelpSections(): Promise<string[]>;
  getHelpForSection(section: string): Promise<string | undefined>;
}

// Implement traits using utility functions
function implementHelpInlineTrait(
  harness: ComponentHarness,
  options?: { ancestor?: string },
): HelpInlineTrait {
  return {
    async clickHelpInline() {
      return await clickHelpInline(harness, options);
    },
    async getHelpPopoverContent() {
      return await getHelpPopoverContent(harness, options);
    },
    async getHelpPopoverTitle() {
      return await getHelpPopoverTitle(harness, options);
    },
  };
}

// Use traits in harnesses
export class SkyAdvancedHarness
  extends SkyComponentHarness
  implements HelpInlineTrait, ConditionalHelpTrait
{
  private helpTrait = implementHelpInlineTrait(this, {
    ancestor: '.help-section',
  });

  // Delegate trait methods
  public async clickHelpInline(): Promise<void> {
    return this.helpTrait.clickHelpInline();
  }

  public async getHelpPopoverContent(): Promise<string | undefined> {
    return this.helpTrait.getHelpPopoverContent();
  }

  public async getHelpPopoverTitle(): Promise<string | undefined> {
    return this.helpTrait.getHelpPopoverTitle();
  }

  // Implement conditional help trait
  public async hasHelpInline(): Promise<boolean> {
    try {
      await this.clickHelpInline();
      return true;
    } catch {
      return false;
    }
  }

  public async clickHelpIfExists(): Promise<boolean> {
    if (await this.hasHelpInline()) {
      await this.clickHelpInline();
      return true;
    }
    return false;
  }
}
```

## 🔄 **Migration Strategy**

### **Step 1: Identify Current Usage**

```bash
# Find all harnesses extending SkyHelpInlinePopoverHarness
grep -r "extends SkyHelpInlinePopoverHarness" --include="*.ts" libs/

# Find all imports of the old class
grep -r "SkyHelpInlinePopoverHarness" --include="*.ts" libs/
```

### **Step 2: Create Migration Plan**

1. **Low Risk First**: Start with harnesses that have simple help inline usage
2. **Test Coverage**: Ensure good test coverage before migration
3. **Incremental**: Migrate one harness at a time
4. **Validate**: Run tests after each migration

### **Step 3: Use Migration Script**

```bash
# Use the provided migration script
./refactor-help-inline-harness.sh libs/components/forms/testing/src/modules/field-group/field-group-harness.ts
```

### **Step 4: Manual Review**

- Check for custom ancestor selectors needed
- Verify method signatures match interface
- Update any custom help inline logic
- Run tests and fix any issues

## 💡 **Best Practices Summary**

1. **Use Composition Over Inheritance**: More flexible and maintainable
2. **Leverage Type Safety**: Implement `HelpPopoverHarnessMethods` interface
3. **Handle Errors Gracefully**: Use try-catch for optional help content
4. **Optimize Performance**: Cache results and batch operations when possible
5. **Test Thoroughly**: Use parameterized tests for multiple help sections
6. **Document Configuration**: Clearly document any ancestor selectors used
7. **Monitor Usage**: Track help interactions for analytics
8. **Plan for Migration**: Use incremental migration strategy

The utility function approach provides unlimited flexibility while maintaining type safety and performance! 🎯
