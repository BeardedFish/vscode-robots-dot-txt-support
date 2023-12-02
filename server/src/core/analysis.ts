/**
 *  @fileoverview    Analyzes a Robots.txt document's syntax and uses Visual Studio Code's diagnostic API to alert
 *                   the user of the issues.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { VALID_ROBOTS_TEXT_DIRECTIVES } from "@language-server/core/autocompletion";
import { RobotsDotTextToken, RobotsDotTextTokenType, tokenizeRobotsDotTextConfig } from "@language-server/core/tokenization";
import { RobotsDotTextConfiguration, getDocumentConfiguration } from "@language-server/utils/configuration";
import {
	Connection,
	Diagnostic,
	DiagnosticSeverity,
	DiagnosticTag,
	Range
} from "vscode-languageserver";

function isValidRobotsDotTextDirective(directive: string): boolean {
	for (let i = 0; i < VALID_ROBOTS_TEXT_DIRECTIVES.length; i++) {
		if (VALID_ROBOTS_TEXT_DIRECTIVES[i].name.toLowerCase() === directive.toLowerCase()) {
			return true;
		}
	}

	return false;
}

function createDiagnosticIssue(
	diagnosticList: Diagnostic[],
	errorMessage: string,
	tokenRange: Range,
	severity: DiagnosticSeverity,
	isUneccessaryCode: boolean = false
): void {
	const diagnosticIssue: Diagnostic = {
		range: tokenRange,
		message: errorMessage,
		severity: severity
	};

	if (isUneccessaryCode) {
		diagnosticIssue.tags = [ DiagnosticTag.Unnecessary ];
	}

	diagnosticList.push(diagnosticIssue);
}

function analyzeRobotsDotTextConfig(documentTokens: RobotsDotTextToken[]): Diagnostic[] {
	const diagnosticList: Diagnostic[] = [];

	let userAgentDirectiveFound: boolean = false;

	for (const token of documentTokens) {
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

	return diagnosticList;
}

export function resetTextDocumentDiagnostics(connection: Connection, textDocumentUri: string): void {
	connection.sendDiagnostics({
		uri: textDocumentUri,
		diagnostics: []
	});
}

export async function validateRobotsDotTextDocument(
	hasConfigurationCapability: boolean,
	hasDiagnosticRelatedInformationCapability: boolean,
	connection: Connection,
	documentUri: string,
	documentText: string
): Promise<void> {
	if (!hasDiagnosticRelatedInformationCapability) {
		return;
	}

	const documentConfiguration: RobotsDotTextConfiguration = await getDocumentConfiguration(
		connection,
		hasConfigurationCapability,
		documentUri
	);

	if (!documentConfiguration.analyzeSyntax) {
		return;
	}

	const configTokens: RobotsDotTextToken[] = tokenizeRobotsDotTextConfig(documentText);
	const diagnostics: Diagnostic[] = analyzeRobotsDotTextConfig(configTokens);

	connection.sendDiagnostics({
		uri: documentUri,
		diagnostics: diagnostics
	});
}
