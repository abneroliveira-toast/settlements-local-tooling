import chalk from 'chalk';

const getEnableFeatureFlagCommands = (featureFlags: string[]) =>
  featureFlags.map(
    (ff) => `toast-feature-flags update ${ff} -e preproduction -t on -o true`
  );

const getDisableFeatureFlagCommands = (featureFlags: string[]) =>
  featureFlags.map(
    (ff) => `toast-feature-flags update ${ff} -t off -e preproduction`
  );

/** @type {string[]} 
  `pmts-pays-funds-transfer-use-new-lfs-in-lfset`,
  `pmts-pays-settlements-tooling-use-new-lfs-in-lfset`,
  `pmts-pays-stratus-capture-use-new-lfs-in-lfset`,
  `pmts-pays-stratus-response-processing-use-new-lfs-in-lfset`

*/
const featureFlagsToEnable: string[] = [
  'pmts-pays-funds-transfer-use-new-lfs-in-lfset',
  'pmts-pays-settlements-tooling-use-new-lfs-in-lfset',
  'pmts-pays-stratus-capture-use-new-lfs-in-lfset',
  'pmts-pays-stratus-response-processing-use-new-lfs-in-lfset',
];

const bashBodyEnable =
  getEnableFeatureFlagCommands(featureFlagsToEnable).join(' && \\\n');

const bashBodyDisable =
  getDisableFeatureFlagCommands(featureFlagsToEnable).join(' && \\\n');
const SUBTITLE_LINE =
  '===============================================================================';

console.log(chalk.bold.green('ENABLE BASH COMMANDS....'));
console.log(chalk.bold.green(SUBTITLE_LINE));
console.log(chalk.green(bashBodyEnable));

console.log('');

console.log(chalk.bold.red('DISABLE BASH COMMANDS....'));
console.log(chalk.bold.red(SUBTITLE_LINE));
console.log(chalk.red(bashBodyDisable));
