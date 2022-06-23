import fs from 'fs-extra';
import { Ora } from 'ora';
import _Directories from '../utils/_directorys';
import { auditDirectoryFiles } from '../utils/_fsUtils';

const auditSnippets = async (spinner: Ora): Promise<string[]> => {
  const { snippetsRoot }: { snippetsRoot: string } = _Directories;
  spinner.stopAndPersist({
    symbol: '✂️',
    text: `Reading snippets from ${snippetsRoot}`,
  });
  // get all the snippet files
  const snippetFiles: string[] = await fs.readdir(snippetsRoot);
  // initialize an array of all the snippets without the .liquid ext.
  const allSnippets: string[] = snippetFiles.map((snippet) => snippet && snippet.replace('.liquid', '')).filter(Boolean);
  // read all of the working theme directorys
  const files: string[] = [...await auditDirectoryFiles()];
  // initialize an array for regexp matches
  const snippetMatches: RegExpMatchArray[] = [];
  // initialize an array of regexpressions to match.
  // `(\\{\\%|\\s|)(|\\-)((|\\s)(render|include)(|\\s)(\\'|\\")${snippet.replace('.liquid', '')})`
  // matches any render or include statement even inside a capture or liquid expression.
  const snippetRegexp: Array<RegExp> = snippetFiles.map((snippet) => snippet && new RegExp(`(\\{\\%|\\s|)(|\\-)((|\\s)(render|include)(|\\s)(\\'|\\")${snippet.replace('.liquid', '')})`, 'g'));

  // loop through liquid files and push the results from the match to our snippetsMatch array.
  for await (const file of files) {
    if (file.includes('.liquid')) {
      spinner.stopAndPersist({
        symbol: '✂️',
        text: `Auditing ${file}`,
      });
      const fileBuffer: Buffer = await fs.readFile(file);
      const fileContent: string = fileBuffer.toString();
      snippetRegexp.forEach((regexp: RegExp) => snippetMatches.push(fileContent.match(regexp)));
    }
  }

  // initialize a new array with no duplicates of all snippets in use for comparison.
  const snippetsInUse: string[] = [
    ... new Set(
      snippetMatches.flat()
      .filter(Boolean)
      .map((snippet: string) => snippet.replace(/(\{%|\s|)(|-)((|\s)(render|include)(\s|)('|"))/g, '')
        .replace(/(',|",|'\s|"\s)(.*?)\}/g, '')
        .replace(/'/g, '')
        .trim())
    ),
  ];

  const notInUse = allSnippets.map((snippet: string) => !snippetsInUse.includes(snippet) && snippet).filter(Boolean);

  // returns the snippets not found to be inuse from comparing with our snippetsInUse array. 
  return notInUse;
};

export default auditSnippets;
