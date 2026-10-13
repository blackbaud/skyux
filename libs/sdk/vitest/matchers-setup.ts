/**
 * Published as TypeScript source because Angular's `unit-test` builder
 * compiles `setupFiles` as part of the consumer's TypeScript program, and a
 * JavaScript setup file would require `allowJs`. Keep this file to a single
 * import since it compiles with the consumer's compiler options.
 */
import './src/lib/matchers-setup.js';
