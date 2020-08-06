async function pullRequestOpened(context) {
  context.github.issues.addLabels(
    context.issue({
      labels: ["WIP :construction_worker_man:"]
    })
  );
}

async function pullRequestReopened(context) {
  // nothing to do
  return context;
}

async function pullRequestChanged(context) {
  //nothing to do
  return context;
}

module.exports = {
  pullRequestOpened,
  pullRequestReopened,
  pullRequestChanged
};
