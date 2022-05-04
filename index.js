const {
  isParentFolder,
  isSameFolder,
  getAbsolutePath,
} = require("./path-helpers");

const message = "import statements should have an absolute path";

module.exports = {
  rules: {
    "no-relative-import-paths": {
      meta: {
        type: "layout",
        fixable: "code",
      },
      create: function (context) {
        const { allowSameFolder, rootDir } = context.options[0] || {};

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
                    getAbsolutePath(path, context, rootDir || "")
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
                    getAbsolutePath(path, context, rootDir || "")
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
