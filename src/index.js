#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import { generateEslintConfig } from './generators/eslint.js';
import { generateStylelintConfig } from './generators/stylelint.js';
import { generateCommitlintConfig } from './generators/commitlint.js';
import { generatePrettierConfig } from './generators/prettier.js';
import { generateEditorConfigFile } from './generators/editorconfig.js';
import { setupHusky } from './generators/husky.js';

const questions = [
  {
    type: 'list',
    name: 'packageManager',
    message: '选择要使用的包管理器：',
    choices: [
      { name: 'npm', value: 'npm' },
      { name: 'pnpm', value: 'pnpm' },
      { name: 'yarn', value: 'yarn' },
      { name: 'bun', value: 'bun' },
    ],
    default: 'npm',
  },
  {
    type: 'checkbox',
    name: 'lintTools',
    message: '选择需要配置的代码规范工具：',
    choices: [
      { name: 'ESLint', value: 'eslint', checked: true },
      { name: 'Stylelint', value: 'stylelint', checked: true },
      { name: 'Commitlint', value: 'commitlint', checked: true },
      { name: 'Prettier', value: 'prettier', checked: true },
      { name: 'EditorConfig', value: 'editorconfig', checked: true },
    ],
  },
  {
    type: 'confirm',
    name: 'husky',
    message: '是否使用husky来在git hook中做检测？',
    default: true,
  },
];

async function init() {
  console.log(chalk.blue('欢迎使用 lint-master 配置工具！'));

  try {
    const answers = await inquirer.prompt(questions);

    const isUseHusky = answers.husky;

    const packageManager = answers.packageManager;

    for (const tool of answers.lintTools) {
      switch (tool) {
        case 'eslint':
          await generateEslintConfig(packageManager);
          break;
        case 'stylelint':
          await generateStylelintConfig(packageManager);
          break;
        case 'commitlint':
          await generateCommitlintConfig(packageManager);
          break;
        case 'prettier':
          await generatePrettierConfig(packageManager);
          break;
        case 'editorconfig':
          await generateEditorConfigFile();
          break;
      }
    }

    // 如果用户选择使用husky，则设置git hooks
    if (isUseHusky) {
      await setupHusky(answers.lintTools, packageManager);
    }

    console.log(chalk.green('\n✨ 配置文件生成成功！'));
  } catch (error) {
    console.error(chalk.red('错误：'), error);
    process.exit(1);
  }
}

export { init };

// Only run init when this file is run directly
if (import.meta.url === new URL(import.meta.url).href) {
  init();
}
