const { getDelegate } = require("../src/lib/main/delegator");
const bot = require("../src/lib/main/main-bot");
const commands = require("probot-commands");
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  app.on("pull_request.opened", async context => {
    getDelegate(context).pullRequestOpened(context);
  });

  app.on(["pull_request.edited", "pull_request.synchronize"], async context => {
    getDelegate(context).pullRequestChanged(context);
  });

  app.on("pull_request.reopened", async context => {
    getDelegate(context).pullRequestReopened(context);
  });

  commands(app, "bot", async (context, command) => {
    if ("run" === command.arguments.split(/, */).toString()) {
      bot.run(context);
    }
  });
};
