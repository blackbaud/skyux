# Migrating bespoke list heading implementations to list summary

This guide covers how to replace custom list heading implementations with the standardized `sky-list-summary` component. The list summary component provides a consistent, responsive design for displaying key metrics and statistics above data tables or lists.

## When to use this migration

This migration applies if your application currently uses `sky-key-info` components or custom implementations for displaying summary statistics, key metrics, or data overviews above lists or tables. Common patterns include:

- Multiple `sky-key-info` components arranged in custom layouts
- Custom CSS grid layouts for displaying metrics
- Manual responsive breakpoint handling for summary statistics
- Bespoke components for key performance indicators (KPIs)
- Hand-coded summary rows or headers with statistical data

## Benefits of migrating

- **Consistent design**: Standardized spacing, typography, and layout
- **Responsive behavior**: Built-in responsive design that adapts to different screen sizes
- **Accessibility**: Proper semantic markup and keyboard navigation
- **Maintenance**: Reduced custom CSS and component code to maintain
- **Help integration**: Built-in support for help popovers and documentation links

## Migration steps

### 1. Identify current implementation

Look for `sky-key-info` components or custom templates that display summary information above lists. These often include:

```html
<!-- Example of sky-key-info implementation -->
<div class="summary-stats">
  <sky-key-info>
    <sky-key-info-value>1,247</sky-key-info-value>
    <sky-key-info-label>Total Records</sky-key-info-label>
  </sky-key-info>
  <sky-key-info>
    <sky-key-info-value>$1.2M</sky-key-info-value>
    <sky-key-info-label>Revenue</sky-key-info-label>
  </sky-key-info>
</div>
```

### 2. Import the list summary module

Add `SkyListSummaryModule` to your component or module imports:

```typescript
// If using standalone components
import { SkyListSummaryModule } from '@skyux/lists';

@Component({
  selector: 'app-my-component',
  imports: [SkyListSummaryModule],
  // ...
})

// If using NgModules
import { SkyListSummaryModule } from '@skyux/lists';

@NgModule({
  imports: [SkyListSummaryModule],
  // ...
})
```

### 3. Replace bespoke template with list summary

Replace your sky-key-info implementation with the standardized components:

```html
<!-- Before: sky-key-info implementation -->
<div class="summary-stats">
  <sky-key-info>
    <sky-key-info-value>{{ totalRecords | number }}</sky-key-info-value>
    <sky-key-info-label>Total Records</sky-key-info-label>
  </sky-key-info>
  <sky-key-info>
    <sky-key-info-value>{{ revenue | currency }}</sky-key-info-value>
    <sky-key-info-label>Revenue</sky-key-info-label>
  </sky-key-info>
</div>

<!-- After: List summary component -->
<sky-list-summary>
  <sky-list-summary-item label="Total Records" [value]="totalRecords" />
  <sky-list-summary-item
    label="Revenue"
    [value]="revenue"
    [valueFormat]="{ format: 'currency' }"
  />
</sky-list-summary>
```

### 4. Update component logic

Move formatting logic from templates to the `valueFormat` property:

```typescript
// Before: Manual formatting in template or component
export class MyComponent {
  get formattedRevenue(): string {
    return this.currencyPipe.transform(this.revenue, 'USD') || '';
  }

  get formattedScore(): string {
    return this.decimalPipe.transform(this.averageScore, '1.2-2') || '';
  }
}
```

```typescript
// After: Use valueFormat options
export class MyComponent {
  revenueFormat = { format: 'currency', iso: 'USD' };
  scoreFormat = { format: 'number', digitsInfo: '1.2-2' };
}
```

### 5. Remove custom CSS

Delete custom styles that are now handled by the list summary component:

```scss
/* Remove these custom styles */
.summary-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  text-transform: uppercase;
}
```

### 6. Add help content (optional)

If your summary items need explanatory content, add help popovers:

```html
<sky-list-summary>
  <sky-list-summary-item
    label="Total Revenue"
    [value]="totalRevenue"
    [valueFormat]="{ format: 'currency' }"
    helpPopoverTitle="Total Revenue"
    helpPopoverContent="The sum of all revenue generated from completed transactions."
  />
</sky-list-summary>
```

## Common migration patterns

### Pattern 1: Numeric statistics with custom formatting

