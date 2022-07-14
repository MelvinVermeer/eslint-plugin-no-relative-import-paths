const path = require("path");

function isParentFolder(relativeFilePath, context, rootDir) {
  const absoluteRootPath = context.getCwd() + (rootDir !== '' ? path.sep + rootDir : '');
  const absoluteFilePath = path.join(path.dirname(context.getFilename()), relativeFilePath)

  return relativeFilePath.startsWith("../") && (
    rootDir === '' ||
    (absoluteFilePath.startsWith(absoluteRootPath) &&
    context.getFilename().startsWith(absoluteRootPath))
  );
}

function isSameFolder(path) {
  return path.startsWith("./");
}

function getAbsolutePath(relativePath, context, rootDir) {
  return path
    .relative(
      context.getCwd() + (rootDir !== '' ? path.sep + rootDir : ''),
      path.join(path.dirname(context.getFilename()), relativePath)
    )
    .split(path.sep)
    .join("/");
}

function checkImportCall(context, node, { allowSameFolder, rootDir }) {
  let modulePath;
  // refs https://github.com/estree/estree/blob/HEAD/es2020.md#importexpression
  if (node.type === 'ImportDeclaration' || node.type === 'ImportExpression') {
    modulePath = node.source;
  } else if (node.type === 'CallExpression') {
    if (node.callee.type !== 'Import') return;
    if (node.arguments.length !== 1) return;

    modulePath = node.arguments[0];
  }

  if (modulePath.type !== 'Literal') return;
  if (typeof modulePath.value !== 'string') return;

  const path  = modulePath.value;
  if (isParentFolder(path, context, rootDir)) {
    context.report({
      node,
      message: message,
      fix: function (fixer) {
        return fixer.replaceTextRange(
          [node.source.range[0] + 1, node.source.range[1] - 1],
          getAbsolutePath(path, context, rootDir || '')
        );
      },
    });
  }

  if (isSameFolder(path) && !allowSameFolder) {
    context.report({
      node,
      message: message,
      fix: function (fixer) {
        return fixer.replaceTextRange(
          [node.source.range[0] + 1, node.source.range[1] - 1],
          getAbsolutePath(path, context, rootDir || '')
        );
      },
    });
  }
}

const message = "import statements should have an absolute path";

module.exports = {
  rules: {
    "no-relative-import-paths": {
      meta: {
        type: "layout",
        fixable: "code",
      },
      create: function (context) {
        const options = {
          allowSameFolder: context.options[0].allowSameFolder || false,
          rootDir: context.options[0].rootDir || '',
        };

        return {
          ImportDeclaration: function (node) {
            checkImportCall(context, node, options);
          },
          CallExpression: function (node) {
            checkImportCall(context, node, options);
          },
          ImportExpression: function (node) {
            checkImportCall(context, node, options);
          },
        };
      },
    },
  },
};
