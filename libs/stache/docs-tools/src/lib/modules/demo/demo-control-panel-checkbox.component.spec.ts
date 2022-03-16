import { Component } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyDocsDemoModule } from './demo.module';

//#region Helpers
@Component({
  selector: 'sky-checkbox-test',
  template: `
    <sky-docs-demo-control-panel-checkbox
      label="Disabled checkbox"
      propertyName="disabledCheckbox"
      [disabled]="disabled"
    >
    </sky-docs-demo-control-panel-checkbox>
  `,
})
class TestComponent {
  public disabled: boolean;
}

function getCheckboxInput(
  fixture: ComponentFixture<TestComponent>
): HTMLInputElement {
  return fixture.nativeElement.querySelector('input');
}
//#endregion

describe('Demo control panel checkbox', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyDocsDemoModule],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be enabled by default', () => {
    const checkbox = getCheckboxInput(fixture);
    expect(checkbox.disabled).toEqual(false);
  });

  it('should disable the checkbox when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const checkbox = getCheckboxInput(fixture);
    expect(checkbox.disabled).toEqual(true);
  });
});
