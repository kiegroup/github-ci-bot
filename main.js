/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {


  app.on('pull_request.opened' , async context => {
    const yaml = require('js-yaml');
    const fs   = require('fs');
    const comments = await yaml.safeLoad(fs.readFileSync('comments.yml', 'utf8'));
    const labels = await yaml.safeLoad(fs.readFileSync('labels.yml', 'utf8'));
    if (await isFirstPR(context)){
      context.github.issues.createComment(context.issue({body: comments.prFirstTimeContributor}))
    }

    const trigger_paths =  await yaml.safeLoad(fs.readFileSync('paths.yml', 'utf8'));
    const allReviewers = await yaml.safeLoad(fs.readFileSync('reviewers.yml', 'utf8'));
    await askReview(context, allReviewers)
    await addLabels(context, labels)
    if (await ifCIRequired(context, trigger_paths)){
      context.github.issues.createComment(context.issue({ body: comments.prCiTrigger}))
    }
  })

  app.on('pull_request.edited' , async context => {
    const yaml = require('js-yaml');
    const fs   = require('fs');
    const comments = await yaml.safeLoad(fs.readFileSync('comments.yml', 'utf8'));
    const labels = await yaml.safeLoad(fs.readFileSync('labels.yml', 'utf8'));
    context.github.issues.createComment(context.issue({ body: comments.prEdit}))

    const trigger_paths =  await yaml.safeLoad(fs.readFileSync('paths.yml', 'utf8'));
    const allReviewers = await yaml.safeLoad(fs.readFileSync('reviewers.yml', 'utf8'));
    await askReview(context, allReviewers)
    await addLabels(context, labels)
    if (await ifCIRequired(context, trigger_paths)){
      context.github.issues.createComment(context.issue({ body: comments.prCiTrigger}))
    }
  })


  app.on('pull_request.closed' , async context => {
    const prComment = context.issue({ body: 'Pull Request is closed' })
    return context.github.issues.createComment(prComment)
  })


  app.on('pull_request.reopened' , async context => {
    
    const yaml = require('js-yaml');
    const fs   = require('fs');
    const comments = await yaml.safeLoad(fs.readFileSync('comments.yml', 'utf8'));
    const labels = await yaml.safeLoad(fs.readFileSync('labels.yml', 'utf8'));
    context.github.issues.createComment(context.issue({ body: comments.prReopen}))
    const trigger_paths =  await yaml.safeLoad(fs.readFileSync('paths.yml', 'utf8'));
    const allReviewers = await yaml.safeLoad(fs.readFileSync('reviewers.yml', 'utf8'));
    
    
    if (await ifCIRequired(context, trigger_paths)){
      context.github.issues.createComment(context.issue({ body: comments.prCiTrigger}))
    }
    await askReview(context, allReviewers)
    await addLabels(context, labels)
  })

}

async function ifCIRequired(context, trigger_paths){
  let require = 0
  let changed_files = await getChangedFiles(context)
  trigger_paths.files.forEach(path =>{
      for (let changed of changed_files){
          if(changed.match("^".concat(path))){
            require = require + 1
            break;
          }
      }
  })
  if (require > 0){
    return true
  } else {
    return false
  }
}

async function getChangedFiles(context){
  let changed_files = new Set()
  const parser = require("git-diff-parser");
  const fetch = require("node-fetch");
  const response =  await fetch(context.payload.pull_request.diff_url);
  const diff  = parser(await response.text());
  for (let commit of diff.commits){
        for (let file of commit.files){
          changed_files.add(file.name.toString())
        }
      }

  return changed_files;
}

async function getPossibleReviewers(context, allReviewers){
  let path_reviewers = new Set()
  let default_reviewers = allReviewers.default
  let changed_files = await getChangedFiles(context)
  for (let index in allReviewers.review){
    allReviewers.review[index]['paths'].forEach(path => {
      changed_files.forEach(file =>{
        if (file.match(path)){
          allReviewers.review[index]['reviewers'].forEach(reviewer => {
            path_reviewers.add(reviewer)
          })
        }
      })
    })
  }
  path_reviewers = Array.from(path_reviewers)
  let reviewersList = default_reviewers.concat(path_reviewers)
  const pullRequestAuthor = context.payload.pull_request.user.login
  availableReviewers = reviewersList.filter(reviewer => reviewer != pullRequestAuthor)
  return availableReviewers
}

async function askReview(context, allReviewers){
  let availableReviewers = await getPossibleReviewers(context, allReviewers);
  context.github.pulls.createReviewRequest(
    context.issue ({
      reviewers: availableReviewers
    })
  )
}

async function addLabels(context, labels){
  let labelsToAdd = await getRequiredLables(context, labels)
  context.github.issues.addLabels(context.issue({
    labels: labelsToAdd
  }))
}

async function getRequiredLables(context, labels){
  let path_labels = new Set()
  let default_label = labels.default
  let changed_files = await getChangedFiles(context)
  for(let index in labels.allLabels){
    labels.allLabels[index]['paths'].forEach(path => {
      changed_files.forEach(file =>{
        if (file.match(path)){
          labels.allLabels[index]['label'].forEach(label => {
            path_labels.add(label)
          })
        }
      })
    })
  }
  path_labels = Array.from(path_labels)
  let labelsToAdd = default_label.concat(path_labels)
  return labelsToAdd
}

async function isFirstPR(context){
  const respone = await context.github.issues.listForRepo(context.repo({
    state: 'all',
    creator: context.payload.pull_request.user.login
  }))
  const countPR = respone.data.filter(data => data.pull_request);
  if (countPR.length === 1){
    return true
  } else {
    return false
  }
}