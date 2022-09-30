import fs from 'fs';
import path from 'path';
import { RENAMABLE_FILES_MAP } from './constants';
import * as types from './types';

export const isValidProjectName = (name: string) =>
  /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name);

export const getPkgManagerFromUserAgent = (userAgent?: string) =>
  userAgent?.split(' ')[0]?.split('/')[0];

export const isNotPackageJson = (name: string) => name !== 'package.json';

export const toValidProjectName = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-');

export const validateProjectName = (val: string) =>
  fs.existsSync(val)
    ? 'Target directory already exists'
    : !isValidProjectName(val)
    ? `Not a valid package name, try ${toValidProjectName(val)}`
    : true;

export const installInstructionsByPkgManager = (pkgManager: string) => {
  const instructions: Record<string, string> = {
    yarn: `  yarn \n   yarn dev`,
    default: `  ${pkgManager} install \n  ${pkgManager} run dev`,
  };

  return instructions[pkgManager] ?? instructions.default;
};

export const getTargetPath = (targetPath: string, fileName: string) =>
  path.join(targetPath, RENAMABLE_FILES_MAP[fileName] ?? fileName);

export const handleError = (error: Error) => console.error(error.message);

export const templateAsSelectOption = (
  template: types.TemplateVariant
): types.SelectOption<types.TemplateVariant> => ({
  title: template.color(template.name),
  value: template,
});
