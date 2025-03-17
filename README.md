# create-lint

一个简单易用的代码规范配置工具，帮助你快速在项目中集成 ESLint、Stylelint、Commitlint、Prettier 等代码规范工具。

## 特性

- 🚀 一键配置，快速集成
- 🎨 支持多种代码规范工具
  - ESLint - JavaScript/TypeScript 代码规范
  - Stylelint - CSS/SCSS 样式规范
  - Commitlint - Git 提交信息规范
  - Prettier - 代码格式化工具
  - EditorConfig - 编辑器配置
- 📦 支持多种包管理器
  - npm
  - pnpm
  - yarn
  - bun
- 🔧 自动配置 Git Hooks
  - 提交前代码检查
  - 提交信息规范检查

## 使用方式

### 1. 命令行（推荐）

使用 `create-lint` 只需要几个简单的步骤：

1. 在你的项目中运行：

```bash
npx create-lint
# 或者使用其他包管理器
pnpm create lint
yarn create lint
bun create lint
```

### 2. 全局安装

你也可以选择全局安装使用：

```bash
# 使用 npm 全局安装
npm install -g create-lint

# 安装后使用
create-lint
```

### 2. 按提示选择配置

1. 选择包管理器
2. 选择需要配置的代码规范工具
3. 选择是否使用 husky 配置 Git Hooks

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/0d004f8ec9004670b934d8a91834cb88~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgaWRpZA==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNDM3MTMxMzk2NDM2NzQ4NSJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1742195555&x-orig-sign=PWCcDsRgoPs8LJpd1bOsHDvJp5U%3D)

### 3. 开始使用

配置完成后，你可以：

- 使用 ESLint 检查代码：

  ```bash
  npm run lint
  ```

- 使用 Prettier 格式化代码：

  ```bash
  npm run format
  ```

- 使用 Commitlint 规范提交信息：
  ```bash
  npm run commit
  ```

## 配置文件

工具会在你的项目根目录下生成以下配置文件：

- `eslint.config.js | eslint.config.ts` - ESLint 配置
- `.stylelintrc.json` - Stylelint 配置
- `.commitlintrc.json` - Commitlint 配置
- `.prettierrc.json` - Prettier 配置
- `.editorconfig` - EditorConfig 配置
- `.husky/` - Git Hooks 配置

## 常见问题

### 1. 如何自定义规则？

你可以直接修改对应的配置文件来自定义规则，例如：

```javascript
// eslint.config.js
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    rules: {
      // customize rules
      'no-console': 'off',
    },
  },
];
```

### 2. 如何跳过某些文件的检查？

在项目根目录创建 `.eslintignore`、`.prettierignore` 等文件，添加需要忽略的文件或目录：

```plaintext
dist
node_modules
```

### 3. 提交时检查失败怎么办？

- 运行 `npm run lint:fix` 自动修复代码风格问题
- 运行 `npm run format` 格式化代码
- 确保提交信息符合规范（feat: 新功能、fix: 修复等）

## 许可证

[MIT](LICENSE)
