/**
 *  @fileoverview    Utility functions for interacting with a Text Document.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { TextDocumentPositionParams } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

export function getDocumentCurrentLineTextFromCursor(
	document: TextDocument | undefined,
	textDocumentPositionParams: TextDocumentPositionParams
): string {
	if (document === undefined) {
		return "";
	}

	const line: number = textDocumentPositionParams.position.line;
	const character: number = textDocumentPositionParams.position.character;

	return document.getText({
		start: {
			line: line,
			character: 0
		},
		end: {
			line: line,
			character: character
		}
	});
}
