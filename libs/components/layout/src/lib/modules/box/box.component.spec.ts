import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyBoxModule } from './box.module';

@Component({
  selector: 'sky-box-test',
  template: `
    <sky-box
      [ariaLabel]="ariaLabel"
      [ariaLabelledBy]="ariaLabelledBy"
      [ariaRole]="ariaRole"
    >
      <sky-box-header>
        <h2 class="sky-font-heading-2" id="my-header">Header</h2>
      </sky-box-header>
      <sky-box-controls>
        <button class="sky-btn sky-btn-default sky-btn-icon" type="button">
          X
        </button>
      </sky-box-controls>
      <sky-box-content> Lorem ipsum dolor sit amet. </sky-box-content>
    </sky-box>
  `,
})
export class BoxTestComponent {
  public ariaLabel: string;
  public ariaLabelledBy: string;
  public ariaRole: string;
}

function getBoxEl(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-box');
}

describe('BoxComponent', () => {
  let component: BoxTestComponent;
  let fixture: ComponentFixture<BoxTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoxTestComponent],
      imports: [SkyBoxModule],
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
