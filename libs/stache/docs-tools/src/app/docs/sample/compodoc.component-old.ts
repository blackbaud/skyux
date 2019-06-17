// import {
//   Component,
//   OnInit
// } from '@angular/core';

// // Run `npm run compodoc`
// const documentation: any = require('../../../../documentation/documentation.json');

// @Component({
//   selector: 'app-compodoc',
//   templateUrl: './compodoc.component.html'
// })
// export class AppCompodocComponent implements OnInit {

//   public componentConfigs: {}[];

//   public directiveConfigs: {}[];

//   public interfaceConfigs: {}[];

//   public typeAliasConfigs: {}[];

//   public ngOnInit(): void {
//     this.componentConfigs = this.parseDirectiveConfig(documentation.components);
//     this.directiveConfigs = this.parseDirectiveConfig(documentation.directives);

//     this.interfaceConfigs = documentation.interfaces.map((i: any) => {
//       let sourceCode: string = `interface ${i.name} {`;

//       const propertyDefinitions: {}[] = i.properties.map((p: any) => {
//         const optionalIndicator = (p.optional) ? '?' : '';

//         sourceCode += `\n  ${p.name}${optionalIndicator}: ${p.type.replace(/\"/g, '\'')};`;

//         return {
//           type: p.type,
//           name: p.name,
//           description: p.description,
//           optional: p.optional
//         };
//       });

//       sourceCode += '\n}';

//       return {
//         name: i.name,
//         type: i.type,
//         description: i.description,
//         propertyDefinitions,
//         sourceCode
//       };
//     });

//     if (documentation.miscellaneous && documentation.miscellaneous.typealiases) {
//       this.typeAliasConfigs = documentation.miscellaneous.typealiases.map((alias: any) => {
//         return {
//           name: alias.name,
//           description: alias.description,
//           sourceCode: `type ${alias.name} = ${alias.rawtype.replace(/\"/g, '\'')};`
//         };
//       });
//     }
//   }

//   private parseDirectiveConfig(config: any[]): any {
//     return config.map((directive: any) => {

//       const propertyDefinitions: {}[] = directive.inputsClass.map((input: any) => {
//         return {
//           type: input.type,
//           name: input.name,
//           decorator: 'Input',
//           description: input.description
//         };
//       });

//       return {
//         description: directive.description,
//         name: directive.name,
//         selector: directive.selector,
//         propertyDefinitions
//       };
//     });
//   }
// }
