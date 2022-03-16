import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyHeroHeadingComponent } from './hero-heading.component';

describe('SkyHeroHeadingComponent', () => {
  let component: SkyHeroHeadingComponent;
  let fixture: ComponentFixture<SkyHeroHeadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkyHeroHeadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyHeroHeadingComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should default the text color to white by default', () => {
    const el = fixture.nativeElement.querySelector('.sky-hero-heading');
    // Different browsers return the color value as rgb or hex.
    const textColorHex: string = '#fff';
    const textColorRGB: string = 'rgb(255, 255, 255)';

    const TEXT_COLOR: string =
      el.style.color.indexOf('rgb') > -1 ? textColorHex : textColorRGB;

    fixture.detectChanges();
    expect(el.style.color).toBe(TEXT_COLOR);
  });

  it('should adjust the text color based on heroTextColor input', () => {
    const el = fixture.nativeElement.querySelector('.sky-hero-heading');
    // Different browsers return the color value as rgb or hex.
    const textColorHex: string = '#000';
    const textColorRGB: string = 'rgb(0, 0, 0)';
    component.heroTextColor = textColorHex;

    const TEXT_COLOR: string =
      el.style.color.indexOf('rgb') > -1 ? textColorHex : textColorRGB;

    fixture.detectChanges();
    expect(el.style.color).toBe(TEXT_COLOR);
  });
});
