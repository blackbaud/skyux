import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SkyHelpInlineHarness } from '../help-inline/help-inline-harness';

import { SkyHelpInlinePopoverHarness } from './help-inline-popover-harness';

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

class TestHarness extends SkyHelpInlinePopoverHarness {
  public static hostSelector = '.test-component';

  public async clickHelpInline(): Promise<void> {
    const helpInline = await this.locatorFor(SkyHelpInlineHarness)();
    await helpInline.click();
  }
}

describe('SkyHelpInlinePopoverHarness', () => {
  let fixture: ComponentFixture<TestComponent>;
  let harness: TestHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyHelpInlineModule, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    harness = await loader.getHarness(TestHarness);
  });

  it('should get popover content', async () => {
    fixture.detectChanges();

    await harness.clickHelpInline();

    const content = await harness.getHelpPopoverContent();
    expect(content).toBe('Test content');
  });

  it('should get popover title', async () => {
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
