function getDelegate(context) {
  return context.payload.pull_request.draft
    ? require("./main-draft.js")
    : require("./main-ready-for-review.js");
}
module.exports = {
  getDelegate
};
