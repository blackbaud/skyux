import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyHrefModule } from '@skyux/router';
import { SkyHrefTestingModule } from '@skyux/router/testing';

import { SkyActionHubModule } from '../action-hub/action-hub.module';

import { SkyNeedsAttentionComponent } from './needs-attention.component';

describe('Needs attention component', () => {
  it('should create needs attention component', async () => {
    TestBed.configureTestingModule({
      imports: [
        SkyActionHubModule,
        SkyHrefModule,
        SkyHrefTestingModule.with({ userHasAccess: true }),
      ],
      providers: [provideRouter([])],
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
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('a').length).toBe(1);
  });

  it('should create empty needs attention component', async () => {
    TestBed.configureTestingModule({
      imports: [
        SkyActionHubModule,
        SkyHrefTestingModule.with({ userHasAccess: true }),
      ],
      providers: [provideRouter([])],
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
      imports: [
        SkyActionHubModule,
        SkyHrefTestingModule.with({ userHasAccess: false }),
      ],
      providers: [provideRouter([])],
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
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('a').length).toBe(0);
    await expectAsync(
      fixture.nativeElement.querySelector('sky-box-content').textContent.trim(),
    ).toEqualLibResourceText('sky_action_hub_needs_attention_empty');
  });
});
