import ora, { Ora } from 'ora';
import fs from 'fs-extra';
import spawn from 'cross-spawn';
import _Directories from '../utils/_directorys';
import { cloneDirectory, createDirectory } from '../utils/_fsUtils';
import { spawnCallback, handleError } from '../utils/_logUtils';
import { removeLiveReload } from '../reload/liveReload';
import sleep from '../utils/_sleep';
import updateData from '../updateData/updateData';
import { BuildOptions, Directories } from '../../../types/types';


const removeDistDirectory = async (): Promise<void> => {
  const spinner: Ora = ora('Cleaning up distribution directory').start();

  // this gets wrapped in its own try...catch as we don't want to fail the build.
  try {
    const productionDirectory: string[] = await fs.readdir(_Directories.productionRoot);

    if (productionDirectory.length) {
      await fs.remove(_Directories.productionRoot);
    }

    spinner.succeed('Distribution directory sanitized');
    return;
  } catch {
    spinner.succeed('Distribution directory sanitized');
    return;
  }
};

/**
 * Builds the dist directory and returns a voided promise, to be called
 * asynchronously, before we can do anything else.
 */
const buildDistDirectory = async (): Promise<Ora | Error> => {
  const spinner: Ora = ora('Creating distribution directory').start();
  // Array of directories contained in the dist folder for Shopify.
  const directoriesToMake: string[] = [
    _Directories.productionRoot,
    _Directories.distAssetsRoot,
    _Directories.distConfigRoot,
    _Directories.distLayoutRoot,
    _Directories.distLocalesRoot,
    _Directories.distSectionsRoot,
    _Directories.distSnippetsRoot,
    _Directories.distTemplatesRoot,
    _Directories.distCustomersRoot,
  ];
  const created = [];

  for (const directory of directoriesToMake) {
    created.push(await createDirectory(directory));
  }

  // If any of the directories failed creating, it will be contained in the created array.
  if (created.includes(false)) {
    spinner.fail('Failed creating distribution directory, maybe it already exists');
    throw new Error('Error creating the distribution directory');
  }

  return spinner.succeed('Finished creating distribution directory');
};

/**
 * Function to copy files to the Dist directory on build.
 * @param directory - String
 * @param output - String
 * @param type - String
 * @returns Promise<Ora>
 */
const copyToDist = async (directory: string, output: string, type: string): Promise<Ora> => {
  const spinner: Ora = ora(`Moving ${type} to ${output}`).start();

  // Gets its own try...catch statement, so we don't fail the build step.
  try {
    await cloneDirectory(directory, output);
    return spinner.succeed(`Finished moving ${type} to ${output}`);
  } catch (err) {
    console.error(err);
    return spinner.fail(`Error moving ${type} to ${output}`);
  }
};

const runWebpackBuild = async (): Promise<void> => {
  const webPackSpinner: Ora = ora('Packing styles and scripts with Webpack').start();
  const command = spawn('npx', ['webpack', '--config', `webpack.production.config`]);
  const strings = {
    errorString: 'There was an error in Webpack, maybe it still compiled - check the logging output above',
    successString: 'Finished packing output files',
  };

  command.stdout.on('data', (data: Buffer): void => {
    spawnCallback(data, false);
    const outputString: string = data.toString().toLowerCase();


    console.log(outputString);

    if (outputString.includes('error')) {
      webPackSpinner.warn(strings.errorString);
      return process.exit(1);
    }

    if (outputString.includes('compiled successfully')) {
      webPackSpinner.succeed();
      return process.exit(1);
    }
  });

  command.stderr.on('data', (data: Buffer): Ora => {
    spawnCallback(data, false)
    return webPackSpinner.warn(strings.errorString);
  });

  command.stdout.on('end', (): Ora => webPackSpinner.succeed('Finished packing styles and scripts'));
  command.on('error', (err) => {
    webPackSpinner.fail('Error packing styles and scripts');
    handleError(err.errno, err);
  });

  return;
};

/**
 * The main func for building the dist directory from the build command.
 * @param options
 */
const buildDistFiles = async (options: BuildOptions): Promise<void> => {
  const spinner = ora('Building distribution folder.').start();
  try {
    // Update the settings_data.json if --env is passed.
    if (options.environment) {
      await updateData(options);
    }

    // The directories array we want to use to copy from src to dist.
    const directoriesToCopy: Directories = [
      {
        from: _Directories.staticRoot,
        to: _Directories.distAssetsRoot,
        name: 'Static',
      },
      {
        from: _Directories.imagesRoot,
        to: _Directories.distAssetsRoot,
        name: 'Images',
      },
      {
        from: _Directories.fontsRoot,
        to: _Directories.distAssetsRoot,
        name: 'Fonts',
      },
      {
        from: _Directories.configRoot,
        to: _Directories.distConfigRoot,
        name: 'Config',
      },
      {
        from: _Directories.layoutRoot,
        to: _Directories.distLayoutRoot,
        name: 'Layout',
      },
      {
        from: _Directories.localesRoot,
        to: _Directories.distLocalesRoot,
        name: 'Locales',
      },
      {
        from: _Directories.sectionsRoot,
        to: _Directories.distSectionsRoot,
        name: 'Sections',
      },
      {
        from: _Directories.snippetsRoot,
        to: _Directories.distSnippetsRoot,
        name: 'Snippets',
      },
      {
        from: _Directories.templatesRoot,
        to: _Directories.distTemplatesRoot,
        name: 'Templates',
      },
      {
        from: _Directories.customersRoot,
        to: _Directories.distCustomersRoot,
        name: 'Customers',
      }
    ];
    const stepsToRun: Array<{(): void }> = [removeDistDirectory, removeLiveReload, buildDistDirectory];

    // run the steps for building the dist directory.
    for await (const step of stepsToRun) {
      await step();
    }

    // start copying all directories from the above array to the dist folder.
    for await (const directory of directoriesToCopy) {
      await copyToDist(directory.from, directory.to, directory.name);
    }

    spinner.succeed('Finished building distribution folder');

    // sleep func called to start the webpack spinner.
    await sleep(500);

    await runWebpackBuild();
    return;
  } catch (err) {
    spinner.fail('Error building distribution folder');
    return console.error(err);
  }
};

export default buildDistFiles;
