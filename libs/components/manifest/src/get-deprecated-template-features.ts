// import { SkyManifestTemplateFeatureDeprecations } from './types/_deprecated';
// import { SkyManifestParentDefinition } from './types/basic';
// import type { SkyManifestPublicApi } from './types/manifest';
// import {
//   getDirectiveInputsAndOutputs,
//   isDirectiveDefinition,
//   isPipeDefinition,
// } from './utils';

// function getDeprecatedProperties(definition: SkyManifestParentDefinition) {
//   const deprecatedProperties = definition.children?.filter(c => c.isDeprecated)??[];

//   const result = [];

//   if (deprecatedProperties.length > 0) {
//     {
//       isDeprecated: false,
//       properties: deprecatedProperties.map(
//         ({ deprecationReason, name }) => ({
//           deprecationReason,
//           name,
//         }),
//       ),
//       selector: definition.selector,
//     });
//   }
// }

// /**
//  * Returns information about deprecated template features (directives,
//  * components, and pipes) in the SKY UX public API.
//  */
// export function getDeprecatedTemplateFeatures(
//   publicApi: SkyManifestPublicApi,
// ): SkyManifestTemplateFeatureDeprecations {
//   const deprecations: SkyManifestTemplateFeatureDeprecations = {
//     components: [],
//     directives: [],
//     pipes: [],
//   };

//   const packageEntries = Object.entries(publicApi.packages) as [
//     string,
//     SkyManifestParentDefinition[],
//   ][];

//   for (const [, definitions] of packageEntries) {
//     for (const definition of definitions) {
//       if (isDirectiveDefinition(definition)) {
//         const category: keyof SkyManifestTemplateFeatureDeprecations =
//           definition.kind === 'component' ? 'components' : 'directives';

//         if (definition.isDeprecated) {
//           deprecations[category].push({
//             isDeprecated: true,
//             deprecationReason: definition.deprecationReason,
//             selector: definition.selector,
//           });
//         } else {

//         }
//       } else if (isPipeDefinition(definition) && definition.isDeprecated) {
//         deprecations.pipes.push({
//           deprecationReason: definition.deprecationReason,
//           templateBindingName: definition.templateBindingName,
//         });
//       }
//     }
//   }

//   return deprecations;
// }
