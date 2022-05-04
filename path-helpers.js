const path = require("path");

function isParentFolder(relativeFilePath, context, rootDir) {
  const absoluteRootPath =
    context.getCwd() + (rootDir !== "" ? path.sep + rootDir : "");
  const absoluteFilePath = path.join(
    path.dirname(context.getFilename()),
    relativeFilePath
  );

  return (
    relativeFilePath.startsWith("../") &&
    (rootDir === "" ||
      (absoluteFilePath.startsWith(absoluteRootPath) &&
        context.getFilename().startsWith(absoluteRootPath)))
  );
}

function isSameFolder(path) {
  return path.startsWith("./");
}

function getAbsolutePath(relativePath, context, rootDir) {
  return path
    .relative(
      context.getCwd() + (rootDir !== "" ? path.sep + rootDir : ""),
      path.join(path.dirname(context.getFilename()), relativePath)
    )
    .split(path.sep)
    .join("/");
}

module.exports = {
  isParentFolder,
  isSameFolder,
  getAbsolutePath,
};
