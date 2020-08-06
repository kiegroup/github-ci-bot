const { addLabels } = require("../src/lib/label");
jest.mock("../src/lib/utils");
const { getChangedFiles: getChangedFilesMock } = require("../src/lib/utils");

const labels = {
  default: ["default1", "default2"],
  labels: [
    { paths: ["test/**", "cmd/**"], labels: ["lbl-a", "lbl-b"] },
    { paths: ["packg/**"], labels: ["lbl-c", "lbl-d"] }
  ]
};

test("addLabels default reviewers", async () => {
  // Arrange
  const context = createContext(labels);
  const diff_url = "whatever";
  getChangedFilesMock.mockImplementationOnce(diff =>
    diff === diff_url ? ["otherfolder/file-a"] : undefined
  );
  // Act
  await addLabels(context, diff_url);
  // Assert
  expect(context.issue.mock.calls.length).toBe(1);
  expect(context.issue.mock.calls[0][0]).toStrictEqual({
    labels: ["default1", "default2"]
  });
  expect(context.github.issues.addLabels.mock.calls.length).toBe(1);
  expect(context.github.issues.addLabels.mock.calls[0][0]).toStrictEqual(
    "issue"
  );
});

test("addLabels label one file existing in path but the other", async () => {
  // Arrange
  const context = createContext(labels);
  const diff_url = "whatever";
  getChangedFilesMock.mockImplementationOnce(diff =>
    diff === diff_url ? ["test/file-a", "filex"] : undefined
  );
  // Act
  await addLabels(context, diff_url);
  // Assert
  expect(context.issue.mock.calls.length).toBe(1);
  expect(context.issue.mock.calls[0][0]).toStrictEqual({
    labels: ["default1", "default2", "lbl-a", "lbl-b"]
  });
  expect(context.github.issues.addLabels.mock.calls.length).toBe(1);
  expect(context.github.issues.addLabels.mock.calls[0][0]).toStrictEqual(
    "issue"
  );
});

test("addLabels label both files existing in path", async () => {
  // Arrange
  const context = createContext(labels);
  const diff_url = "whatever";
  getChangedFilesMock.mockImplementationOnce(diff =>
    diff === diff_url ? ["test/file-a", "cmd/filex"] : undefined
  );
  // Act
  await addLabels(context, diff_url);
  // Assert
  expect(context.issue.mock.calls.length).toBe(1);
  expect(context.issue.mock.calls[0][0]).toStrictEqual({
    labels: ["default1", "default2", "lbl-a", "lbl-b"]
  });
  expect(context.github.issues.addLabels.mock.calls.length).toBe(1);
  expect(context.github.issues.addLabels.mock.calls[0][0]).toStrictEqual(
    "issue"
  );
});

test("addLabels label both files existing in different paths", async () => {
  // Arrange
  const context = createContext(labels);
  const diff_url = "whatever";
  getChangedFilesMock.mockImplementationOnce(diff =>
    diff === diff_url ? ["test/file-a", "packg/filex"] : undefined
  );
  // Act
  await addLabels(context, diff_url);
  // Assert
  expect(context.issue.mock.calls.length).toBe(1);
  expect(context.issue.mock.calls[0][0]).toStrictEqual({
    labels: ["default1", "default2", "lbl-a", "lbl-b", "lbl-c", "lbl-d"]
  });
  expect(context.github.issues.addLabels.mock.calls.length).toBe(1);
  expect(context.github.issues.addLabels.mock.calls[0][0]).toStrictEqual(
    "issue"
  );
});

function createContext(labels) {
  return {
    config: jest.fn(path =>
      path === "bot-files/labels.yml" ? labels : undefined
    ),
    github: { issues: { addLabels: jest.fn(() => "addlabel") } },
    issue: jest.fn(() => "issue")
  };
}
