import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { LinkListFixtureComponent } from './fixtures/link-list-fixture.component';
import { SkyLinkListComponent } from './link-list.component';
import { SkyLinkListModule } from './link-list.module';

describe('Link list component', () => {
  let fixture: ComponentFixture<SkyLinkListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyLinkListModule, LinkListFixtureComponent],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(SkyLinkListComponent);
  });

  it('should show links', () => {
    fixture.componentRef.setInput('headingText', 'Full List');
    fixture.componentRef.setInput('links', [
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
    ]);

    fixture.detectChanges();
    const links = fixture.nativeElement.getElementsByTagName('a');

    expect(links.length).toBe(3);
  });

  it('should disappear when empty', () => {
    fixture.componentRef.setInput('headingText', 'Empty List');
    fixture.componentRef.setInput('links', []);

    fixture.detectChanges();

    expect(fixture.nativeElement).not.toHaveText('Empty List');
  });

  it('should show links with link items', async () => {
    const fixture = TestBed.createComponent(LinkListFixtureComponent);
    fixture.componentRef.setInput('showLinks', true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.nativeElement.querySelector('ul.sky-link-list'),
    ).toBeVisible();
  });

  it('should be accessible', async () => {
    const fixture = TestBed.createComponent(LinkListFixtureComponent);
    fixture.componentRef.setInput('showLinks', true);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
