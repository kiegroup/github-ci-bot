const { getDelegate } = require("../src/lib/main/delegator");
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  app.on("pull_request.ready_for_review", async context => {
    getDelegate(context).pullRequestReadyForReview(context);
  });
  app.on("pull_request.opened", async context => {
    getDelegate(context).pullRequestOpened(context);
  });

  app.on(["pull_request.edited", "pull_request.synchronize"], async context => {
    getDelegate(context).pullRequestChanged(context);
  });

  app.on("pull_request.reopened", async context => {
    getDelegate(context).pullRequestReopened(context);
  });
};
