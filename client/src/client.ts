/**
 * @fileoverview    Main entrypoint of the Robots.txt Support for Visual Studio Code client extension.
 * @author          Darian Benam <darian@darianbenam.com>
 */

import * as path from "path";
import { importRobotsDotTextFileFromWeb, RobotsDotTextExtensionCommand } from "@client/commands/command-handler";
import { setupLanguageServerClient } from "@client/core/language-server-client";
import { commands, Disposable, ExtensionContext } from "vscode";
import { LanguageClient } from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext): void {
	const extensionEventHandlers: Disposable[] = [
		commands.registerCommand(RobotsDotTextExtensionCommand.ImportRobotsDotTextFileFromWeb, () => importRobotsDotTextFileFromWeb(context))
	];

	context.subscriptions.push(...extensionEventHandlers);

	client = setupLanguageServerClient(
		path.join("server", "dist", "server.js"),
		context
	);
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}

	return client.stop();
}
