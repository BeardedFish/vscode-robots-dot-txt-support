import { runTests } from "@vscode/test-electron";
import * as path from "path";

async function main(): Promise<void> {
	try {
		// The folder containing the Extension Manifest `package.json` file which is passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath: string = path.resolve(__dirname, "../../");

		// The path to test runner which is passed to `--extensionTestsPath`
		const extensionTestsPath: string = path.resolve(__dirname, "./suite/index");

		// Download Visual Studio Code, unzip it, and run the integration tests
		await runTests({
			extensionDevelopmentPath,
			extensionTestsPath
		});
	} catch (error: unknown) {
		console.error("Failed to run tests", error);
		process.exit(1);
	}
}

main();
