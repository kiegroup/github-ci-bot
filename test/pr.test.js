const pr = require("../src/lib/pr");

test("isFirstPR true", async () => {
  // Arrange
  const context = {
    repo: jest.fn(() => "repo"),
    github: {
      issues: {
        listForRepo: jest.fn(repo =>
          repo === "repo"
            ? { data: [{ pull_request: true }, { pull_request: false }] }
            : undefined
        )
      }
    },
    payload: { pull_request: { user: { login: "login" } } }
  };
  // Act
  const result = await pr.isFirstPR(context);
  // Assert
  expect(result);
});

test("isFirstPR false", async () => {
  // Arrange
  const context = {
    repo: jest.fn(() => "repo"),
    github: {
      issues: {
        listForRepo: jest.fn(repo =>
          repo === "repo"
            ? { data: [{ pull_request: false }, { pull_request: false }] }
            : undefined
        )
      }
    },
    payload: { pull_request: { user: { login: "login" } } }
  };
  // Act
  const result = await pr.isFirstPR(context);
  // Assert
  expect(!result);
});
