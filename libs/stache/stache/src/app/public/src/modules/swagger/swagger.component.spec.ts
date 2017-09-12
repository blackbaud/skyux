import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheSwaggerComponent } from './swagger.component';

describe('StacheSwaggerComponent', () => {
  // tslint:disable-next-line:max-line-length
  const url = 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v2.0/json/api-with-examples.json';
  let component: StacheSwaggerComponent;
  let fixture: ComponentFixture<StacheSwaggerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheSwaggerComponent
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StacheSwaggerComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should have a swaggerUrl input', () => {
    component.swaggerUrl = url;
    fixture.detectChanges();
    expect(component.swaggerUrl).toBe(url);
  });

  it('should render the Swaggger UI given a valid url', () => {
    component['swaggerUrl'] = url;
    fixture.detectChanges();
    let el = fixture.debugElement.nativeElement.querySelector('.swagger-ui');
    expect(el).toExist();
  });
});
