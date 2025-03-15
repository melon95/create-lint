import { writeFile } from 'fs/promises';
import { getPackageJson, spawnPromise, setPackageJson } from '../utils.js';

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

export async function generateCommitlintConfig(packageManager) {
  try {
    console.log('🚀 正在生成 Commitlint 配置文件...');
    // 根据包管理器构建安装命令
    const { command, args } = buildCommitlintCommand(packageManager);
    // 执行安装命令
    await spawnPromise(command, args);
    // 更新 commitlint 配置
    await updateCommitlintConfig();

    console.log('✅ Commitlint 配置文件生成成功');
  } catch (error) {
    throw new Error(`生成 Commitlint 配置文件失败: ${error.message}`);
  }
}

export function buildCommitlintCommand(packageManager) {
  // 安装依赖
  const dependencies = [
    '@commitlint/cli',
    '@commitlint/config-conventional',
    '@commitlint/cz-commitlint',
    'commitizen',
    'cz-conventional-changelog',
  ];

  // 根据包管理器构建安装命令
  let command;
  let args;

  switch (packageManager) {
    case 'pnpm':
      command = 'pnpm';
      args = ['add', '--save-dev'];
      break;
    case 'yarn':
      command = 'yarn';
      args = ['add', '--dev'];
      break;
    case 'bun':
      command = 'bun';
      args = ['add', '--dev'];
      break;
    case 'npm':
    default:
      command = 'npm';
      args = ['install', '--save-dev'];
      break;
  }
  return { command, args: [...args, ...dependencies] };
}

export async function updateCommitlintConfig() {
  // 写入 .commitlintrc.json 文件
  await writeFile('.commitlintrc.json', commitlintConfig);

  // 更新 package.json
  const packageJson = await getPackageJson();
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
  await setPackageJson(packageJson);
}
