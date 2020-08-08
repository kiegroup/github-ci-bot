const draft = require("../src/lib/main/main-draft");

test("a draft PR is Reopened", async () => {
  //arrange
  console.log = jest.fn();
  //act
  draft.pullRequestReopened();
  // assert
  expect(console.log.mock.calls.length).toBe(1);
  expect(console.log.mock.calls[0][0]).toBe(
    "no pull request reopened for draft"
  );
});

test("a draft PR is changed", async () => {
  //arrange
  console.log = jest.fn();
  //act
  draft.pullRequestChanged();
  // assert
  expect(console.log.mock.calls.length).toBe(1);
  expect(console.log.mock.calls[0][0]).toBe(
    "no pull request changed for draft"
  );
});

test("a draft PR is opened", async () => {
  //arrange
  const context = {
    github: { issues: { addLabels: jest.fn(() => "addlabel") } },
    issue: jest.fn(() => "WIP :construction_worker_man:")
  };

  //act
  draft.pullRequestOpened(context);

  //assert
  expect(context.github.issues.addLabels.mock.calls.length).toBe(1);
  expect(context.github.issues.addLabels).toHaveBeenCalledWith(
    "WIP :construction_worker_man:"
  );
});
