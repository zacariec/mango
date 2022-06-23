import ora, { Ora } from 'ora';
import fs from 'fs-extra';
import auditSettingsSchema from './schema-audit';
import auditLocales from './locales-audit';
import auditSnippets from './snippets-audit';

// TODO: Add sections audit, will need to loop through .json & .liquid files and compare..

// creates the header for the audit file.
const createAuditHeader = (): string => {
  const date = new Date();
  const dateTime = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };
  return `### Timestamp: ${dateTime.year}-${dateTime.month}-${dateTime.day} ${dateTime.hours}:${dateTime.minutes}:${dateTime.seconds} \n---\n`;
};

// creates the footer for the audit file.
const createAuditFooter = (): string => `\n---\n#### Audited by mango 🥭`;

// creates the audit file.
const writeAuditFile = async (data): Promise<void> => {
  if (await fs.pathExists('./mango-audit.md')) {
    await fs.remove('./mango-audit.md');
  }

  await fs.writeFile('./mango-audit.md', createAuditHeader() + data + createAuditFooter());
};

// reusuable method to create audit content to be written. 
const createSettingsAudit = (data: string[], result: string, type: string, symbol: string): string => {
  const lines = [];
  data.forEach((string) => lines.push(`- ${symbol} ${string} ${result}`));
  return `#### ${type}\n\n---\n${lines.join('\n')}\n---\n`;
};

// main audit func gets ran in cli.ts
const audit = async (): Promise<void> => {
  const spinner: Ora = ora('Auditing theme files').start();

  try {
    const schemaAudit: string[] = await auditSettingsSchema(spinner);
    const snippetsAudit: string[] = await auditSnippets(spinner);
    const localesAudit: string[] = await auditLocales(spinner);

    const schemaResults = `
    ${createSettingsAudit(schemaAudit, 'failed', '🥭 settings_schema.json', '👾')}
    ${createSettingsAudit(snippetsAudit, 'not in use', '🥭 snippets', '✂️')}
    ${createSettingsAudit(localesAudit, 'not found', '🥭 locales.default.json', '📘')}
    `;

    await writeAuditFile(schemaResults);

    spinner.stopAndPersist({
      symbol: schemaAudit.length >= 1 ? '⛔️' : '🥭',
      text: `There are ${schemaAudit.length} settings unused`,
    });

    spinner.stopAndPersist({
      symbol: snippetsAudit.length >= 1 ? '⛔️' : '✂️',
      text: `There are ${snippetsAudit.length} snippets unused`,
    });

    spinner.stopAndPersist({
      symbol: localesAudit.length >= 1 ? '⛔️' : '🤟',
      text: `There are ${localesAudit.length} locales unused`,
    });
  
    spinner.succeed('Finished auditing theme files, check mango-audit.md for output');
  } catch (err) {
    spinner.fail('Error auditing theme files, check the output below');
    console.error(err);
    process.exit(1);
  }
};

export default audit;
