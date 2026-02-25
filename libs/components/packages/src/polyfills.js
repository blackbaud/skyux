'use strict';

// Fix for crossvent `global is not defined` error. The crossvent library is used by Dragula,
// which in turn is used by multiple SKY UX components.
// https://github.com/bevacqua/dragula/issues/602
window.global = window;
