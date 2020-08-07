const { askToReview } = require("../review");
const { addLabels } = require("../label");
const { isCIRequired } = require("../ci");

/**
 * The function defines the steps when /bot run is commented on the PR
 * @param {Obejct} context - The context from which the PR is coming from
 */
async function run(context) {
  if (
    context.payload.issue.labels.find(
      label => label.name == "WIP :construction_worker_man:"
    )
  ) {
    context.github.issues.removeLabel(
      context.issue({
        name: ["WIP :construction_worker_man:"]
      })
    );
  }
  const comments = await context.config("bot-files/comments.yml");
  if (
    await isCIRequired(context, context.payload.issue.pull_request.diff_url)
  ) {
    context.github.issues.createComment(
      context.issue({ body: comments.prCiTrigger })
    );
  }
  await askToReview(
    context,
    context.payload.issue.pull_request.diff_url,
    context.payload.issue.user.login
  );

  await addLabels(context, context.payload.issue.pull_request.diff_url);
}

module.exports = {
  run
};
