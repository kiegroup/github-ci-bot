const globToRegExp = require("glob-to-regexp");
const { getChangedFiles } = require("./utils");

/**
 * checks if we need to run the Jenkins job(based to trigger only on comment) and comment the required phrase, which is defined in comments.yml
 * @param {Object} context - The context from which the PR is coming from
 * @param {string} diff_url - The diff url of the respective PR
 * @returns {boolean} true/false depending on the method logic
 */
async function isCIRequired(context, diff_url) {
  const triggerPaths = await context.config("bot-files/paths.yml");
  if (triggerPaths) {
    const changedFiles = await getChangedFiles(diff_url);

    return (
      triggerPaths.files
        .map(file => globToRegExp(file))
        .find(fileExpr =>
          changedFiles.find(changedFile => fileExpr.test(changedFile))
        ) !== undefined
    );
  }
}

module.exports = {
  isCIRequired
};
