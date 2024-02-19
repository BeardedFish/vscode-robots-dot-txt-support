import * as assert from "assert";
import * as vscode from "vscode";
import {
	activateRobotsDotTextExtension,
	openDocumentByRelativeUri
} from "../utils/extension";

const NO_USER_AGENT_SPECIFIED_MESSAGE: string = "No user-agent specified.";

const CRAWL_DELAY_GREATER_EQUAL_ZERO_MESSAGE: string = "`Crawl-delay` must be a number greater than or equal to zero.";

const SITEMAP_ABSOLUTE_URL_MESSAGE: string = "`Sitemap` must be an absolute URL.";

function assertDiagnosticArrayLengthEqual(
	diagnostics: vscode.Diagnostic[],
	expectedLength: number
): void {
	assert.equal(diagnostics.length, expectedLength, "Diagnostics array length does not match");
}

function assertDiagnosticMatch(
	diagnostic: vscode.Diagnostic,
	range: vscode.Range,
	expectedMessage: string
): void {
	assert.equal(
		diagnostic.message,
		expectedMessage,
		"Diagnostic message does not match"
	);

	assert.equal(
		range.start.line,
		diagnostic.range.start.line,
		"Start range line does not match"
	);

	assert.equal(
		range.start.character,
		diagnostic.range.start.character,
		"Start range character does not match"
	);

	assert.equal(
		range.end.line,
		diagnostic.range.end.line,
		"End range line does not match"
	);

	assert.equal(
		range.end.character,
		diagnostic.range.end.character,
		"End range character does not match"
	);
}

suite("Robots.txt Language Support for Visual Studio Code Diagnostics Test Suite", () => {
	setup(async () => {
		await activateRobotsDotTextExtension();
	});

	teardown(async () => {
		await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});

	test("'No user-agent specified' Diagnostics Works", async () => {
		const textEditor: vscode.TextEditor = await openDocumentByRelativeUri("diagnostics/no-user-agent.txt");
		const diagnostics: vscode.Diagnostic[] = vscode.languages.getDiagnostics(textEditor.document.uri);

		assertDiagnosticArrayLengthEqual(diagnostics, 4);

		assertDiagnosticMatch(
			diagnostics[0],
			new vscode.Range(
				new vscode.Position(0, 0),
				new vscode.Position(0, 8)
			),
			NO_USER_AGENT_SPECIFIED_MESSAGE
		);

		assertDiagnosticMatch(
			diagnostics[1],
			new vscode.Range(
				new vscode.Position(1, 0),
				new vscode.Position(1, 11)
			),
			NO_USER_AGENT_SPECIFIED_MESSAGE
		);

		assertDiagnosticMatch(
			diagnostics[2],
			new vscode.Range(
				new vscode.Position(2, 0),
				new vscode.Position(2, 15)
			),
			NO_USER_AGENT_SPECIFIED_MESSAGE
		);

		assertDiagnosticMatch(
			diagnostics[3],
			new vscode.Range(
				new vscode.Position(3, 0),
				new vscode.Position(3, 33)
			),
			NO_USER_AGENT_SPECIFIED_MESSAGE
		);
	});

	test("'User-agent' Directive Solves 'No user-agent specified' Diagnostic", async () => {
		const textEditor: vscode.TextEditor = await openDocumentByRelativeUri("diagnostics/user-agent.txt");
		const diagnostics: vscode.Diagnostic[] = vscode.languages.getDiagnostics(textEditor.document.uri);

		assertDiagnosticArrayLengthEqual(diagnostics, 0);
	});

	test("'Crawl-delay' Directive Diagnostics Work", async () => {
		const textEditor: vscode.TextEditor = await openDocumentByRelativeUri("diagnostics/crawl-delay.txt");
		const diagnostics: vscode.Diagnostic[] = vscode.languages.getDiagnostics(textEditor.document.uri);

		assertDiagnosticArrayLengthEqual(diagnostics, 3);

		assertDiagnosticMatch(
			diagnostics[0],
			new vscode.Range(
				new vscode.Position(1, 11),
				new vscode.Position(1, 11)
			),
			CRAWL_DELAY_GREATER_EQUAL_ZERO_MESSAGE
		);

		assertDiagnosticMatch(
			diagnostics[1],
			new vscode.Range(
				new vscode.Position(2, 13),
				new vscode.Position(2, 14)
			),
			CRAWL_DELAY_GREATER_EQUAL_ZERO_MESSAGE
		);

		assertDiagnosticMatch(
			diagnostics[2],
			new vscode.Range(
				new vscode.Position(3, 13),
				new vscode.Position(3, 15)
			),
			CRAWL_DELAY_GREATER_EQUAL_ZERO_MESSAGE
		);
	});

	test("'Sitemap' Directive Diagnostics Work", async () => {
		const textEditor: vscode.TextEditor = await openDocumentByRelativeUri("diagnostics/sitemap.txt");
		const diagnostics: vscode.Diagnostic[] = vscode.languages.getDiagnostics(textEditor.document.uri);

		assertDiagnosticArrayLengthEqual(diagnostics, 2);

		assertDiagnosticMatch(
			diagnostics[0],
			new vscode.Range(
				new vscode.Position(1, 7),
				new vscode.Position(1, 7)
			),
			SITEMAP_ABSOLUTE_URL_MESSAGE
		);

		assertDiagnosticMatch(
			diagnostics[1],
			new vscode.Range(
				new vscode.Position(2, 9),
				new vscode.Position(2, 21)
			),
			SITEMAP_ABSOLUTE_URL_MESSAGE
		);
	});

	test("Unknown Directive Diagnostics Work", async () => {
		const textEditor: vscode.TextEditor = await openDocumentByRelativeUri("diagnostics/unknown-directive.txt");
		const diagnostics: vscode.Diagnostic[] = vscode.languages.getDiagnostics(textEditor.document.uri);

		assertDiagnosticArrayLengthEqual(diagnostics, 3);

		assertDiagnosticMatch(
			diagnostics[0],
			new vscode.Range(
				new vscode.Position(3, 0),
				new vscode.Position(3, 10)
			),
			"Unknown Robots.txt directive: `Directive`"
		);

		assertDiagnosticMatch(
			diagnostics[1],
			new vscode.Range(
				new vscode.Position(4, 0),
				new vscode.Position(4, 16)
			),
			"Unknown Robots.txt directive: `Directive`"
		);

		assertDiagnosticMatch(
			diagnostics[2],
			new vscode.Range(
				new vscode.Position(9, 0),
				new vscode.Position(9, 12)
			),
			"Unknown Robots.txt directive: `Invalid`"
		);
	});
});
