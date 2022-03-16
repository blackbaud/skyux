import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyCodeComponent
} from './code.component';

import {
  SkyCodeModule
} from './code.module';

import {
  SkyCodeTestComponent
} from './fixtures/code.component.fixture';

describe('SkyCodeComponent', () => {
  let fixture: ComponentFixture<SkyCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SkyCodeTestComponent
      ],
      imports: [
        SkyCodeModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkyCodeComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should transclude content', () => {
    const testFixture = TestBed.createComponent(SkyCodeTestComponent);

    testFixture.detectChanges();

    const codeElement = testFixture.debugElement.query(By.css('.sky-code')).nativeElement;
    expect(codeElement).toHaveText('some code');
  });
});
