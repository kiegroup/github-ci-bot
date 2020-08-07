/**
 * Defines the flow when a Draft PR is opened
 * @param {Obejct} context - The context from which the PR is coming from
 */
async function pullRequestOpened(context) {
  context.github.issues.addLabels(
    context.issue({
      labels: ["WIP :construction_worker_man:"]
    })
  );
}

/**
 * Defines the flow when a Draft PR is Reopened
 * @param {Obejct} context - The context from which the PR is coming from
 */
async function pullRequestReopened() {
  console.log("no pull request reopened for draft");
}

/**
 * Defines the flow when a Draft PR's HEAD is changed
 * @param {Obejct} context - The context from which the PR is coming from
 */
async function pullRequestChanged() {
  console.log("no pull request changed for draft");
}

module.exports = {
  pullRequestOpened,
  pullRequestReopened,
  pullRequestChanged
};
