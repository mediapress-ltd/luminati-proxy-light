const { spawn } = require("child_process");
const { join } = require("path");
const git = require("simple-git/promise");

async function run(command, args = undefined, opts = undefined) {
  return new Promise((resolve) => {
    const child = spawn(command, args, opts);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on("exit", (code) =>
      code === 0 ? resolve(code) : process.exit(code)
    );
  });
}

async function update() {
  try {
    // Repo paths
    const vendorRepo = join(__dirname, "../vendor/luminati-io/luminati-proxy");
    const repo = join(__dirname, "../");
    const args = process.argv.slice(2);
    const version = args[0];

    if (!version) {
      console.error("version missing");
      console.error("Usage: yarn update-vendor <version>");
      process.exit(1);
    }

    console.log(`Updating vendor submodule to v${version}...`);
    await git(repo).submoduleUpdate(["--remote"]);
    await git(vendorRepo).checkout(`v${version}`);

    console.log("Committing changes...");
    await git(repo).add("vendor/luminati-io/luminati-proxy");
    await git(repo).commit(
      `Updated @luminati-io/luminati-proxy to v${version}`,
      undefined,
      { "--all": true, "--amend": true }
    );

    console.log("Setting version for NPM...");
    await run("npm", ["version", version, "--allow-same-version"]);
  } catch (error) {
    console.error(error.toString());
    process.exit(1);
  }
}

update();
