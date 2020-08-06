const utils = require("../src/lib/utils");
const fs = require("fs");
const fetch = require("node-fetch");
jest.mock("node-fetch", () => jest.fn());

test("getChangedFiles", async () => {
  // Arrange
  const diffContent = fs.readFileSync("./test/resources/pr.diff");
  const response = Promise.resolve({
    ok: true,
    text: () => diffContent
  });
  fetch.mockImplementation(() => response);
  const diff_url = "whatever";
  // Act
  const result = await utils.getChangedFiles(diff_url);
  // Assert
  expect(result).toStrictEqual([
    "drools-compiler/src/main/java/org/drools/compiler/builder/InternalKnowledgeBuilder.java",
    "drools-compiler/src/main/java/org/drools/compiler/kie/builder/impl/AbstractKieProject.java",
    "drools-test-coverage/test-compiler-integration/src/test/java/org/drools/compiler/integrationtests/incrementalcompilation/IncrementalCompilationTest.java"
  ]);
});

test("getChangedFiles not found", async () => {
  // Arrange
  const response = Promise.resolve({
    ok: false,
    status: 404,
    statusText: "Not Found"
  });
  fetch.mockImplementation(() => response);
  const diff_url = "whatever";
  // Act and assert
  await expect(utils.getChangedFiles(diff_url)).rejects.toThrow(
    "[ERROR] fetching whatever. Status 404. Description Not Found"
  );
});
