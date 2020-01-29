import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

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
