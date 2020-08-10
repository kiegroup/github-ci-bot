# kie-ci-bot

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Probot app

kie-ci-bot is a simple bot which was created to automate few tasks done manually till now.

- Ask for reviewers based on the changed files
- Add labels to PR depending on the changed files
- Comment on the PR on different events.
- Trigger your jenkins pipeline if change in specified files.

You need to create 4 files for this bot to work properly. For example on how to define these files please checkout the file which has more description.

- [labels.yml](docs/labels.yml)
- [comments.yml](docs/comments.yml)
- [reviewers.yml](docs/reviewers.yml)
- [paths.yml](docs/paths.yml)

You'll need to have these files inside `.github/bot-files/` directory in your project

## Installation

**Note**: node v12.18.0++ is required for this project.

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

**Note**: On the initial setup the bot creates a `.env` file in your project root which has all the secrets and webhook required for your bot to work with github. However you can create that file yourself. For that please see an example for the [file](docs/.env.example)

After bot is running, it'll open a probot appilication on your `http://localhost:3000`, open the URL and follow the instruction to install the bot in your organization.

After the installation is complete, you can close the `npm start` process. Notice the `.env` file is automatically created in your project root with all the required values. After this you start your bot with `npm run dev` which'll start the bot in the developement mode.

### Running bot inside a container

After the installation, you can run your bot inside a container.

```sh
# Build container image for bot
docker build -t <preferred-tag-name> .

# Run the bot
docker run -d <preferred-tag-name>
```

### Running bot in Kubernetes/Openshift

If you wish to run the bot on a Kubernetes platform, follow the steps.

```sh
# Build conatiner image for bot
docker build -t <preferred-tag-name> .

# Push image to a public repository
docker push <preferred-tag-name>

# Run bot with kubernetes imperitive command
kubectl create deployment <your-bot-deployment-name> --image=<preferred-tag-name>
```

## Contributing

If you have suggestions for how kie-ci-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[Apache 2.0](LICENSE) © 2020 Tarun Khandelwal <tarkhand@redhat.com>
