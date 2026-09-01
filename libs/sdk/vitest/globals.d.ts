import type { SkyVitestMatchers } from './src/lib/matchers/matchers.js';

import 'vitest';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
  interface Matchers<T = any> extends SkyVitestMatchers {}
}
