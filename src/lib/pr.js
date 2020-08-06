/**
 * checks wheather the PR is the first contribution by the author, in the target repository.
 * @param {Object} context The context from which the PR is coming from
 * @returns {boolean} true/false depending on method logic
 */
async function isFirstPR(context) {
  return (
    (await (
      await context.github.issues.listForRepo(
        context.repo({
          state: "all",
          creator: context.payload.pull_request.user.login
        })
      )
    ).data.filter(data => data.pull_request).length) === 1
  );
}

module.exports = {
  isFirstPR
};
