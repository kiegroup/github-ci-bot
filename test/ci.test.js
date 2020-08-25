const { isCIRequired } = require("../src/lib/ci");
jest.mock("../src/lib/utils");
const { getChangedFiles: getChangedFilesMock } = require("../src/lib/utils");

test("is CI required true", async () => {
  // Arrange
  const context = {
    config: jest.fn(path =>
      path === "bot-files/paths.yml"
        ? { files: ["Jenkinsfile", "test/**", "cmd/**", "pkg/**"] }
        : undefined
    )
  };
  const diff_url = "whatever";
  getChangedFilesMock.mockImplementationOnce(diff =>
    diff === diff_url
      ? ["test/file-a", "cmd/file-a", "pkg/file-a", "otherfolder/file-a"]
      : undefined
  );
  // Act
  const result = await isCIRequired(context, diff_url);
  // Assert
  expect(result);
});

test("is CI required false", async () => {
  // Arrange
  const context = {
    config: jest.fn(path =>
      path === "bot-files/paths.yml"
        ? { files: ["Jenkinsfile", "test/**", "cmd/**", "pkg/**"] }
        : undefined
    )
  };
  const diff_url = "whatever";
  getChangedFilesMock.mockImplementationOnce(diff =>
    diff === diff_url ? ["otherfolder/file-a"] : undefined
  );
  // Act
  const result = await isCIRequired(context, diff_url);
  // Assert
  expect(!result);
});

test("isCIRequired paths file not defined", async () => {
  //Arrange
  const context = {
    config: jest.fn(() => undefined)
  };
  const diff_url = "whatever";
  // Act
  const result = await isCIRequired(context, diff_url);
  // Assert
  expect(!result);
});
