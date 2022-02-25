import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyActionHubModule } from '../action-hub/action-hub.module';

import { SkyLinkListComponent } from './link-list.component';

describe('Link list component', () => {
  let fixture: ComponentFixture<SkyLinkListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyActionHubModule, RouterTestingModule.withRoutes([])],
    });
    fixture = TestBed.createComponent(SkyLinkListComponent);
  });

  it('should show links', async () => {
    fixture.componentInstance.title = 'Full List';
    fixture.componentInstance.links = [
      {
        label: 'Link 1',
        permalink: {
          url: '#',
        },
      },
      {
        label: 'Link 2',
        permalink: {
          url: '#',
        },
      },
      {
        label: 'Link 3',
        permalink: {
          url: '#',
        },
      },
    ];

    fixture.detectChanges();
    const links = fixture.nativeElement.getElementsByTagName('a');

    expect(links.length).toBe(3);
  });

  it('should disappear when empty', async () => {
    fixture.componentInstance.title = 'Empty List';
    fixture.componentInstance.links = [];

    fixture.detectChanges();

    expect(fixture.nativeElement).not.toHaveText('Empty List');
  });
});
