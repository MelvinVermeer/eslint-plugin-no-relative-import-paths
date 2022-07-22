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

const message = "import statements should have an absolute path";

module.exports = {
  rules: {
    "no-relative-import-paths": {
      meta: {
        type: "layout",
        fixable: "code",
      },
      create: function (context) {
        const { allowSameFolder, rootDir } = {
          allowSameFolder: context.options[0]?.allowSameFolder || false,
          rootDir: context.options[0]?.rootDir || '',
        };

        return {
          ImportDeclaration: function (node) {
            const path = node.source.value;
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
          },
        };
      },
    },
  },
};
