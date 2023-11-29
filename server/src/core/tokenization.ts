/**
 *  @fileoverview    Contains functions to convert a Robots.txt file into TypeScript object tokens.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { Range } from "vscode-languageserver";

const ROBOTS_DOT_TXT_COMMENT_PREFIX: string = "#";

export const ROBOTS_DOT_TXT_DIRECTIVE_SEPARATOR: string = ":";

export enum RobotsDotTextTokenType {
	BlankLine,
	Comment,
	Directive,
	SyntaxError,
}

export type RobotsDotTextLine = {
	raw: string;
	rawRange: Range;
	sanitized: string;
	sanitizedRange: Range;
}

export type RobotsDotTextDirective = {
	name: string;
	nameRange: Range;
	value: string;
	valueRange: Range;
	inlineComment?: string;
}

export class RobotsDotTextToken {
	type: RobotsDotTextTokenType;
	line: RobotsDotTextLine;
	directive?: RobotsDotTextDirective | undefined;

	constructor(
		type: RobotsDotTextTokenType,
		line: RobotsDotTextLine,
		directive?: RobotsDotTextDirective | undefined
	) {
		this.type = type;
		this.line = line;
		this.directive = directive;
	}

	toString(): string {
		if (this.type === RobotsDotTextTokenType.BlankLine) {
			return "";
		}

		if (this.type === RobotsDotTextTokenType.Directive && this.directive !== undefined) {
			let robotsDotTextInstruction: string = `${this.directive.name}: ${this.directive.value}`;

			if (this.directive.inlineComment !== undefined) {
				if (this.directive.value.length > 0) {
					robotsDotTextInstruction += " ";
				}

				robotsDotTextInstruction += this.directive.inlineComment;
			}

			return robotsDotTextInstruction;
		}

		return this.line.sanitized;
	}
}

export const tokenizeRobotsDotTextConfig = function(configRawText: string | undefined): RobotsDotTextToken[] {
	if (configRawText === undefined) {
		return [];
	}

	const robotsDotTextTokens: RobotsDotTextToken[] = [];
	const configLineList: string[] = configRawText.split("\n");
	let currentLineIndex: number = -1;

	for (const rawLine of configLineList) {
		++currentLineIndex;

		const sanitizedLine: string = rawLine.trim();
		const sanitizedLineFirstCharacter = rawLine.indexOf(sanitizedLine);

		const currentLine: RobotsDotTextLine = {
			raw: rawLine,
			rawRange: {
				start: {
					line: currentLineIndex,
					character: 0
				},
				end: {
					line: currentLineIndex,
					character: rawLine.length
				}
			},
			sanitized: sanitizedLine,
			sanitizedRange: {
				start: {
					line: currentLineIndex,
					character: sanitizedLineFirstCharacter
				},
				end: {
					line: currentLineIndex,
					character: sanitizedLineFirstCharacter + sanitizedLine.length
				}
			}
		};

		if (sanitizedLine.length === 0) {
			robotsDotTextTokens.push(new RobotsDotTextToken(
				RobotsDotTextTokenType.BlankLine,
				currentLine
			));

			continue;
		}

		if (sanitizedLine.startsWith(ROBOTS_DOT_TXT_COMMENT_PREFIX)) {
			robotsDotTextTokens.push(new RobotsDotTextToken(
				RobotsDotTextTokenType.Comment,
				currentLine
			));

			continue;
		}

		const directiveSeparatorIndex: number = sanitizedLine.indexOf(ROBOTS_DOT_TXT_DIRECTIVE_SEPARATOR);

		if (directiveSeparatorIndex !== -1) {
			const directiveName: string = sanitizedLine.substring(0, directiveSeparatorIndex).trim();
			let directiveValue: string = "";
			let directiveInlineComment: string | undefined = undefined;

			if (directiveSeparatorIndex + 1 < sanitizedLine.length) {
				directiveValue = sanitizedLine.substring(directiveSeparatorIndex + 1, rawLine.length).trim();

				const inlineCommentStartIndex: number = directiveValue.indexOf(ROBOTS_DOT_TXT_COMMENT_PREFIX);

				if (inlineCommentStartIndex !== -1) {
					directiveInlineComment = directiveValue.substring(inlineCommentStartIndex, directiveValue.length);
					directiveValue = directiveValue.substring(0, inlineCommentStartIndex).trim();
				}
			}

			const directiveNameIndex: number = rawLine.indexOf(directiveName);
			const directiveValueIndex: number = rawLine.indexOf(directiveValue, directiveNameIndex + directiveName.length);

			const nameRange: Range = {
				start: {
					line: currentLineIndex,
					character: directiveNameIndex
				},
				end: {
					line: currentLineIndex,
					character: directiveNameIndex + directiveName.length
				}
			};

			const valueRange: Range = {
				start: {
					line: currentLineIndex,
					character: directiveValueIndex
				},
				end: {
					line: currentLineIndex,
					character: directiveValueIndex + directiveValue.length
				}
			};

			robotsDotTextTokens.push(new RobotsDotTextToken(
				RobotsDotTextTokenType.Directive,
				currentLine,
				{
					name: directiveName,
					nameRange: nameRange,
					value: directiveValue,
					valueRange: valueRange,
					inlineComment: directiveInlineComment
				}
			));

			continue;
		}

		robotsDotTextTokens.push(new RobotsDotTextToken(
			RobotsDotTextTokenType.SyntaxError,
			currentLine
		));
	}

	return robotsDotTextTokens;
}

export default {
	RobotsDotTextTokenType,
	tokenizeRobotsDotTextConfig
}
