import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';
import { provideHrefTesting } from '@skyux/router/testing';

import { SkyActionHubModule } from '../action-hub/action-hub.module';

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
  });

  it('should create empty needs attention component', async () => {
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
      fixture.nativeElement.querySelector('sky-box-content').textContent.trim(),
    ).toEqualLibResourceText('sky_action_hub_needs_attention_empty');
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
      fixture.nativeElement.querySelector('sky-box-content').textContent.trim(),
    ).toEqualLibResourceText('sky_action_hub_needs_attention_empty');
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
      fixture.nativeElement.querySelector('sky-box-content').textContent.trim(),
    ).toEqualLibResourceText('sky_action_hub_needs_attention_empty');
    expect(logService.error).toHaveBeenCalledWith(
      `SkyHrefResolverService is required but was not provided. Unable to resolve http://example.com`,
    );
  });
});
