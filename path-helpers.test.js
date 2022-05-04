const {
  isParentFolder,
  isSameFolder,
  getAbsolutePath,
} = require("./path-helpers");

const context = {
  getCwd: () =>
    "/Users/dev/eslint-plugin-no-relative-import-paths/test-project",
  getFilename: () =>
    "/Users/dev/eslint-plugin-no-relative-import-paths/test-project/index.ts",
};

describe("isParentFolder", () => {
  test("true when ../ - need detailing", () => {
    expect(isParentFolder("../subfolder/index.html", context, "")).toEqual(
      true
    );
  });

  test("false when - need detailing", () => {
    expect(isParentFolder("lcov-report/index.html", context, "")).toEqual(
      false
    );
  });

  test("false - when  with rootdir - need detailing", () => {
    expect(
      isParentFolder("lcov-report/index.html", context, "coverage")
    ).toEqual(false);
  });

  test("false when  with rootdir - need detailing", () => {
    const context2 = {
      getCwd: () => "/Users/dev/eslint-plugin-no-relative-import-paths",
      getFilename: () => "coverage/lcov-report/index.html",
    };
    expect(isParentFolder("5lcov-report/index.html", context2, "")).toEqual(
      false
    );
  });
});

describe("isSameFolder", () => {
  test("is true when starts with ./", () => {
    expect(isSameFolder("./index.html")).toBe(true);
  });

  test("is false when starts with ../", () => {
    expect(isSameFolder("../index.html")).toBe(false);
  });
});

describe("getAbsolutePath", () => {
  test("arbitrary test - needs detailing", () => {
    const context2 = {
      getCwd: () => "/Users/dev/eslint-plugin-no-relative-import-paths",
      getFilename: () => "/coverage/lcov-report/index.html",
    };
    expect(getAbsolutePath("abc/xyz/index.html", context2, "")).toEqual(
      expect.stringContaining("coverage/lcov-report/abc/xyz/index.html")
    );
  });

  test("arbitrary test with rootdir - needs detailing", () => {
    const context2 = {
      getCwd: () => "/Users/dev/eslint-plugin-no-relative-import-paths",
      getFilename: () =>
        "/Users/dev/eslint-plugin-no-relative-import-paths/coverage/lcov-report/index.html",
    };
    expect(getAbsolutePath("abc/xyz/index.html", context2, "/users")).toEqual(
      expect.stringContaining("coverage/lcov-report/abc/xyz/index.html")
    );
  });
});
