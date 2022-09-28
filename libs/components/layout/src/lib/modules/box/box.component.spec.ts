import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxTestComponent } from './fixtures/box.component.fixture';
import { SkyBoxFixturesModule } from './fixtures/box.module.fixture';

function getBoxEl(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-box');
}

describe('BoxComponent', () => {
  let component: BoxTestComponent;
  let fixture: ComponentFixture<BoxTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoxTestComponent],
      imports: [SkyBoxFixturesModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should assign role attribute when ariaRole is set', () => {
    component.ariaRole = 'region';
    fixture.detectChanges();

    expect(getBoxEl(fixture).getAttribute('role')).toEqual('region');
  });

  it('should assign label attribute when ariaLabel is set', () => {
    component.ariaLabel = 'my box';
    fixture.detectChanges();

    expect(getBoxEl(fixture).getAttribute('aria-label')).toEqual('my box');
  });

  it('should assign role attribute when ariaRole is set', () => {
    component.ariaLabelledBy = 'my-header';
    fixture.detectChanges();

    expect(getBoxEl(fixture).getAttribute('aria-labelledby')).toEqual(
      'my-header'
    );
  });
});
