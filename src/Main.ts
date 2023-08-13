/**
 *  @fileoverview    Main entry point of the Robots.txt Support for Visual Studio Code extension.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { isRobotsDotTextSyntaxAnalysisEnabled } from "./Config/ExtensionConfig";
import { analyzeRobotsDotTextConfig, clearRobotsDotTextConfigDiagnosticIssues } from "./Core/Analysis";
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
		languages.registerDocumentFormattingEditProvider(ROBOTS_DOT_TXT_LANGUAGE_ID, {
			provideDocumentFormattingEdits(document: TextDocument): TextEdit[] {
				return formatRobotsDotTextDocument(document);
			}
		}),
		workspace.onDidChangeConfiguration(event => {
			const robotsDotTextExtensionConfigChanged: boolean = event.affectsConfiguration("robots.text");

			if (!robotsDotTextExtensionConfigChanged) {
				return;
			}

			const isSyntaxAnalysisEnabled: boolean = isRobotsDotTextSyntaxAnalysisEnabled();

			for (const document of workspace.textDocuments) {
				if (document.languageId !== ROBOTS_DOT_TXT_LANGUAGE_ID) {
					continue;
				}

				if (isSyntaxAnalysisEnabled) {
					analyzeRobotsDotTextConfig(document, DIAGNOSTIC_COLLECTION);
				} else {
					clearRobotsDotTextConfigDiagnosticIssues(document, DIAGNOSTIC_COLLECTION);
				}
			}
		}),
		workspace.onDidChangeTextDocument(event => {
			const document: TextDocument = event.document;

			if (document.languageId !== ROBOTS_DOT_TXT_LANGUAGE_ID) {
				return;
			}

			analyzeRobotsDotTextConfig(document, DIAGNOSTIC_COLLECTION);
		})
	];

	context.subscriptions.push(...extensionEventHandlers);

	const activeDocument: TextDocument | undefined = window.activeTextEditor?.document;

	if (activeDocument?.languageId === ROBOTS_DOT_TXT_LANGUAGE_ID) {
		analyzeRobotsDotTextConfig(activeDocument, DIAGNOSTIC_COLLECTION);
	}
}

export function deactivate(): void {
	DIAGNOSTIC_COLLECTION.dispose();
}
