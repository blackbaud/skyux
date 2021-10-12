import {
  Component
} from '@angular/core';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  SkyDocsDemoControlPanelRadioChoice
} from './demo-control-panel-radio-choice';

import {
  SkyDocsDemoModule
} from './demo.module';

//#region Helpers
@Component({
  selector: 'sky-radio-group-test',
  template: `
    <sky-docs-demo-control-panel-radio-group
      heading="Disabled radio group"
      propertyName="disabledRadioGroup"
      [choices]="choices"
      [disabled]="disabled"
      [initialValue]="'red'"
    >
    </sky-docs-demo-control-panel-radio-group>
  `
})
class TestComponent {

  public alignmentChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' }
  ];

  public disabled: boolean;

}

function getRadioInputs(fixture: ComponentFixture<TestComponent>): NodeListOf<HTMLInputElement> {
  return fixture.nativeElement.querySelectorAll('input');
}
//#endregion

describe('Demo control panel radio group', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent
      ],
      imports: [
        SkyDocsDemoModule
      ]
    });

    fixture = TestBed.createComponent(
      TestComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be enabled by default', () => {
    const radioInputs = getRadioInputs(fixture);
    for (let i = 0; i < radioInputs.length; i++) {
      expect(radioInputs[i].disabled).toEqual(false);
    }
  });

  it('should disable the radio inputs when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const radioInputs = getRadioInputs(fixture);
    for (let i = 0; i < radioInputs.length; i++) {
      expect(radioInputs[i].disabled).toEqual(true);
    }
  });
});
