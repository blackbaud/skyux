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
  StacheCodeComponent
} from './code.component';

import {
  StacheCodeModule
} from './code.module';

import {
  StacheCodeTestComponent
} from './fixtures/code.component.fixture';

describe('StacheCodeComponent', () => {
  let fixture: ComponentFixture<StacheCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheCodeTestComponent
      ],
      imports: [
        StacheCodeModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheCodeComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should transclude content', () => {
    const testFixture = TestBed.createComponent(StacheCodeTestComponent);

    testFixture.detectChanges();

    const codeElement = testFixture.debugElement.query(By.css('.stache-code')).nativeElement;
    expect(codeElement).toHaveText('some code');
  });
});
