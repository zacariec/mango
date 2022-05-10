import ora from 'ora';
import spawn from 'cross-spawn';
import _Directories from '../utils/_directorys';
import { cloneDirectory, createDirectory } from '../utils/_fsUtils';
import { spawnCallback, handleError } from '../utils/_logUtils';
import { removeLiveReload } from '../reload/liveReload';
import sleep from '../utils/_sleep';
import updateData from '../updateData/updateData';
import { BuildOptions } from '../../../types/types';


const buildDistDirectory = async (): Promise<void> => {
  const spinner = ora('Creating distribution directory').start();

  const directoriesToMake = [
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

  try {
    for (const dir of directoriesToMake) await createDirectory(dir);
    spinner.succeed('Finished creating distribution directory');
  } catch (err) {
    spinner.fail('Failed creating distribution directory, maybe it already exists');
    return console.error(err);
  }
};

const copyToDist = async (directory: string, output: string, type: string): Promise<void> => {
  const spinner = ora(`Moving ${type} to ${output}`);
  try {
    await cloneDirectory(directory, output);
    spinner.succeed(`Finished moving ${type} to ${output}`);
  } catch (err) {
    spinner.fail(`Error moving ${type} to ${output}`);
    return console.error(err);
  }
};

const buildDistFiles = async (options: BuildOptions): Promise<void> => {
  const spinner = ora('Building distribution folder.').start();
  try {
    if (options.updateConfig) await updateData(options);
    const directoriesToCopy = [
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
    await removeLiveReload();
    await buildDistDirectory();

    for await (const directory of directoriesToCopy) {
      await copyToDist(directory.from, directory.to, directory.name);
    }

    spinner.succeed('Finished building distribution folder');

    await sleep(500);
    const webPackSpinner = ora('Packing styles and scripts with Webpack').start();

    const command = spawn('npx', ['webpack', '--config', `webpack.production.config`]);

    command.stdout.on('data', data => {
      spawnCallback(data, false)
      if (data.toString().includes('ERROR')) {
        webPackSpinner.warn('There was an error in Webpack, maybe it still compiled - check the logging output above');
        process.exit(1);
      } else if (data.toString().includes('compiled successfully')) {
        webPackSpinner.succeed('Finished packing output files');
        process.exit(1);
      }
    });
    command.stderr.on('data', data => {
      spawnCallback(data, false)
      webPackSpinner.warn('There was an error in Webpack, maybe it still compiled - check the logging output above');
    });
    command.stdout.on('end', () => webPackSpinner.succeed('Finished packing styles and scripts'));
    command.on('error', err => {
      webPackSpinner.fail('Error packing styles and scripts');
      handleError(err.errno, err);
    });

  } catch (err) {
    spinner.fail('Error building distribution folder');
    return console.error(err);
  }
};

export default buildDistFiles;
