/**
 *  @fileoverview    Analyzes a Robots.txt document's syntax and uses Visual Studio Code's diagnostic API to alert
 *                   the user of the issues.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { RobotsDotTextToken, RobotsDotTextTokenType } from "./Tokenization";
import {
	Diagnostic,
	DiagnosticCollection,
	DiagnosticSeverity,
	DiagnosticTag,
	Range,
	TextDocument
} from "vscode";

const VALID_ROBOTS_TXT_DIRECTIVES: string[] = [
	"allow",
	"crawl-delay",
	"disallow",
	"host",
	"sitemap",
	"user-agent"
];

const isValidRobotsDotTextDirective = function(directive: string): boolean {
	return VALID_ROBOTS_TXT_DIRECTIVES.includes(directive.toLowerCase());
}

const createDiagnosticIssue = function(
	diagnosticList: Diagnostic[],
	errorMessage: string,
	tokenRange: Range,
	severity: DiagnosticSeverity,
	isUneccessaryCode: boolean = false
): void {
	const diagnosticIssue: Diagnostic = new Diagnostic(
		tokenRange,
		errorMessage,
		severity
	);

	if (isUneccessaryCode) {
		diagnosticIssue.tags = [ DiagnosticTag.Unnecessary ];
	}

	diagnosticList.push(diagnosticIssue);
}

export const analyzeRobotsDotTextConfig = function(
	document: TextDocument,
	configTokens: RobotsDotTextToken[],
	diagnosticCollection: DiagnosticCollection
): void {
	const diagnosticList: Diagnostic[] = [];
	let userAgentDirectiveFound: boolean = false;

	for (const token of configTokens) {
		switch (token.type) {
			case RobotsDotTextTokenType.Directive: {
				if (token.directive == null) {
					continue;
				}

				const directiveName: string = token.directive.name;
				const directiveValue: string = token.directive.value;

				if (!userAgentDirectiveFound) {
					if (directiveName.toLowerCase() === "user-agent") {
						userAgentDirectiveFound = true;
					} else {
						if (directiveName.toLowerCase() !== "sitemap") {
							createDiagnosticIssue(
								diagnosticList,
								"No user-agent specified.",
								token.line.sanitizedRange,
								DiagnosticSeverity.Error,
								true
							);
						}
					}
				}

				if (!isValidRobotsDotTextDirective(directiveName)) {
					createDiagnosticIssue(
						diagnosticList,
						`Unknown Robots.txt directive: \`${directiveName}\``,
						token.line.sanitizedRange,
						DiagnosticSeverity.Warning
					);
				}

				if (directiveName.toLocaleLowerCase() === "crawl-delay") {
					if (!/^[0-9]\d*$/.test(directiveValue)) {
						createDiagnosticIssue(
							diagnosticList,
							"`Crawl-delay` must be a number greater than or equal to zero.",
							token.directive.valueRange,
							DiagnosticSeverity.Error
						);
					}
				} else if (directiveName.toLocaleLowerCase() === "sitemap") {
					if (!/^(https?:\/\/)/i.test(directiveValue)) {
						createDiagnosticIssue(
							diagnosticList,
							"`Sitemap` must be an absolute URL.",
							token.directive.valueRange,
							DiagnosticSeverity.Warning
						);
					}
				}

				break;
			}
			case RobotsDotTextTokenType.SyntaxError:
				createDiagnosticIssue(
					diagnosticList,
					`Unknown Robots.txt entity: \`${token.line.sanitized}\`.`,
					token.line.sanitizedRange,
					DiagnosticSeverity.Warning
				);
				break;
		}
	}

	diagnosticCollection.set(document.uri, diagnosticList);
}
