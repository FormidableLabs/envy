# Contributing

## How to Contribute

Envy is open to pull requests, issue reports, and questions from the community. Here are some good ways to get help if you need it.

- If you have a question, please [open a new Q&A discussion thread](https://github.com/FormidableLabs/envy/discussions/new)
- If you think you have found a bug, [open a new issue](https://github.com/FormidableLabs/envy/issues/new)

### Current goals and initiatives

We are currently working toward our first 1.0 release. As such, current features and APIs should be considered experimental and may rapidly change.

## Monorepo!

Envy is a monorepo managed by [Yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) and commands are executed using [TurboRepo](https://turbo.build/repo/docs)

### Requirements

- [Node.js](https://nodejs.org/) 16 or higher.
- [yarn](https://yarn.io/) 1.2 or higher.

### Setup

Clone this repo:

```sh
$ git clone https://github.com/FormidableLabs/envy.git
$ cd envy
```

Use [yarn](https://classic.yarnpkg.com/) to install dependencies:

```sh
$ yarn install
```

## Development

### Builds

To typecheck and build all applications, execute this from root

```
yarn build
```

### Running examples

To run examples for testing, execute a build and then running an example command

```sh
$ yarn example:apollo
```

## Release

We use [changesets](https://github.com/changesets/changesets) to create package versions and publish them.

### Using changesets

Our official release path is to use automation to perform the actual publishing of our packages. The steps are to:

1. A human developer adds a changeset. Ideally this is as a part of a PR that will have a version impact on a package.
2. On merge of a PR our automation system opens a "Version Packages" PR.
3. On merging the "Version Packages" PR, the automation system publishes the packages.

Here are more details:

### Add a changeset

When you would like to add a changeset (which creates a file indicating the type of change), in your branch/PR issue this command:

```sh
$ yarn changeset
```

to produce an interactive menu. Navigate the packages with arrow keys and hit `<space>` to select 1+ packages. Hit `<return>` when done. Select semver versions for packages and add appropriate messages. From there, you'll be prompted to enter a summary of the change. Some tips for this summary:

1. Aim for a single line, 1+ sentences as appropriate.
2. Include issue links in GH format (e.g. `#123`).
3. You don't need to reference the current pull request or whatnot, as that will be added later automatically.

After this, you'll see a new uncommitted file in `.changesets` like:

```sh
$ git status
# ....
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.changeset/flimsy-pandas-marry.md
```

Review the file, make any necessary adjustments, and commit it to source. When we eventually do a package release, the changeset notes and version will be incorporated!

### Creating versions

On a merge of a feature PR, the changesets GitHub action will open a new PR titled `"Version Packages"`. This PR is automatically kept up to date with additional PRs with changesets. So, if you're not ready to publish yet, just keep merging feature PRs and then merge the version packages PR later.

### Publishing packages

On the merge of a version packages PR, the changesets GitHub action will publish the packages to npm.

### The manual version

For exceptional circumstances, here is a quick guide to manually publishing from a local computer using changesets.

1. Add a changeset with `yarn changeset`. Add changeset file, review file, tweak, and commit.
2. Make a version. Due to our changelog plugin you will need to create a personal GitHub token and pass it to the environment.

    ```sh
    $ GITHUB_TOKEN=<INSERT TOKEN> yarn run version
    ```

    Review git changes, tweak, and commit.

3. Publish.

    First, build necessary files:

    ```sh
    # Build everything
    $ yarn build
    ```

    Then publish:

    ```sh
    # Test things out first
    $ yarn changeset publish --dry-run

    # The real publish
    # This first does a single git tag (if not already present), then publishes
    $ yarn changeset publish --otp=<insert otp code>
    ```

    Note that publishing multiple pacakges via `changeset` to npm with an OTP code can often fail with `429 Too Many Requests` rate limiting error. Take a 5+ minute coffee break, then come back and try again.

    Then issue the following to also push git tags:

    ```sh
    $ git push && git push --tags
    ```

## Contributor Covenant Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of
experience, nationality, personal appearance, race, religion, or sexual identity
and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

- The use of sexualized language or imagery and unwelcome sexual attention or
  advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or electronic
  address, without explicit permission
- Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at coc@formidable.com. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage],
version 1.4, available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
