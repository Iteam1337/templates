import fs from 'fs';
import path from 'path';

export const copyDir = (srcDir: string, destDir: string) => {
  fs.mkdirSync(destDir, { recursive: true });

  const prepareAndCopy = (file: string) => {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  };

  fs.readdirSync(srcDir).forEach(prepareAndCopy);
};

export const write = (to: string, content: string) =>
  fs.writeFileSync(to, content);

export const copy = (src: string, dest: string) =>
  fs.statSync(src).isDirectory()
    ? copyDir(src, dest)
    : fs.copyFileSync(src, dest);
