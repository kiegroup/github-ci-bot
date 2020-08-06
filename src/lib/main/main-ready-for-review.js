const { askToReview } = require("../review");
const { addLabels } = require("../label");
const { isCIRequired } = require("../ci");
const { isFirstPR } = require("../pr");

async function pullRequestReopened(context) {
  const comments = await context.config("bot-files/comments.yml");
  context.github.issues.createComment(context.issue({ body: comments.prEdit }));
  commonFunc(context);
}

async function pullRequestOpened(context) {
  const comments = await context.config("bot-files/comments.yml");
  if (await isFirstPR(context)) {
    context.github.issues.createComment(
      context.issue({ body: comments.prFirstTimeContributor })
    );
  }
  commonFunc(context);
}

async function pullRequestChanged(context) {
  const comments = await context.config("bot-files/comments.yml");
  context.github.issues.createComment(context.issue({ body: comments.prEdit }));
  commonFunc(context);
}
async function commonFunc(context) {
  const comments = await context.config("bot-files/comments.yml");
  if (await isCIRequired(context, context.payload.pull_request.diff_url)) {
    context.github.issues.createComment(
      context.issue({ body: comments.prCiTrigger })
    );
  }
  await askToReview(
    context,
    context.payload.pull_request.diff_url,
    context.payload.pull_request.user.login
  );
  await addLabels(context, context.payload.pull_request.diff_url);
}

module.exports = {
  pullRequestReopened,
  pullRequestOpened,
  pullRequestChanged
};
