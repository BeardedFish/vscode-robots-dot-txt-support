/**
 *  @fileoverview    Interacting with the client's configuration settings.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { Connection, DidChangeConfigurationParams } from "vscode-languageserver";

export type RobotsDotTextConfiguration = {
	analyzeSyntax: boolean
}

const DEFAULT_CONFIGURATION: RobotsDotTextConfiguration = {
	analyzeSyntax: true
};

const DOCUMENT_CONFIGURATION_MANAGER: Map<string, Thenable<RobotsDotTextConfiguration>> = new Map();

let globalConfiguration: RobotsDotTextConfiguration = DEFAULT_CONFIGURATION;

export function onConfigurationChanged(
	hasConfigurationCapability: boolean,
	didChangeConfigurationParams: DidChangeConfigurationParams
) {
	if (hasConfigurationCapability) {
		DOCUMENT_CONFIGURATION_MANAGER.clear();
		return;
	}

	globalConfiguration = <RobotsDotTextConfiguration>(
		didChangeConfigurationParams.settings.robots.text || DEFAULT_CONFIGURATION
	);
}

export function getDocumentConfiguration(
	connection: Connection,
	hasConfigurationCapability: boolean,
	resource: string
): Thenable<RobotsDotTextConfiguration> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalConfiguration);
	}

	let result: Thenable<RobotsDotTextConfiguration> | undefined = DOCUMENT_CONFIGURATION_MANAGER.get(resource);

	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: "robots.text"
		});

		DOCUMENT_CONFIGURATION_MANAGER.set(resource, result);
	}

	return result;
}
