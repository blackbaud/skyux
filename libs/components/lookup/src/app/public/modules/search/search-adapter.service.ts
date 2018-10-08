import {
  ElementRef,
  Injectable,
  Renderer
} from '@angular/core';

@Injectable()
export class SkySearchAdapterService {

  constructor(private renderer: Renderer) { }

  public selectInput(searchEl: ElementRef) {
    this.renderer.invokeElementMethod(this.getInputEl(searchEl), 'select');
  }

  public focusInput(searchEl: ElementRef) {
    this.renderer.invokeElementMethod(this.getInputEl(searchEl), 'focus');
  }

  public startInputAnimation(searchEl: ElementRef) {
    let buttonWidth = this.getSearchOpenButtonEl(searchEl).clientWidth;
    let offsetWidth = this.getSearchContainerEl(searchEl).offsetLeft;
    let minWidth = buttonWidth + offsetWidth;

    this.getInputContainerEl(searchEl).style.minWidth = minWidth.toString() + 'px';

    this.renderer.setElementStyle(this.getInputContainerEl(searchEl),
      'min-width', minWidth.toString() + 'px');
  }

  public endInputAnimation(searchEl: ElementRef) {
    this.renderer.setElementStyle(this.getInputContainerEl(searchEl),
      'min-width', undefined);
  }

  private getInputContainerEl(searchEl: ElementRef) {
    return searchEl.nativeElement.querySelector('.sky-search-input-container');
  }

  private getSearchOpenButtonEl(searchEl: ElementRef) {
    return searchEl.nativeElement.querySelector('.sky-search-btn-open');
  }

  private getSearchContainerEl(searchEl: ElementRef) {
    return searchEl.nativeElement.querySelector('.sky-search-container');
  }

  private getInputEl(searchEl: ElementRef) {
    return searchEl.nativeElement.querySelector('input');
  }
}
