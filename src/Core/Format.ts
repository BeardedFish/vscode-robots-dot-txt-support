/**
 *  @fileoverview    Handles formatting the Robots.txt document.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { RobotsDotTextToken, tokenizeRobotsDotTextConfig } from "./Tokenization";
import { TextDocument, TextEdit } from "vscode";

export const formatRobotsDotTextDocument = function(document: TextDocument): TextEdit[] {
	const robotsDotTextTokens: RobotsDotTextToken[] = tokenizeRobotsDotTextConfig(document);
	const formatTextEditList: TextEdit[] = [];

	for (const token of robotsDotTextTokens) {
		formatTextEditList.push(TextEdit.replace(token.line.rawRange, token.toString()))
	}

	return formatTextEditList;
}
