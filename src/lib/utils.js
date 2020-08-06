const parser = require("git-diff-parser");
const fetch = require("node-fetch");
/**
 * calculates all the files which are changed in the PR
 * @param {string} diff_url - The diff url of the respective PR
 * @returns {Array} array of all the changed files
 */
async function getChangedFiles(diff_url) {
  //const url = context.payload.pull_request.diff_url;
  const response = await fetch(diff_url);
  if (!response.ok) {
    throw new Error(
      `[ERROR] fetching ${diff_url}. Status ${response.status}. Description ${response.statusText}`
    );
  }
  const diff = parser(await response.text());
  return Array.from(
    diff.commits.reduce(
      (newSet, commit) =>
        commit.files.reduce(
          (newSetFiles, file) => newSetFiles.add(file.name.toString()),
          newSet
        ),
      new Set()
    )
  );
}

module.exports = {
  getChangedFiles
};
