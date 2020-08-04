# kie-github-ci-bot.

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Probot app

kie-github-ci-bot is a simple bot which was created to automate few tasks done manually till now.

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

## Setup

**Note**: node v12.18.0++ is required for this project.

```sh
# Install dependencies
npm install

# Run the bot
npm start
```
**Note**: On the initial setup the bot creates a `.env` file in your project root which has all the secrets and webhook required for your bot to work with github. However you can create that file yourself. For that please see an example for the [file](docs/.env.example)

## Contributing

If you have suggestions for how kie-github-ci-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[Apache 2.0](LICENSE) © 2020 Tarun Khandelwal <tarkhand@redhat.com>
