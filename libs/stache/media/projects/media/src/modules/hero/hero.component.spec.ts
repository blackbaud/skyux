import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  DebugElement
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyHeroModule
} from './hero.module';

import {
  SkyHeroComponent
} from './hero.component';

describe('SkyHeroComponent', () => {
  let component: SkyHeroComponent;
  let fixture: ComponentFixture<SkyHeroComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyHeroModule
      ]
    });

    fixture = TestBed.createComponent(SkyHeroComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should take a whole number and convert it to a valid interval.', () => {
    component.overlayOpacity = '5';
    expect(component.overlayOpacity).toEqual('0.05');

    component.overlayOpacity = '50';
    expect(component.overlayOpacity).toEqual('0.5');

    component.overlayOpacity = '1500';
    expect(component.overlayOpacity).toEqual('1');

    component.overlayOpacity = '-200';
    expect(component.overlayOpacity).toEqual('0');
  });

  it('should default to 0.4 given an invalid input or no input.', () => {
    expect(component.overlayOpacity).toEqual('0.4');

    component.overlayOpacity = '0.6.';
    expect(component.overlayOpacity).toEqual('0.6');

    component.overlayOpacity = 'Invalid input.';
    expect(component.overlayOpacity).toEqual('0.4');
});

  it('should remove any character other than numbers and . from an opacity input.', () => {
    component.overlayOpacity = 'Inva 0 id . inp 5 ut';
    expect(component.overlayOpacity).toEqual('0.5');

    fixture.detectChanges();
    let hero = debugElement.query(By.css('.sky-hero-overlay')).nativeElement;
    expect(hero.style.opacity).toBe('0.5');

    component.overlayOpacity = '20%';
    expect(component.overlayOpacity).toEqual('0.2');

    fixture.detectChanges();
    expect(hero.style.opacity).toBe('0.2');
  });

  it('should set the background overlayOpacity to a valid interval', () => {
    let hero = debugElement.query(By.css('.sky-hero-overlay')).nativeElement;
    component.overlayOpacity = '0.804211';
    expect(component.overlayOpacity).toEqual('0.804211');

    fixture.detectChanges();
    expect(hero.style.opacity).toBe('0.804211');
  });

  it('should, given a backgroundImageUrl, set the background url to the input string.', () => {
    let hero = debugElement.query(By.css('.sky-hero')).nativeElement;
    expect(hero.style.backgroundImage).toBe('');

    component.backgroundImageUrl = '~/foo-image.jpg';
    fixture.detectChanges();
    expect(hero.style.backgroundImage).toContain('~/foo-image.jpg');
  });
});
