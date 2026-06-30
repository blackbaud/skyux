import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyLogService } from '@skyux/core';
import { SkyBoxHarness } from '@skyux/layout/testing';
import { provideHrefTesting } from '@skyux/router/testing';

import { SkyActionHubModule } from '../action-hub/action-hub.module';

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { SkyNeedsAttentionComponent } from './needs-attention.component';

describe('Needs attention component', () => {
  it('should create needs attention component', async () => {
    TestBed.configureTestingModule({
      imports: [SkyActionHubModule],
      providers: [
        provideRouter([]),
        provideHrefTesting({ userHasAccess: true }),
      ],
    });
    const fixture = TestBed.createComponent(SkyNeedsAttentionComponent);
    fixture.componentRef.setInput('items', [
      {
        title: 'Item 1',
        message: 'Message details 1',
        permalink: {
          url: 'http://example.com',
        },
      },
      {
        title: undefined,
        click: (): void => undefined,
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('a').length).toBe(1);

    const box =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(SkyBoxHarness);
    expect(box).toBeTruthy();
    await expectAsync(box.getHeadingText()).toBeResolvedTo('Needs attention');
  });

  it('should hide needs attention box when no items are available', async () => {
    TestBed.configureTestingModule({
      imports: [SkyActionHubModule],
      providers: [
        provideRouter([]),
        provideHrefTesting({ userHasAccess: true }),
      ],
    });
    const fixture = TestBed.createComponent(SkyNeedsAttentionComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
    await expectAsync(
      TestbedHarnessEnvironment.loader(fixture).getHarness(SkyBoxHarness),
    ).toBeRejected();
  });

  it('should check access', async () => {
    TestBed.configureTestingModule({
      imports: [SkyActionHubModule],
      providers: [
        provideRouter([]),
        provideHrefTesting({ userHasAccess: false }),
      ],
    });
    const fixture = TestBed.createComponent(SkyNeedsAttentionComponent);
    fixture.componentRef.setInput('items', [
      {
        title: 'Item 1',
        message: 'Message details 1',
        permalink: {
          url: 'http://example.com',
        },
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('a').length).toBe(0);
    await expectAsync(
      TestbedHarnessEnvironment.loader(fixture).getHarness(SkyBoxHarness),
    ).toBeRejected();
  });

  it('should log when resolver is not available', async () => {
    TestBed.configureTestingModule({
      imports: [SkyActionHubModule],
      providers: [provideRouter([])],
    });
    const logService = TestBed.inject(SkyLogService);
    spyOn(logService, 'error');
    const fixture = TestBed.createComponent(SkyNeedsAttentionComponent);
    fixture.componentRef.setInput('items', [
      {
        title: 'Item 1',
        message: 'Message details 1',
        permalink: {
          url: 'http://example.com',
        },
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('a').length).toBe(0);
    await expectAsync(
      TestbedHarnessEnvironment.loader(fixture).getHarness(SkyBoxHarness),
    ).toBeRejected();
    expect(logService.error).toHaveBeenCalledWith(
      `SkyHrefResolverService is required but was not provided. Unable to resolve http://example.com`,
    );
  });
});
