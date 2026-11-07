# Contribute one small improvement

First use [FirmLens](https://firmlens.app) and write down something you notice. GitHub is the optional route for proposing a change; [channel feedback](homework/START-HERE.md) is equally welcome.

## 1. Create a GitHub account

1. Open [github.com/signup](https://github.com/signup), or sign in if you already have an account.
2. Follow GitHub's prompts for your email, password and a username. A free personal account is enough.
3. Complete the email verification GitHub sends you. Keep your password and any recovery codes private.
4. Sign in. Your **username** is the account name shown on your profile; it is not your email or password.

[GitHub's account guide](https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github).

## 2. Decide whether you want contributor access

Would you like to try making a small PR? If yes, post this in the residency channel:

> I'd like to contribute to FirmLens. My GitHub username is [username]. The thing I noticed on the site was [one sentence]. Please add me as a contributor.

James will send an invitation. Open the GitHub email or notification, sign in to the account you gave James, and accept it. No invitations are automatic. You do not need a Vercel account, a Neon account or James's AI credentials.

The repository is initially private. If its link gives you a 404, check that you are signed in to the invited account and have accepted the invitation. Ask James if access is still missing.

## 3. Open a local copy with your coding agent

A **repository** is the files and their history. A **branch** is your separate set of proposed changes. A **commit** saves a named set of changes. A **pull request** asks James to review your branch; it does not publish it.

Open the repository link James supplies. Click the green **Code** button, select **HTTPS** and copy the repository address. Open Codex or Claude Code and give it this setup prompt:

```text
Help me set up a local copy of this repository: [paste the HTTPS address].
I have accepted James's invitation using GitHub account [username].

Check whether Git, Node.js 22.20.0 and npm are available. If setup or GitHub
sign-in is needed, guide me through the official installer/browser sign-in;
do not ask me to paste a password, token or recovery code into chat.
Clone the repository into a new local folder, open that folder, and read
AGENTS.md, README.md and CONTRIBUTING.md. Create my branch from main named
resident/[my-username]/[short-description]. Never work directly on main.
Run npm ci, npm run verify and npm run dev:demo. Give me the local browser URL.
Do not use production credentials, copy .env files from anyone, deploy, push,
or change code yet. Explain any failure rather than claiming setup succeeded.
```

Your agent can run the setup commands. The underlying sequence is:

```text
git clone [repository HTTPS address]
cd firmlens
git switch -c resident/[your-username]/[short-description]
npm ci
npm run verify
npm run dev:demo
```

Replace the bracketed text; do not type the brackets. `npm run dev:demo` prints a local URL, normally `http://127.0.0.1:3000`. Open the exact URL it prints. The terminal must stay running while you use the preview; Ctrl+C stops it. `PORT` can select another port.

**The local demo uses three invented records.** It lets you test the public interface without a database account or live credentials. It makes no AI calls and does not provide owner editing. For a source-specific issue, give your agent the public source and a clearly labelled local fixture. Owner/authentication/database changes require isolated tests and James's additional review; the demo does not prove those flows.

## 4. Investigate, choose and check

Use the two prompts in [the homework brief](homework/START-HERE.md). Start a fresh agent chat in the cloned folder. Give it your observation, not “review the whole codebase”. Decide which suggestion you want implemented.

When the change is ready, repeat your original task in the local browser. Compare the result with what you expected. For an AI-related change, check the actual output against its source or a labelled test case; a successful build is not a factual accuracy test.

Ask the agent to explain which files changed and why, run `npm run verify`, and show you the diff (the red/green changes discussed in the session). Reject unrelated edits. Keep a screenshot of the before/after result where useful.

## 5. Save your branch and open a PR

When you are satisfied, tell your agent:

```text
I have checked the local result and approve submitting this change for James's
review. Run npm run verify, show me the outcome, and check that only the intended
files are included. Do not include secrets, local settings or generated output.
Commit the change on my resident branch and push only that branch. Give me the
GitHub link to open a pull request. Do not merge or deploy anything.
```

Then on GitHub:

1. Open the repository. Use **Compare & pull request** if shown, or **Pull requests → New pull request**.
2. Set **base: main** and **compare: your resident branch**. Check that the direction is correct.
3. Read **Files changed**. Green is added text, red is removed text. Ask your agent about anything you cannot explain.
4. Give the PR a plain title, such as “Make the source-check date clearer”. Complete the supplied template: your observation, why you chose the change, before/after evidence, checks actually run and any limits.
5. Choose **Create pull request**. Use **Draft pull request** if you want help before it is ready. Post the link in the residency channel so James can find it.
6. James will assess it and may request changes. Further commits pushed to the same branch update the same PR. James decides whether to merge and deploy; do neither yourself.

If you cannot get the local setup working, post your observation and proposed change in the channel. Do not spend the exercise fighting setup or claim to have tested a result you have not seen.

[GitHub PR quickstart](https://docs.github.com/en/pull-requests/get-started/pull-request-quickstart).

## Keep it small

One observed issue or preference per PR. Wording, layout, accessibility and a useful regression test all count. No whole-app rewrites, broad formatting changes or speculative feature lists. Report suspected live security problems privately to James, without trying attacks on the live site.
