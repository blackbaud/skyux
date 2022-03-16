import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { StacheLayoutBlankComponent } from './layout-blank.component';
import { StacheLayoutModule } from './layout.module';

describe('StacheLayoutBlankComponent', () => {
  let component: StacheLayoutBlankComponent;
  let fixture: ComponentFixture<StacheLayoutBlankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StacheLayoutModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(StacheLayoutBlankComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should have an identifier input', () => {
    component.identifier = 'test';
    fixture.detectChanges();
    expect(component.identifier).toBe('test');
  });

  it('should set the input, identifier, to blank by default', () => {
    fixture.detectChanges();
    expect(component.identifier).toBe('blank');
  });

  it('should return the classname when getClassName is called', () => {
    let className = component.getClassName();
    fixture.detectChanges();
    expect(className).toBe('stache-layout-blank');
  });

  it('should return the classname based on the identifier', () => {
    component.identifier = 'test';
    let className = component.getClassName();
    fixture.detectChanges();
    expect(className).toBe('stache-layout-test');
  });
});
