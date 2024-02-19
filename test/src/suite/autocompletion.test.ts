import * as assert from "assert";
import * as vscode from "vscode";
import {
	activateRobotsDotTextExtension,
	openDocumentByRelativeUri
} from "../utils/extension";

async function getAutocompletionItemsAtPosition(
	textDocument: vscode.TextDocument,
	cursorPosition: vscode.Position
): Promise<vscode.CompletionList> {
	return (
		await vscode.commands.executeCommand(
			"vscode.executeCompletionItemProvider",
			textDocument.uri,
			cursorPosition
		)
	) as vscode.CompletionList;
}

async function assertAutocompletionListContainsItems(
	textDocument: vscode.TextDocument,
	cursorPosition: vscode.Position,
	expectedAutocompletionList: vscode.CompletionList
): Promise<void> {
	const autocompletionList: vscode.CompletionList = await getAutocompletionItemsAtPosition(
		textDocument,
		cursorPosition
	);

	if (expectedAutocompletionList.items.length > 0) {
		assert.ok(
			autocompletionList.items.length > 0,
			"Autocompletion list was empty"
		);
	}

	for (const expectedAutocompletionItem of expectedAutocompletionList.items) {
		let equivalentAutocompletionItem: vscode.CompletionItem | undefined = undefined;

		for (const autocompletionItem of autocompletionList.items) {
			if (autocompletionItem.label === expectedAutocompletionItem.label) {
				equivalentAutocompletionItem = autocompletionItem;
				break;
			}
		}

		if (equivalentAutocompletionItem !== undefined) {
			assert.equal(
				equivalentAutocompletionItem.kind,
				expectedAutocompletionItem.kind,
				`Autocompletion kind for '${equivalentAutocompletionItem.label}' does not match`
			);
		} else {
			throw new Error(`'${expectedAutocompletionItem.label}' was not found in the autocompletion list`);
		}
	}
}

suite("Robots.txt Language Support for Visual Studio Code - Autocompletion Test Suite", () => {
	setup(async () => {
		await activateRobotsDotTextExtension();
	});

	teardown(async () => {
		await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
	});

	test("'User-agent' Directive Has Autocompletion Items", async () => {
		const textEditor: vscode.TextEditor = await openDocumentByRelativeUri("autocompletion/directive.txt");

		await assertAutocompletionListContainsItems(
			textEditor.document,
			new vscode.Position(0, 12),
			{
				items: [
					{ label: "*", kind: vscode.CompletionItemKind.Value },
					{ label: "Bingbot", kind: vscode.CompletionItemKind.Value },
					{ label: "Googlebot", kind: vscode.CompletionItemKind.Value }
				]
			}
		);
	});

	test("'Allow' Directive Has '/' in Autocompletion List", async () => {
		const textEditor: vscode.TextEditor = await openDocumentByRelativeUri("autocompletion/directive.txt");

		await assertAutocompletionListContainsItems(
			textEditor.document,
			new vscode.Position(1, 7),
			{
				items: [
					{ label: "/", kind: vscode.CompletionItemKind.Value }
				]
			}
		);
	});

	test("'Disallow' Directive Has '/' in Autocompletion List", async () => {
		const textEditor: vscode.TextEditor = await openDocumentByRelativeUri("autocompletion/directive.txt");

		await assertAutocompletionListContainsItems(
			textEditor.document,
			new vscode.Position(2, 10),
			{
				items: [
					{ label: "/", kind: vscode.CompletionItemKind.Value }
				]
			}
		);
	});
});
