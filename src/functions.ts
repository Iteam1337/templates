import fs from 'fs'
import path from 'path'

export function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })

  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

export const write = (
  from: string,
  to: string,
  fileName: string,
  content?: any
) => {
  const RENAMABLE_FILES_MAP: { [key: string]: string } = {
    _gitignore: '.gitignore',
  }

  const targetPath = RENAMABLE_FILES_MAP[fileName]
    ? path.join(to, RENAMABLE_FILES_MAP[fileName])
    : path.join(to, fileName)

  if (content) {
    fs.writeFileSync(targetPath, content)
  } else {
    console.log(to, fileName, content)
    copy(path.join(from, fileName), targetPath)
  }
}

export function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}
