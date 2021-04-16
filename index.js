function isParentFolder(path) {
  return path.startsWith("../");
}

function isSameFolder(path) {
  return path.startsWith("./");
}

const message = "import statements should have an absolute path";

module.exports = {
  rules: {
    "no-relative-imports": {
      create: function (context) {
        const { allowSameFolder } = context.options[0] || {};

        return {
          ImportDeclaration: function (node) {
            const path = node.source.value;
            if (isParentFolder(path)) {
              context.report({
                node,
                message: message,
              });
            }

            if (isSameFolder(path) && !allowSameFolder) {
              context.report({
                node,
                message: message,
              });
            }
          },
        };
      },
    },
  },
};
