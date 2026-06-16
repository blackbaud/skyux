import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyChartControls } from './chart-controls';

describe('Chart controls component', () => {
  let fixture: ComponentFixture<SkyChartControls>;

  function getButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('button');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyChartControls],
      providers: [provideNoopSkyAnimations()],
    });

    fixture = TestBed.createComponent(SkyChartControls);
  });

  it('should render a context-menu dropdown button', () => {
    fixture.componentRef.setInput('headingText', 'My chart');
    fixture.detectChanges();

    expect(getButton()).toExist();
  });

  it('should label the menu with the heading text', () => {
    fixture.componentRef.setInput('headingText', 'My chart');
    fixture.detectChanges();

    expect(getButton()?.getAttribute('aria-label')).toBe(
      'Context menu for My chart',
    );
  });

  describe('a11y', () => {
    it('should be accessible', async () => {
      fixture.componentRef.setInput('headingText', 'My chart');
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
