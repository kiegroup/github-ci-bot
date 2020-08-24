const globToRegExp = require("glob-to-regexp");
const { getChangedFiles } = require("./utils");

/**
 * driver function to add the labels, uses getRequiredLabels to get all required labels needed to add to the PR.
 * @param {Object} context - The context from which the PR is coming from
 * @param {string} diff_url - The diff url of the respective PR
 */
async function addLabels(context, diff_url) {
  const labelsInfo = await context.config("bot-files/labels.yml");
  context.github.issues.addLabels(
    context.issue({
      labels: await getRequiredLables(diff_url, labelsInfo)
    })
  );
}

/**
 * Calculates all the required labels needed to add to the PR.
 * @param {string} diff_url - The diff url of the respective PR
 * @param {Object} labelsInfo - The parsed yaml defined in labels.yml
 * @returns {Array} labels to add.
 */
async function getRequiredLables(diff_url, labelsInfo) {
  if (labelsInfo.labels !== undefined) {
    const changedFiles = await getChangedFiles(diff_url);
    const pathLabelsSet = labelsInfo.labels
      .filter(labelPath =>
        labelPath.paths
          .map(path => globToRegExp(path))
          .find(re => changedFiles.find(file => re.test(file)))
      )
      .flatMap(pathLabel => pathLabel.labels)
      .reduce((acc, label) => acc.add(label), new Set());
    return labelsInfo.default.concat(Array.from(pathLabelsSet));
  } else {
    return labelsInfo.default;
  }
}

module.exports = {
  addLabels
};
