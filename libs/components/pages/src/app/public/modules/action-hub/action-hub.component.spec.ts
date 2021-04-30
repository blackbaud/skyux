import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyActionHubComponent } from './action-hub.component';
import { SkyActionHubModule } from './action-hub.module';

describe('Action hub component', async () => {
  let fixture: ComponentFixture<SkyActionHubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyActionHubModule]
    });
    fixture = TestBed.createComponent(SkyActionHubComponent);
  });

  it('should show the title', () => {
    fixture.componentInstance.data = {
      needsAttention: [],
      recentLinks: [],
      relatedLinks: [],
      title: 'Test Hub'
    };

    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1).toHaveText('Test Hub');
  });

  it('should show related links', async () => {
    fixture.componentInstance.data = {
      needsAttention: [],
      recentLinks: [],
      relatedLinks: [
        {
          label: 'Test Link',
          permalink: {
            url: '#'
          }
        }
      ],
      title: 'Test Hub'
    };

    fixture.detectChanges();
    await fixture.whenStable();
    const link1 = fixture.nativeElement.querySelector(
      'sky-link-list[ng-reflect-title="Related Links"] a'
    );
    expect(link1).toHaveText('Test Link');
  });

  it('should use a config object', () => {
    fixture.componentInstance.data = {
      needsAttention: [
        {
          title: 'Test item',
          permalink: {
            url: '#'
          }
        }
      ],
      recentLinks: [
        {
          label: 'Recent Link',
          permalink: {
            url: '#'
          }
        }
      ],
      relatedLinks: [
        {
          label: 'Test Link',
          permalink: {
            url: '#'
          }
        }
      ],
      title: 'Test Hub'
    };
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1).toHaveText('Test Hub');
    const link1 = fixture.nativeElement.querySelector(
      'sky-link-list[ng-reflect-title="Related Links"] a'
    );
    expect(link1).toHaveText('Test Link');
    const recent1 = fixture.nativeElement.querySelector(
      'sky-link-list[ng-reflect-title="Recently Accessed"] a'
    );
    expect(recent1).toHaveText('Recent Link');
  });

  it('should show loading', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);
    const skyWait = fixture.nativeElement.querySelector('.sky-wait');
    expect(skyWait).toExist();
  }));
});
