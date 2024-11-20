import { DeclarationReflection, ReflectionKind } from 'typedoc';

import { getEntryPointsReflections } from './get-entry-points-reflections';
import { getProjects } from './get-projects';
import { SkyManifestPackageSection } from './types/manifest-types';
import { getClass } from './utility/get-class';
import { getDecorator } from './utility/get-decorator';
import { getDirective } from './utility/get-directive';
import { getEnum } from './utility/get-enum';
import { getFunction } from './utility/get-function';
import { getInterface } from './utility/get-interface';
import { getPipe } from './utility/get-pipe';
import { getTypeAlias } from './utility/get-type-alias';
import { getVariable } from './utility/get-variable';
import { sortMapByKey } from './utility/maps';

export type PackagesMap = Map<string, PackageSectionsMap>;
type PackageSectionsMap = Map<string, SkyManifestPackageSection>;

function handleClassKind(
  child: DeclarationReflection,
  section: SkyManifestPackageSection,
): void {
  const decoratorName = getDecorator(child);

  switch (decoratorName) {
    case 'Injectable': {
      section.services.push(getClass(child));
      break;
    }

    case 'Component':
    case 'Directive': {
      section.directives.push(getDirective(child));
      break;
    }

    case 'NgModule': {
      section.modules.push(getClass(child));
      break;
    }

    case 'Pipe': {
      section.pipes.push(getPipe(child));
      break;
    }

    default: {
      section.classes.push(getClass(child));
      break;
    }
  }
}

function assignChildToSection(
  child: DeclarationReflection,
  section: SkyManifestPackageSection,
): void {
  switch (child.kind) {
    case ReflectionKind.Class: {
      handleClassKind(child, section);
      break;
    }

    case ReflectionKind.TypeAlias: {
      section.typeAliases.push(getTypeAlias(child));
      break;
    }

    case ReflectionKind.Enum: {
      section.enumerations.push(getEnum(child));
      break;
    }

    case ReflectionKind.Function: {
      section.functions.push(getFunction(child));
      break;
    }

    case ReflectionKind.Interface: {
      section.interfaces.push(getInterface(child));
      break;
    }

    case ReflectionKind.Variable: {
      section.variables.push(getVariable(child));
      break;
    }

    default: {
      throw new Error(
        `Unhandled type encountered when processing '${child.name}'.`,
      );
    }
  }
}

function getSectionName(filePath: string): string {
  return filePath.split('src/lib/modules/')?.[1]?.split('/')[0] ?? 'root';
}

export async function getPublicApi(): Promise<PackagesMap> {
  const nxProjects = await getProjects();

  const packages: PackagesMap = new Map<string, PackageSectionsMap>();

  for (const {
    entryPoints,
    packageName,
    projectName,
    projectRoot,
  } of nxProjects) {
    console.log(`Creating manifest for ${projectName}...`);

    const entryPointReflections = await getEntryPointsReflections({
      entryPoints,
      packageName,
      projectRoot,
    });

    for (const refl of entryPointReflections) {
      if (refl.children) {
        const sections: PackageSectionsMap =
          packages.get(refl.entryName) ??
          new Map<string, SkyManifestPackageSection>();

        for (const child of refl.children) {
          const filePath = child.sources?.[0].fullFileName;

          if (!filePath || filePath.endsWith('/index.ts')) {
            continue;
          }

          const sectionName = getSectionName(filePath);
          const section: SkyManifestPackageSection = sections.get(
            sectionName,
          ) ?? {
            classes: [],
            components: [],
            directives: [],
            enumerations: [],
            functions: [],
            interfaces: [],
            modules: [],
            pipes: [],
            services: [],
            typeAliases: [],
            variables: [],
          };

          assignChildToSection(child, section);

          sections.set(sectionName, section);
        }

        packages.set(refl.entryName, sortMapByKey(sections));
      }
    }
  }

  return packages;
}
