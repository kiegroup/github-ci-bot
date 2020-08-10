const globToRegExp = require("glob-to-regexp");
const { getChangedFiles } = require("./utils");

/**
 * driver function to ask for reviews on the PR, gets all the required reviewers(defined in reviewers.yml) relevant to PR by getPossibleReviewers.
 * @param {Object} context The context from which the PR is coming from
 * @param {string} diff_url - The diff url of the respective PR
 * @param {string} user - The author of the Pull request
 */
async function askToReview(context, diff_url, user) {
  const reviewersInfo = await context.config("bot-files/reviewers.yml");
  context.github.pulls.createReviewRequest(
    context.issue({
      reviewers: await getPossibleReviewers(reviewersInfo, diff_url, user)
    })
  );
}
/**
 * Calculates all the required reviewers needed for the PR and return them as an Array
 * @param {Object} reviewersInfo The parsed yaml defined in reviewers.yml
 * @param {string} diff_url - The diff url of the respective PR
 * @param {string} user - The author of the Pull request
 * @returns {Array} All the required reviewers
 */
async function getPossibleReviewers(reviewersInfo, diff_url, user) {
  const changedFiles = await getChangedFiles(diff_url);
  const pathReviewersSet = reviewersInfo.review
    .filter(reviewPath =>
      reviewPath.paths
        .map(path => globToRegExp(path))
        .find(re => changedFiles.find(file => re.test(file)))
    )
    .flatMap(pathReview => pathReview.reviewers)
    .reduce((acc, reviewer) => acc.add(reviewer), new Set());

  return pathReviewersSet.size > 0
    ? Array.from(pathReviewersSet).filter(reviewer => reviewer !== user)
    : reviewersInfo.default.filter(reviewer => reviewer !== user);
}

module.exports = {
  askToReview
};
