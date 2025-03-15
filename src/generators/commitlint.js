import fs from 'fs/promises';
import { spawn } from 'child_process';

export async function generateCommitlintConfig(packageManager) {
  const commitlintConfig = `{
  "extends": ["@commitlint/config-conventional"],
  "prompt": {
    "messages": {
      "skip": ":skip",
      "max": "upper %d chars",
      "min": "%d chars at least",
      "emptyWarning": "can not be empty",
      "upperLimitWarning": "over limit",
      "lowerLimitWarning": "below limit"
    },
    "questions": {
      "type": {
        "description": "Select the type of change that you're committing:",
        "enum": {
          "feat": {
            "description": "A new feature",
            "title": "Features",
            "emoji": "✨"
          },
          "fix": {
            "description": "A bug fix",
            "title": "Bug Fixes",
            "emoji": "🐛"
          },
          "docs": {
            "description": "Documentation only changes",
            "title": "Documentation3",
            "emoji": "📚"
          },
          "style": {
            "description": "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
            "title": "Styles",
            "emoji": "💎"
          },
          "refactor": {
            "description": "A code change that neither fixes a bug nor adds a feature",
            "title": "Code Refactoring",
            "emoji": "📦"
          },
          "perf": {
            "description": "A code change that improves performance",
            "title": "Performance Improvements",
            "emoji": "🚀"
          },
          "test": {
            "description": "Adding missing tests or correcting existing tests",
            "title": "Tests",
            "emoji": "🚨"
          },
          "build": {
            "description": "Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)",
            "title": "Builds",
            "emoji": "🛠"
          },
          "ci": {
            "description": "Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)",
            "title": "Continuous Integrations",
            "emoji": "⚙️"
          },
          "chore": {
            "description": "Other changes that don't modify src or test files",
            "title": "Chores",
            "emoji": "♻️"
          },
          "revert": {
            "description": "Reverts a previous commit",
            "title": "Reverts",
            "emoji": "🗑"
          }
        }
      },
      "scope": {
        "description": "What is the scope of this change (e.g. component or file name)"
      },
      "subject": {
        "description": "Write a short, imperative tense description of the change"
      },
      "body": {
        "description": "Provide a longer description of the change"
      },
      "isBreaking": {
        "description": "Are there any breaking changes?"
      },
      "breakingBody": {
        "description": "A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself"
      },
      "breaking": {
        "description": "Describe the breaking changes"
      },
      "isIssueAffected": {
        "description": "Does this change affect any open issues?"
      },
      "issuesBody": {
        "description": "If issues are closed, the commit requires a body. Please enter a longer description of the commit itself"
      },
      "issues": {
        "description": "Add issue references (e.g. fix #123, re #123.)"
      }
    }
  }
}
`;

  const scripts = {
    commit: 'cz',
  };

  const czConfig = {
    commitizen: {
      path: 'cz-conventional-changelog',
    },
  };

  try {
    console.log('🚀 正在生成 Commitlint 配置文件...');
    // 安装依赖
    const dependencies = [
      '@commitlint/cli',
      '@commitlint/config-conventional',
      '@commitlint/cz-commitlint',
      'commitizen',
      'cz-conventional-changelog',
    ];

    // 根据包管理器构建安装命令
    let installCmd;
    let installArgs;

    switch (packageManager) {
      case 'pnpm':
        installCmd = 'pnpm';
        installArgs = ['add', '--save-dev', ...dependencies];
        break;
      case 'yarn':
        installCmd = 'yarn';
        installArgs = ['add', '--dev', ...dependencies];
        break;
      case 'bun':
        installCmd = 'bun';
        installArgs = ['add', '--dev', ...dependencies];
        break;
      case 'npm':
      default:
        installCmd = 'npm';
        installArgs = ['install', '--save-dev', ...dependencies];
        break;
    }

    const installDeps = spawn(installCmd, installArgs, {
      stdio: 'inherit',
      shell: true,
    });

    await new Promise((resolve, reject) => {
      installDeps.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`依赖安装失败，退出码: ${code}`));
        }
      });

      installDeps.on('error', (error) => {
        reject(new Error(`依赖安装失败: ${error.message}`));
      });
    });

    // 写入 .commitlintrc.json 文件
    await fs.writeFile('.commitlintrc.json', commitlintConfig);

    // 更新 package.json
    const packageJsonPath = 'package.json';
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

    // 添加 commit 脚本
    packageJson.scripts = {
      ...packageJson.scripts,
      ...scripts,
    };

    // 添加 commitizen 配置
    packageJson.config = {
      ...(packageJson.config ?? {}),
      ...czConfig,
    };

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log('✅ Commitlint 配置文件生成成功');
  } catch (error) {
    throw new Error(`生成 Commitlint 配置文件失败: ${error.message}`);
  }
}
