const path = require("path");

function isParentFolder(relativeFilePath, context, rootDir) {
  const absoluteRootPath = path.join(context.getCwd(), rootDir);
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

function getRelativePathDepth(path) {
  let depth = 0;
  while (path.startsWith('../')) {
    depth += 1;
    path = path.substring(3)
  }
  return depth;
}

function getAbsolutePath(relativePath, context, rootDir, prefix) {
  return [
    prefix,
    ...path
      .relative(
        path.join(context.getCwd(), rootDir),
        path.join(path.dirname(context.getFilename()), relativePath)
      )
      .split(path.sep)
  ].filter(String).join("/");
}

const message = "import statements should have an absolute path";

module.exports = {
  rules: {
    "no-relative-import-paths": {
      meta: {
        type: "layout",
        fixable: "code",
        schema: {
          type: "array",
          minItems: 0,
          maxItems: 1,
          items: [
            {
              type: "object",
              properties: {
                allowSameFolder: { type: "boolean" },
                rootDir: { type: "string" },
                prefix: { type: "string" },
                allowedDepth: { type: "number" },
              },
              additionalProperties: false,
            },
          ],
        },
      },
      create: function (context) {
        const { allowedDepth, allowSameFolder, rootDir, prefix } = {
          allowedDepth: context.options[0]?.allowedDepth,
          allowSameFolder: context.options[0]?.allowSameFolder || false,
          rootDir: context.options[0]?.rootDir || '',
          prefix: context.options[0]?.prefix || '',
        };

        return {
          ImportDeclaration: function (node) {
            const path = node.source.value;
            if (isParentFolder(path, context, rootDir)) {
              if (typeof allowedDepth === 'undefined' || getRelativePathDepth(path) > allowedDepth) {
                context.report({
                  node,
                  message: message,
                  fix: function (fixer) {
                    return fixer.replaceTextRange(
                      [node.source.range[0] + 1, node.source.range[1] - 1],
                      getAbsolutePath(path, context, rootDir, prefix)
                    );
                  },
                });
              }
            }

            if (isSameFolder(path) && !allowSameFolder) {
              context.report({
                node,
                message: message,
                fix: function (fixer) {
                  return fixer.replaceTextRange(
                    [node.source.range[0] + 1, node.source.range[1] - 1],
                    getAbsolutePath(path, context, rootDir, prefix)
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
