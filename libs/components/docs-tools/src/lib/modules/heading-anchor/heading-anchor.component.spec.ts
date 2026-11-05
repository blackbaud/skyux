import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expect } from '@skyux-sdk/testing';

import { SkyDocsHeadingAnchorComponent } from './heading-anchor.component';

describe('Heading anchor component', () => {
  let fixture: ComponentFixture<SkyDocsHeadingAnchorComponent>;

  async function render(headingLevel: unknown): Promise<HTMLElement> {
    fixture.componentRef.setInput('anchorId', 'example');
    fixture.componentRef.setInput('headingText', 'Example');
    fixture.componentRef.setInput('headingLevel', headingLevel);
    fixture.detectChanges();
    await fixture.whenStable();

    return fixture.nativeElement as HTMLElement;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    fixture = TestBed.createComponent(SkyDocsHeadingAnchorComponent);
  });

  it('should render the heading at the specified level', async () => {
    const el = await render('4');

    expect(el.querySelector('h4')).toExist();
  });

  it('should fall back to an h2 for an invalid heading level', async () => {
    const el = await render(9);

    expect(el.querySelector('h2')).toExist();
  });
});
