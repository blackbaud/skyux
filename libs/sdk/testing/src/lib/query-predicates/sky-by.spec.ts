import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from '@skyux-sdk/testing';
import { SkyBy } from './sky-by';

@Component({
  template: `
    <div data-sky-id="my-sky-id"></div>
    <div id="no-sky-id"></div>
  `,
})
class TestComponent {}

describe('SkyBy', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestComponent);
  });

  describe('skyId', () => {
    it('should find an element with the appropriate data-sky-id attribute if it exists', () => {
      fixture.detectChanges();
      const elementWithDataSkyId: DebugElement = fixture.debugElement.query(
        SkyBy.skyId('my-sky-id')
      );

      expect(elementWithDataSkyId.nativeElement).toExist();
      expect(
        elementWithDataSkyId.nativeElement.getAttribute('data-sky-id')
      ).toEqual('my-sky-id');
    });

    it('should not find an element with a data-sky-id that does not exist', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#no-sky-id'))).toExist();
      expect(
        fixture.debugElement.query(SkyBy.skyId('different-sky-id'))
      ).not.toExist();
    });
  });
});
