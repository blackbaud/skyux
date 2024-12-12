import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyHrefModule } from '@skyux/router';

import { SkyActionHubModule } from '../action-hub/action-hub.module';

import { SkyNeedsAttentionComponent } from './needs-attention.component';

describe('Needs attention component', () => {
  let fixture: ComponentFixture<SkyNeedsAttentionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyActionHubModule,
        SkyHrefModule,
        RouterTestingModule.withRoutes([]),
      ],
    });

    fixture = TestBed.createComponent(SkyNeedsAttentionComponent);
  });

  it('should create needs attention component', () => {
    fixture.componentInstance.items = [
      {
        title: 'Item 1',
        message: 'Message details 1',
        permalink: {
          url: '#',
        },
      },
    ];
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
