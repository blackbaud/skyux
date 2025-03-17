import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyHrefModule } from '@skyux/router';
import { SkyHrefTestingModule } from '@skyux/router/testing';

import { SkyActionHubModule } from '../action-hub/action-hub.module';

import { SkyNeedsAttentionComponent } from './needs-attention.component';

describe('Needs attention component', () => {
  let fixture: ComponentFixture<SkyNeedsAttentionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyActionHubModule,
        SkyHrefModule,
        SkyHrefTestingModule.with({ userHasAccess: true }),
      ],
      providers: [provideRouter([])],
    });

    fixture = TestBed.createComponent(SkyNeedsAttentionComponent);
  });

  it('should create needs attention component', () => {
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
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should create empty needs attention component', async () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    await expectAsync(
      fixture.nativeElement.querySelector('sky-box-content').textContent.trim(),
    ).toEqualLibResourceText('sky_action_hub_needs_attention_empty');
  });
});
