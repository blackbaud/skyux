// tslint:disable:no-null-keyword

// Polyfill for Element.closest().
// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
// Returns the closest ancestor of the current element (or the current element itself) which
// matches the selectors given in parameter. If there isn't such an ancestor, it returns null.
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s: any) {
    let el = this;
    /* istanbul ignore if */
    if (!document.documentElement.contains(el)) {
      return null;
    }
    do {
        if (el.matches(s)) {
          return el;
        }
        el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

// Polyfill for Element.matches().
// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
// Returns true if the element would be selected by the specified selector string.
if (!Element.prototype.matches) {
  /* istanbul ignore next */
  Element.prototype.matches = (Element.prototype as any).msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