```html
<!-- Before: sky-key-info components -->
<div class="stats-row">
  <sky-key-info>
    <sky-key-info-value>{{ userCount | number:'1.0-0' }}</sky-key-info-value>
    <sky-key-info-label>Active Users</sky-key-info-label>
  </sky-key-info>
  <sky-key-info>
    <sky-key-info-value>{{ averageScore | number:'1.1-1' }}</sky-key-info-value>
    <sky-key-info-label>Average Score</sky-key-info-label>
  </sky-key-info>
</div>

<!-- After: List summary component -->
<sky-list-summary>
  <sky-list-summary-item
    label="Active Users"
    [value]="userCount"
    [valueFormat]="{ format: 'number', digitsInfo: '1.0-0' }"
  />
  <sky-list-summary-item
    label="Average Score"
    [value]="averageScore"
    [valueFormat]="{ format: 'number', digitsInfo: '1.1-1' }"
  />
</sky-list-summary>
```

### Pattern 2: Currency and decimal values

```html
<!-- Before: sky-key-info components -->
<div class="financial-summary">
  <sky-key-info>
    <sky-key-info-value
      >{{ totalSales | currency:'USD':'symbol':'1.2-2' }}</sky-key-info-value
    >
    <sky-key-info-label>Total Sales</sky-key-info-label>
  </sky-key-info>
  <sky-key-info>
    <sky-key-info-value
      >{{ averageOrderValue | number:'1.2-2' }}</sky-key-info-value
    >
    <sky-key-info-label>Avg Order Value</sky-key-info-label>
  </sky-key-info>
</div>

<!-- After: List summary component -->
<sky-list-summary>
  <sky-list-summary-item
    label="Total Sales"
    [value]="totalSales"
    [valueFormat]="{ format: 'currency', digitsInfo: '1.2-2' }"
  />
  <sky-list-summary-item
    label="Avg Order Value"
    [value]="averageOrderValue"
    [valueFormat]="{ format: 'number', digitsInfo: '1.2-2' }"
  />
</sky-list-summary>
```

### Pattern 3: String values (no formatting)

```html
<!-- Before: sky-key-info components -->
<div class="status-summary">
  <sky-key-info>
    <sky-key-info-value>{{ currentStatus }}</sky-key-info-value>
    <sky-key-info-label>System Status</sky-key-info-label>
  </sky-key-info>
</div>

<!-- After: List summary component -->
<sky-list-summary>
  <sky-list-summary-item label="System Status" [value]="currentStatus" />
</sky-list-summary>
```

## Testing your migration

### Unit tests

Update your unit tests to use the list summary harnesses:

```typescript
import { SkyListSummaryHarness } from '@skyux/lists/testing';

it('should display summary statistics', async () => {
  const listSummaryHarness = await loader.getHarness(SkyListSummaryHarness);
  const summaryItems = await listSummaryHarness.getSummaryItems();

  expect(summaryItems.length).toBe(2);
  await expectAsync(summaryItems[0].getLabelText()).toBeResolvedTo(
    'Total Records',
  );
  await expectAsync(summaryItems[0].getValueText()).toBeResolvedTo('1,247');
});
```

### Visual regression testing

Verify that the new implementation maintains the expected visual appearance and responsive behavior across different screen sizes.

## Troubleshooting

### Issue: Numbers not formatting correctly

**Problem**: Values display as raw numbers instead of formatted text.

**Solution**: Ensure `valueFormat` is properly configured:

```html
<!-- Incorrect -->
<sky-list-summary-item [value]="1234.56" valueFormat="currency" />

<!-- Correct -->
<sky-list-summary-item
  [value]="1234.56"
  [valueFormat]="{ format: 'currency' }"
/>
```

### Issue: Layout doesn't match previous design

**Problem**: The new component layout differs from your custom implementation.

**Solution**: The list summary component follows SKY UX design standards. Avoid adding custom CSS to override the standard layout. If specific spacing is needed, work with your design team to align with SKY UX patterns.

### Issue: Help content not appearing

**Problem**: Help popover doesn't display when clicking the help icon.

**Solution**: Ensure both `helpPopoverContent` and optionally `helpPopoverTitle` are provided:

```html
<sky-list-summary-item
  label="Metric Name"
  [value]="metricValue"
  helpPopoverContent="Description of what this metric represents."
  helpPopoverTitle="Metric Help"
/>
```

## Additional resources

- [List summary component documentation](https://developer.blackbaud.com/skyux/components/list-summary)
- [List summary code examples](https://developer.blackbaud.com/skyux/components/list-summary#demo)
- [Numeric formatting options](https://developer.blackbaud.com/skyux/components/numeric)
- [Help inline component](https://developer.blackbaud.com/skyux/components/help-inline)
