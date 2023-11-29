/**
 *  @fileoverview    Contains logic for commands invoked by an end user via the Command Palette.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { getCrawlerHttpHeaders, validateHttpUrl } from "@client/networking/http";
import fetch, { Response } from "node-fetch";
import { ExtensionContext, Range, TextDocument, TextEditor, TextEditorEdit, window } from "vscode";

export enum RobotsDotTextExtensionCommand {
	ImportRobotsDotTextFileFromWeb = "robotsDotText.importRobotsDotTextFileFromWeb"
}

export async function importRobotsDotTextFileFromWeb(context: ExtensionContext): Promise<void> {
	const userInput: string | undefined = await window.showInputBox({ prompt: "Domain/Absolute Path", value: "", validateInput: validateHttpUrl });

	if (userInput === undefined) {
		return;
	}

	try {
		const url: URL = new URL(userInput);
		let robotsDotTextLocation: string = url.toString();

		if (!url.pathname.endsWith("/robots.txt")) {
			robotsDotTextLocation = `${url.origin}/robots.txt`;
		}

		const response: Response = await fetch(robotsDotTextLocation, {
			headers: {
				"Accept": "text/plain",
				...getCrawlerHttpHeaders(context)
			}
		});

		if (!response.ok) {
			throw new Error("HTTP response was not OK (200).");
		}

		const robotsDotTextContent: string = await response.text();
		const activeTextEditor: TextEditor | undefined = window.activeTextEditor;

		if (activeTextEditor === undefined) {
			throw new Error("No active text editor.");
		}

		const currentDocument: TextDocument | undefined = activeTextEditor.document;

		const documentUpdated: boolean = await activeTextEditor.edit(function(editBuilder: TextEditorEdit) {
			const documentRange: Range = new Range(
				currentDocument.lineAt(0).range.start,
				currentDocument.lineAt(currentDocument.lineCount - 1).range.end
			);

			editBuilder.replace(documentRange, robotsDotTextContent);
		});

		if (documentUpdated) {
			window.showInformationMessage(`The robots.txt file was successfully loaded from: ${robotsDotTextLocation}`);
		} else {
			window.showErrorMessage("Failed to import the robots.txt file due to an unknown error.");
		}
	} catch (error: Error | unknown) {
		window.showErrorMessage(`An error occurred while attemping to import the robots.txt file. Reason: ${error}`);
	}
}
