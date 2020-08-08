const delegator = require("../src/lib/main/delegator");
jest.mock("../src/lib/main/main-draft", () => {
  return "draft";
});

jest.mock("../src/lib/main/main-ready-for-review", () => {
  return "ready";
});

test("context related to draft PR", () => {
  //arrange
  const context = createContext(true);
  //act
  const result = delegator.getDelegate(context);

  //assert
  expect(result).toStrictEqual("draft");
});

test("context related to ready PR", () => {
  //arrange
  const context = createContext(false);
  //act
  const result = delegator.getDelegate(context);

  //assert
  expect(result).toStrictEqual("ready");
});

function createContext(pr) {
  return {
    payload: { pull_request: { draft: pr } }
  };
}
