/**
 *  @fileoverview    Main entry point of the Robots.txt Support for Visual Studio Code extension.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { analyzeRobotsDotTextConfig } from "./Core/Analysis";
import { RobotsDotTextToken, tokenizeRobotsDotTextConfig } from "./Core/Tokenization";
import { formatRobotsDotTextDocument } from "./Core/Format";
import {
	DiagnosticCollection,
	Disposable,
	ExtensionContext,
	languages,
	TextDocument,
	TextEdit,
	window,
	workspace
} from "vscode";

const ROBOTS_DOT_TXT_LANGUAGE_ID: string = "robots-txt";

const DIAGNOSTIC_COLLECTION: DiagnosticCollection = languages.createDiagnosticCollection("robots-txt");

export function activate(context: ExtensionContext): void {
	const extensionEventHandlers: Disposable[] = [
		workspace.onDidChangeTextDocument(event => {
			const document: TextDocument = event.document;

			if (document.languageId !== ROBOTS_DOT_TXT_LANGUAGE_ID) {
				return
			}

			const robotsDotTextTokens: RobotsDotTextToken[] = tokenizeRobotsDotTextConfig(document);

			analyzeRobotsDotTextConfig(document, robotsDotTextTokens, DIAGNOSTIC_COLLECTION);
		})
	];

	context.subscriptions.push(...extensionEventHandlers);

	languages.registerDocumentFormattingEditProvider(ROBOTS_DOT_TXT_LANGUAGE_ID, {
		provideDocumentFormattingEdits(document: TextDocument): TextEdit[] {
			return formatRobotsDotTextDocument(document);
		}
	});

	const activeDocument: TextDocument | undefined = window.activeTextEditor?.document;

	if (activeDocument?.languageId === ROBOTS_DOT_TXT_LANGUAGE_ID) {
		const robotsDotTextTokens: RobotsDotTextToken[] = tokenizeRobotsDotTextConfig(activeDocument);
		analyzeRobotsDotTextConfig(activeDocument, robotsDotTextTokens, DIAGNOSTIC_COLLECTION);
	}
}

export function deactivate(): void {
	DIAGNOSTIC_COLLECTION.dispose();
}
