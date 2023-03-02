'use strict';

// This is the static js polyfills file for use by the monorepo because project.json polyfills
// configuration does not allow typescript files. It would require cross-project dependencies
// and including the file in tsconfig.json files scope.

// Fix for crossvent `global is not defined` error. The crossvent library is used by Dragula,
// which in turn is used by multiple SKY UX components.
// https://github.com/bevacqua/dragula/issues/602
window.global = window;
