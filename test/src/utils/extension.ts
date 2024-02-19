import * as path from "path";
import * as vscode from "vscode";
import { sleep } from "./misc";

const TEST_CONFIGURATION_WORKSPACE: string = path.resolve(__dirname, "../../workspace/");

export async function activateRobotsDotTextExtension(
	sourceCodeDirectory: string | undefined = undefined
): Promise<void> {
	const uri: vscode.Uri = vscode.Uri.file(sourceCodeDirectory || TEST_CONFIGURATION_WORKSPACE);

	await vscode.commands.executeCommand("vscode.openFolder", uri);

	const extension: vscode.Extension<unknown> | undefined = vscode.extensions.getExtension("darian-benam.vscode-robots-dot-txt-support");

	if (extension === undefined) {
		return;
	}

	await extension.activate();

	// Wait for the Robots.txt language server process to initialize
	await sleep(2000);
}

/**
 * Opens a document by URI in Visual Studio Code.
 *
 * @param uri The URI to open in Visual Studio Code.
 * @param languageId The langauge ID of the document that Visual Studio Code will display it as.
 * @param delayMilliseconds The delay in milliseconds to allow the document to initialize (mainly used to wait for diagnostics).
 * @returns A promise to the Visual Studio Code text editor that was opened.
 */
export async function openDocumentByRelativeUri(
	uri: string,
	languageId: string = "robots-txt",
	delayMilliseconds: number = 1000
): Promise<vscode.TextEditor> {
	const textDocument: vscode.TextDocument = await vscode.workspace.openTextDocument(path.resolve(TEST_CONFIGURATION_WORKSPACE, uri));
	const textEditor: vscode.TextEditor = await vscode.window.showTextDocument(textDocument);

	vscode.languages.setTextDocumentLanguage(textDocument, languageId);

	await sleep(delayMilliseconds);

	return textEditor;
}
