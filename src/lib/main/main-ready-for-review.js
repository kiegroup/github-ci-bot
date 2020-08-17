const { askToReview } = require("../review");
const { addLabels } = require("../label");
const { isCIRequired } = require("../ci");
const { isFirstPR } = require("../pr");

/**
 * Defines the flow when a PR is Reopened for review
 * @param {Object} context - The context from which the PR is coming from
 */
async function pullRequestReopened(context) {
  commonTasks(context, "bot-files/comments.yml", "prReopen", true);
}

/**
 * Defines the flow when a PR is Opened for review
 * @param {Object} context - The context from which the PR is coming from
 */
async function pullRequestOpened(context) {
  await askToReview(
    context,
    context.payload.pull_request.diff_url,
    context.payload.pull_request.user.login
  );
  commonTasks(
    context,
    "bot-files/comments.yml",
    "prFirstTimeContributor",
    await isFirstPR(context)
  );
}

/**
 * Defines the flow when a PR is marked as ready-for-review from draft
 * @param {Object} context - The context from which the PR is coming from
 */
async function pullRequestReadyForReview(context) {
  if (
    context.payload.pull_request.labels.find(
      label => label.name == "WIP :construction_worker_man:"
    )
  ) {
    context.github.issues.removeLabel(
      context.issue({
        name: ["WIP :construction_worker_man:"]
      })
    );
  }
  await askToReview(
    context,
    context.payload.pull_request.diff_url,
    context.payload.pull_request.user.login
  );
  commonTasks(context, "bot-files/comments.yml", "whatev", false);
}
/**
 * Defines the flow when a PR is Changed in review
 * @param {Object} context - The context from which the PR is coming from
 */
async function pullRequestChanged(context) {
  commonTasks(context, "bot-files/comments.yml", "prEdit", true);
}

/**
 * Defines the common functions in all the flows.
 * @param {Obejct} context - The context from which the PR is coming from.
 * @param {string} commentsFile - The relative path inside .github/ where the comments.yml is present.
 * @param {string} commentField - The field inside the comments.yml file which needs to be commented here.
 * @param {boolean} shouldComment - Wheather or not comment needs to be made by the bot.
 */
async function commonTasks(context, commentsFile, commentField, shouldComment) {
  const comments = await context.config(commentsFile);
  if (shouldComment) {
    context.github.issues.createComment(
      context.issue({ body: comments[commentField] })
    );
  }

  if (await isCIRequired(context, context.payload.pull_request.diff_url)) {
    context.github.issues.createComment(
      context.issue({ body: comments.prCiTrigger })
    );
  }
  await addLabels(context, context.payload.pull_request.diff_url);
}

module.exports = {
  pullRequestReopened,
  pullRequestOpened,
  pullRequestChanged,
  pullRequestReadyForReview
};
