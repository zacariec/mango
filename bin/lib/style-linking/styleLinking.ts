import glob from 'fast-glob';
import fs from 'fs-extra';
import _Directories from '../utils/_directorys';

/**
 * Creates a style sheet based on the fileKey, if it's a section or layout it will wrap in {% style %} tags, otherwise <style> tags.
 * @param content - a Buffer from FS to be passed, this is the inital content before replacing with the inline style.
 * @param fileKey - a String to be passed, this is the file name with the base directory.
 */
const createStyleSheet = (content: Buffer, fileKey: string): string => {
  const styleStartTags = (fileKey.includes('section/') || fileKey.includes('layout/')) ? '{% style %}' : '<style>';
  const styleEndTags = (fileKey.includes('section/') || fileKey.includes('layout/')) ? '{% endstyle %}' : '</style>';
  return `${styleStartTags}
    ${content.toString()}
  ${styleEndTags}`;
};

/**
 * Inserts a stylesheet into the file in the dist directory.
 * @param fileKey - a String to be passed with base directory & file name.
 * @param fileContents - contents of the file.
 * @param stylesheetFile - The linked stylesheet file to be used.
 * @param templateString - the string to be replaced, usually <!--mango-link: something/mango.something.css-->
 */
const insertStyleSheet = async (fileKey: string, fileContents: string, stylesheetFile: string, templateString: string): Promise<void> => {
  const styleSheet: Buffer = await fs.readFile(`${_Directories.distAssetsRoot}/${stylesheetFile}`);
  const styleSheetContent = createStyleSheet(styleSheet, fileKey);
  const newFileContents = fileContents.replace(templateString, styleSheetContent);
  await fs.writeFile(fileKey, newFileContents);
}

/**
 * Function to inline styles into their respective file & space.
 * @param fileKey - a base/name.liquid string or null to glob all liquid files for testing.
 */
const linkStyles = async (fileKey: string | null): Promise<void> => {
  const liquidFiles: string[] = (fileKey !== null)
    ? [fileKey]
    : await glob([`${_Directories.productionRoot}/**/*.liquid`]);

  const linkRegex = /<!--mango-link:(.*?)-->/gm;

  for await (const liquidFile of liquidFiles) {
    const fileBuffer: Buffer = await fs.readFile(liquidFile);
    const fileContents: string = fileBuffer.toString();
    const fileContentsMatch: string[] = fileContents.match(linkRegex);

    if (fileContentsMatch && fileContentsMatch.length) {
      for await (const match of fileContentsMatch) {
        const stylesheetFile: string = match.match(/<!--mango-link:(.*?)-->/)[1].trim();
        await insertStyleSheet(liquidFile, fileContents, stylesheetFile, match)
      }
    }
  }
};

export default linkStyles;
