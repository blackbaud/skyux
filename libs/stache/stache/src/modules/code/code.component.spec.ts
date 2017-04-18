import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheCodeComponent } from './code.component';
import { StacheCodeTestComponent } from './fixtures/code.component.fixture';

describe('StacheCodeComponent', () => {
  let component: StacheCodeComponent;
  let fixture: ComponentFixture<StacheCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheCodeComponent,
        StacheCodeTestComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheCodeComponent);
    component = fixture.componentInstance;
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
