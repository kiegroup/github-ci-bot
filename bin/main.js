const { askToReview } = require("../src/lib/review");
const { addLabels } = require("../src/lib/label");
const { isCIRequired } = require("../src/lib/ci");
const { isFirstPR } = require("../src/lib/pr");
const commands = require("probot-commands");
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  app.on("pull_request.opened", async context => {
    if (!context.payload.pull_request.draft) {
      const comments = await context.config("bot-files/comments.yml");
      if (await isFirstPR(context)) {
        context.github.issues.createComment(
          context.issue({ body: comments.prFirstTimeContributor })
        );
      }
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
    } else {
      context.github.issues.addLabels(
        context.issue({
          labels: ["WIP :construction_worker_man:"]
        })
      );
    }
  });

  app.on(["pull_request.edited", "pull_request.synchronize"], async context => {
    if (!context.payload.pull_request.draft) {
      const comments = await context.config("bot-files/comments.yml");
      context.github.issues.createComment(
        context.issue({ body: comments.prEdit })
      );
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
  });

  app.on("pull_request.reopened", async context => {
    if (!context.payload.pull_request.draft) {
      const comments = await context.config("bot-files/comments.yml");
      context.github.issues.createComment(
        context.issue({ body: comments.prReopen })
      );
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
  });

  commands(app, "bot", async (context, command) => {
    if ("run" === command.arguments.split(/, */).toString()) {
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
  });
};
