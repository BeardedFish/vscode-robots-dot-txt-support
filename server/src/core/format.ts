/**
 *  @fileoverview    Handles formatting the Robots.txt document.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { RobotsDotTextToken, tokenizeRobotsDotTextConfig } from "@language-server/core/tokenization";
import { TextEdit } from "vscode-languageserver";

export function getFormatDocumentTextEdits(documentText: string): TextEdit[] {
	const robotsDotTextTokens: RobotsDotTextToken[] = tokenizeRobotsDotTextConfig(documentText);
	const formatTextEditList: TextEdit[] = [];

	for (const token of robotsDotTextTokens) {
		formatTextEditList.push(TextEdit.replace(token.line.rawRange, token.toString()));
	}

	return formatTextEditList;
}
