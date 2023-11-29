/**
 *  @fileoverview    Main entrypoint of the Robots.txt Support for Visual Studio Code language server.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { resetTextDocumentDiagnostics, validateRobotsDotTextDocument } from "@language-server/core/analysis";
import { DIRECTIVE_COMPLETION_SCOPE_LOOKUP_TABLE, VALID_ROBOTS_TEXT_DIRECTIVES } from "@language-server/core/autocompletion";
import { getFormatDocumentTextEdits } from "@language-server/core/format";
import {
	ROBOTS_DOT_TXT_DIRECTIVE_SEPARATOR,
	RobotsDotTextToken,
	RobotsDotTextTokenType,
	tokenizeRobotsDotTextConfig
} from "@language-server/core/tokenization";
import { onConfigurationChanged } from "@language-server/utils/configuration";
import { getDocumentCurrentLineTextFromCursor } from "@language-server/utils/document";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	InitializeResult,
	TextDocumentSyncKind,
	TextDocumentPositionParams,
	CompletionItem,
	TextDocumentChangeEvent,
	CompletionItemKind,
	DocumentFormattingParams,
	TextEdit,
	InitializeParams,
	Connection,
	ClientCapabilities,
	DidChangeConfigurationNotification,
	DidChangeConfigurationParams
} from "vscode-languageserver/node";

const CONNECTION: Connection = createConnection(ProposedFeatures.all);
const DOCUMENT_MANAGER: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability: boolean = false;
let hasDiagnosticRelatedInformationCapability: boolean = false;

CONNECTION.onInitialize(async function(initializeParams: InitializeParams): Promise<InitializeResult> {
	const capabilities: ClientCapabilities = initializeParams.capabilities;

	hasConfigurationCapability = !!(
		capabilities.workspace &&
		!!capabilities.workspace.configuration
	);

	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	const result: InitializeResult = {
		capabilities: {
			documentFormattingProvider: true,
			textDocumentSync: TextDocumentSyncKind.Full,
			completionProvider: {
				triggerCharacters: [
					" "
				]
			}
		}
	};

	return result;
});

CONNECTION.onInitialized(function(): void {
	if (hasConfigurationCapability) {
		CONNECTION.client.register(DidChangeConfigurationNotification.type, undefined);
	}
});

CONNECTION.onCompletion(
	async (textDocumentPositionParams: TextDocumentPositionParams): Promise<CompletionItem[]> => {
		const textDocument: TextDocument | undefined = DOCUMENT_MANAGER.get(textDocumentPositionParams.textDocument.uri);
		const currentLineText: string = getDocumentCurrentLineTextFromCursor(textDocument, textDocumentPositionParams);

		if (currentLineText.length === 0) {
			return [];
		}

		let completionItemList: CompletionItem[] = [];

		if (
			currentLineText.length > 0 &&
			currentLineText.indexOf(ROBOTS_DOT_TXT_DIRECTIVE_SEPARATOR) === -1
		) {
			for (const directive of VALID_ROBOTS_TEXT_DIRECTIVES) {
				const directiveCompletionItem: CompletionItem = {
					label: directive.name,
					kind: CompletionItemKind.Property
				};

				directiveCompletionItem.insertText = `${directive.name}: `;
				directiveCompletionItem.detail = directive.description;
				directiveCompletionItem.command = {
					title: "Re-trigger auto completion suggestions",
					command: "editor.action.triggerSuggest"
				};

				completionItemList.push(directiveCompletionItem)
			}
		} else {
			const currentLineToken: RobotsDotTextToken = tokenizeRobotsDotTextConfig(currentLineText)[0];

			if (
				currentLineToken.type === RobotsDotTextTokenType.Directive &&
				currentLineToken.directive !== undefined
			) {
				if (currentLineToken.directive.value.length === 0) {
					const directive: string = currentLineToken.directive.name.toLowerCase();

					if (directive in DIRECTIVE_COMPLETION_SCOPE_LOOKUP_TABLE) {
						completionItemList = DIRECTIVE_COMPLETION_SCOPE_LOOKUP_TABLE[directive];
					}
				}
			}
		}

		return completionItemList;
	}
);

CONNECTION.onDocumentFormatting(
	(documentFormattingParams: DocumentFormattingParams): TextEdit[] => {
		const document: TextDocument | undefined = DOCUMENT_MANAGER.get(documentFormattingParams.textDocument.uri);

		if (document === undefined) {
			return [];
		}

		return getFormatDocumentTextEdits(document.getText());
	}
);

CONNECTION.onDidChangeConfiguration(async function(didChangeConfigurationParams: DidChangeConfigurationParams): Promise<void> {
	onConfigurationChanged(hasConfigurationCapability, didChangeConfigurationParams);

	for (const textDocument of DOCUMENT_MANAGER.all()) {
		resetTextDocumentDiagnostics(CONNECTION, textDocument.uri);

		await validateRobotsDotTextDocument(
			hasConfigurationCapability,
			hasDiagnosticRelatedInformationCapability,
			CONNECTION,
			textDocument.uri,
			textDocument.getText()
		);
	}
});

DOCUMENT_MANAGER.onDidChangeContent(async function(event: TextDocumentChangeEvent<TextDocument>): Promise<void> {
	await validateRobotsDotTextDocument(
		hasConfigurationCapability,
		hasDiagnosticRelatedInformationCapability,
		CONNECTION,
		event.document.uri,
		event.document.getText()
	);
});

DOCUMENT_MANAGER.listen(CONNECTION);
CONNECTION.listen();
