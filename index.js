const pathLib = require('path');

const parentFolderRegExp = /^(?:\.\/)?\.\./;
const sameFolderRegExp = /^\.$|^\.\/(?!\.\.)/;

/**
 * @param {string} relativeFilePath
 * @param {*} context
 * @param {string} rootDir
 * @returns {boolean}
 */
function isParentFolder(relativeFilePath, context, rootDir) {
  const absoluteRootPath = pathLib.join(context.getCwd(), rootDir);
  const absoluteFilePath = pathLib.join(
    pathLib.dirname(context.getFilename()),
    relativeFilePath
  );

  return (
    parentFolderRegExp.test(relativeFilePath) &&
    (rootDir === '' ||
      (absoluteFilePath.startsWith(absoluteRootPath) &&
        context.getFilename().startsWith(absoluteRootPath)))
  );
}

/**
 * @param {string} path
 * @returns {boolean}
 */
function isSameFolder(path) {
  return sameFolderRegExp.test(path);
}

/**
 * @param {string} path
 * @returns {number}
 */
function getRelativePathDepth(path) {
  let subPath = path;
  let depth = 0;

  while (parentFolderRegExp.test(subPath)) {
    depth++;
    subPath = subPath.substring(3);
  }

  return depth;
}

/**
 * @param {string} relativePath
 * @param {*} context
 * @param {string} rootDir
 * @param {[string, string]} pathsEntries
 * @returns {string}
 */
function getAbsolutePath(relativePath, context, rootDir, pathsEntries) {
  const absolutePath = pathLib
    .relative(
      pathLib.join(context.getCwd(), rootDir),
      pathLib.join(pathLib.dirname(context.getFilename()), relativePath)
    )
    .split(pathLib.sep)
    .filter((path) => !!path)
    .join('/');

  for (const [alias, topPath] of pathsEntries) {
    if (absolutePath.startsWith(topPath)) {
      return absolutePath.replace(topPath, alias);
    }
  }

  return absolutePath;
}

const message = 'Import statements should have an absolute path!';

module.exports = {
  rules: {
    'no-relative-import-paths': {
      meta: {
        type: 'layout',
        fixable: 'code',
        schema: {
          type: 'array',
          minItems: 0,
          maxItems: 1,
          items: [
            {
              type: 'object',
              properties: {
                allowedDepth: { type: 'number' },
                allowSameFolder: { type: 'boolean' },
                rootDir: { type: 'string' },
                paths: {
                  type: 'object',
                  patternProperties: {
                    '.*': { type: 'string' },
                  },
                },
              },
              additionalProperties: false,
            },
          ],
        },
      },
      create(context) {
        /** @type {number | undefined} */
        const allowedDepth = context.options[0]?.allowedDepth;
        /** @type {boolean} */
        const allowSameFolder = context.options[0]?.allowSameFolder || false;
        /** @type {string} */
        const rootDir = context.options[0]?.rootDir || '';
        /** @type {Object<string, string>} */
        const paths = context.options[0]?.paths || [];
        const pathsEntries = Object.entries(paths);

        return {
          ImportDeclaration(node) {
            /** @type {string} */
            const path = node.source.value;

            if (isParentFolder(path, context, rootDir)) {
              if (
                typeof allowedDepth === 'undefined' ||
                getRelativePathDepth(path) > allowedDepth
              ) {
                context.report({
                  node,
                  message,
                  fix(fixer) {
                    return fixer.replaceTextRange(
                      [node.source.range[0] + 1, node.source.range[1] - 1],
                      getAbsolutePath(path, context, rootDir, pathsEntries)
                    );
                  },
                });
              }
            } else {
              if (!allowSameFolder && isSameFolder(path)) {
                context.report({
                  node,
                  message,
                  fix(fixer) {
                    return fixer.replaceTextRange(
                      [node.source.range[0] + 1, node.source.range[1] - 1],
                      getAbsolutePath(path, context, rootDir, pathsEntries)
                    );
                  },
                });
              }
            }
          },
        };
      },
    },
  },
};
