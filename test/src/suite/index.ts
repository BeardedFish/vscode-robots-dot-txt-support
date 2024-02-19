import * as glob from "glob";
import * as Mocha from "mocha";
import * as path from "path";

const MOCHA_TEST_TIMEOUT_MS: number = 60000;

export function run(): Promise<void> {
	const mocha: Mocha = new Mocha({
		ui: "tdd",
		color: true,
		timeout: MOCHA_TEST_TIMEOUT_MS
	});

	const testsRoot: string = path.resolve(__dirname, "..");

	return new Promise((resolve, reject) => {
		glob("**/**.test.js", { cwd: testsRoot }, (error: Error | null, files: string[]) => {
			if (error !== null) {
				return reject(error);
			}

			// Add files to the test suite
			for (const file of files) {
				mocha.addFile(path.resolve(testsRoot, file));
			}

			try {
				// Run the Mocha tests
				mocha.run(failures => {
					if (failures > 0) {
						reject(`${failures} tests failed.`);
					} else {
						resolve();
					}
				});
			} catch (error: unknown) {
				console.error(error);
				reject(error);
			}
		});
	});
}
