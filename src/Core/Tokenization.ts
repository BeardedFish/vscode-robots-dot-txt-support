/**
 *  @fileoverview    Contains functions to convert a Robots.txt file into TypeScript object tokens.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { Position, Range } from "vscode";

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

		if (this.type === RobotsDotTextTokenType.Directive) {
			return `${this.directive?.name}: ${this.directive?.value}`;
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
			rawRange: new Range(
				new Position(currentLineIndex, 0),
				new Position(currentLineIndex, rawLine.length)
			),
			sanitized: sanitizedLine,
			sanitizedRange: new Range(
				new Position(currentLineIndex, sanitizedLineFirstCharacter),
				new Position(currentLineIndex, sanitizedLineFirstCharacter + sanitizedLine.length)
			)
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

			if (directiveSeparatorIndex + 1 < sanitizedLine.length) {
				directiveValue = sanitizedLine.substring(directiveSeparatorIndex + 1, rawLine.length).trim()
			}

			const directiveNameIndex: number = rawLine.indexOf(directiveName);
			const directiveValueIndex: number = rawLine.indexOf(directiveValue, directiveNameIndex + directiveName.length);

			const nameRange: Range = new Range(
				new Position(currentLineIndex, directiveNameIndex),
				new Position(currentLineIndex, directiveNameIndex + directiveName.length)
			);

			const valueRange: Range = new Range(
				new Position(currentLineIndex, directiveValueIndex),
				new Position(currentLineIndex, directiveValueIndex + directiveValue.length)
			);

			robotsDotTextTokens.push(new RobotsDotTextToken(
				RobotsDotTextTokenType.Directive,
				currentLine,
				{
					name: directiveName,
					nameRange: nameRange,
					value: directiveValue,
					valueRange: valueRange
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
