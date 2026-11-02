import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyBlockquote } from '@skyux/layout';

import { SkyBlockquoteHarness } from './blockquote-harness';

@Component({
  imports: [SkyBlockquote],
  template: `
    <sky-blockquote
      data-sky-id="test-blockquote"
      [author]="author()"
      [quoteSource]="quoteSource()"
    >
      Sample testimonial
    </sky-blockquote>
  `,
})
class TestComponent {
  public readonly author = input<string>();
  public readonly quoteSource = input<string>();
}

describe('Blockquote harness', () => {
  async function setupTest(
    options: { author?: string; quoteSource?: string } = {},
  ): Promise<{
    fixture: ComponentFixture<TestComponent>;
    harness: SkyBlockquoteHarness;
  }> {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentRef.setInput('author', options.author);
    fixture.componentRef.setInput('quoteSource', options.quoteSource);

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyBlockquoteHarness.with({ dataSkyId: 'test-blockquote' }),
    );

    return { fixture, harness };
  }

  it('should get the quote text', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getText()).toBeResolvedTo('Sample testimonial');
  });

  it('should get the author', async () => {
    const { harness } = await setupTest({ author: 'Happy Customer' });

    await expectAsync(harness.getAuthor()).toBeResolvedTo('Happy Customer');
  });

  it('should get the linked author', async () => {
    const { harness } = await setupTest({
      author: 'Happy Customer',
      quoteSource: 'https://example.com/',
    });

    await expectAsync(harness.getAuthor()).toBeResolvedTo('Happy Customer');
  });

  it('should get "Source" as the author when only quoteSource is set', async () => {
    const { harness } = await setupTest({
      quoteSource: 'https://example.com/',
    });

    await expectAsync(harness.getAuthor()).toBeResolvedTo('Source');
  });

  it('should return undefined for the author when there is no attribution', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getAuthor()).toBeResolvedTo(undefined);
  });

  it('should get the quote source', async () => {
    const { harness } = await setupTest({
      author: 'Happy Customer',
      quoteSource: 'https://example.com/',
    });

    await expectAsync(harness.getQuoteSource()).toBeResolvedTo(
      'https://example.com/',
    );
  });

  it('should return undefined for the quote source when it is not set', async () => {
    const { harness } = await setupTest({ author: 'Happy Customer' });

    await expectAsync(harness.getQuoteSource()).toBeResolvedTo(undefined);
  });

  it('should reject when no blockquote matches the data-sky-id', async () => {
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await expectAsync(
      loader.getHarness(SkyBlockquoteHarness.with({ dataSkyId: 'missing' })),
    ).toBeRejected();
  });
});
