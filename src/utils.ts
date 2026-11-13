import path from 'path'
import { RENAMABLE_FILES_MAP } from './constants'

export const isValidPkgName = (name: string) =>
  /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)

export const isNotPackageJson = (name: string) => name !== 'package.json'

export const toValidPackageName = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')

export const getTargetPath = (targetPath: string, fileName: string) =>
  path.join(targetPath, RENAMABLE_FILES_MAP[fileName] ?? fileName)
