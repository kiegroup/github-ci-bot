/**
 * Checks wheather the PR is a draft PR or not and selects the main accordingly
 * @param {Object} context - The context from which the PR is coming from
 * @module - depending on the PR return the module needed.
 */
function getDelegate(context) {
  return context.payload.pull_request.draft
    ? require("./main-draft.js")
    : require("./main-ready-for-review.js");
}
module.exports = {
  getDelegate
};
