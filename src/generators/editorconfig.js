export async function generateEditorConfigFile() {
  const editorConfigContent = `# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

[*]
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

# Web files
[*.{js,jsx,ts,tsx,vue,html,css,scss,json,yml}]
indent_style = space
indent_size = 2

# Python files
[*.py]
indent_style = space
indent_size = 4

# Tab indentation (no size specified)
[Makefile]
indent_style = tab
`;

  try {
    console.log('🚀 正在生成.editorconfig 文件...');
    const fs = await import('fs/promises');
    await fs.writeFile('.editorconfig', editorConfigContent);
    console.log('✅ .editorconfig 文件创建成功');
  } catch (error) {
    console.error('创建 .editorconfig 文件失败:', error);
    throw error;
  }
}
