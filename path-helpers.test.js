const {
  isParentFolder,
  isSameFolder,
  getAbsolutePath,
} = require("./path-helpers");

const context = {
  getCwd: () => "/users/you",
  getFilename: () => "index.html",
};

describe("isParentFolder", () => {
  test("false when ... - needs detailing", () => {
    expect(isParentFolder("/subfolder/index.html", context, "")).toBe(false);
  });

  test("true when - need detailing", () => {
    expect(isParentFolder("../subfolder/index.html", context, "")).toEqual(
      true
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
    expect(getAbsolutePath("abc/xyz/index.html", context, "")).toEqual(
      expect.stringContaining(
        "eslint-plugin-no-relative-import-paths/abc/xyz/index.html"
      )
    );
  });
});
