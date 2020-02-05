import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  DemoFixturesModule
} from './fixtures/demo-fixtures.module';

import {
  DemoFixtureComponent
} from './fixtures/demo.component.fixture';

describe('Demo component', () => {

  let fixture: ComponentFixture<DemoFixtureComponent>;

  function showControlPanel(): void {
    const headingButton = fixture.nativeElement.querySelector('[data-test-selector="sky-docs-demo-heading-button"]');
    headingButton.click();
    fixture.detectChanges();
  }

  function resetControlPanel(): void {
    const resetButton = fixture.nativeElement.querySelector('[data-test-selector="sky-docs-demo-control-panel-reset-button"]');
    resetButton.click();
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DemoFixturesModule
      ]
    });

    fixture = TestBed.createComponent(DemoFixtureComponent);
  });

  it('should allow for custom headings', () => {
    fixture.detectChanges();

    const headingElement = fixture.nativeElement.querySelector('[data-test-selector="sky-docs-demo-heading-text"]');

    fixture.componentInstance.heading = undefined;
    fixture.detectChanges();

    expect(headingElement).toHaveText('Demo');

    fixture.componentInstance.heading = 'Foobar';
    fixture.detectChanges();

    expect(headingElement).toHaveText('Foobar');
  });

  describe('control panel component', () => {
    it('should expose a `reset` emitter', () => {
      const spy = spyOn(fixture.componentInstance, 'onDemoReset').and.callThrough();
      fixture.detectChanges();

      showControlPanel();
      resetControlPanel();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
