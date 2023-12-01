/**
 *  @fileoverview    Handles basic auto completion IntelliSense for Robots.txt directives.
 *  @author          Darian Benam <darian@darianbenam.com>
 */

import { CompletionItem, CompletionItemKind } from "vscode-languageserver";

export type RobotsDotTextAutoCompletionScope = {
	[directive: string]: CompletionItem[];
}

export type RobotsDotTextDirective = {
	name: string;
	description: string;
}

export const VALID_ROBOTS_TEXT_DIRECTIVES: RobotsDotTextDirective[] = [
	{
		name: "Allow",
		description: "Allows indexing site sections or individual pages."
	},
	{
		name: "Crawl-delay",
		description: "Specifies the minimum interval (in seconds) for the search robot to wait after loading one page before starting to load another." },
	{
		name: "Disallow",
		description: "Prohibits indexing site sections or individual pages."
	},
	{
		name: "Host",
		description: "Specifies the main mirror of the site."
	},
	{
		name: "Sitemap",
		description: "Specifies the absolute path to the `sitemap.xml` file that represents the website's sitemap."
	},
	{
		name: "User-agent",
		description: "Indicates the robot or crawler to which a list of directives apply too."
	}
];

const createAutoCompletionValueItem = function(label: string): CompletionItem {
	return {
		label: label,
		kind: CompletionItemKind.Value
	};
}

export const DIRECTIVE_COMPLETION_SCOPE_LOOKUP_TABLE: RobotsDotTextAutoCompletionScope = {
	"allow": [
		createAutoCompletionValueItem("/")
	],
	"disallow": [
		createAutoCompletionValueItem("/")
	],
	"user-agent": [
		createAutoCompletionValueItem("*"),
		createAutoCompletionValueItem("AhrefsBot"),
		createAutoCompletionValueItem("Applebot"),
		createAutoCompletionValueItem("Baiduspider"),
		createAutoCompletionValueItem("Bingbot"),
		createAutoCompletionValueItem("Bingbot-Image"),
		createAutoCompletionValueItem("Bingbot-Media"),
		createAutoCompletionValueItem("Bingbot-News"),
		createAutoCompletionValueItem("Bingbot-Video"),
		createAutoCompletionValueItem("BingPreview"),
		createAutoCompletionValueItem("BlexBot"),
		createAutoCompletionValueItem("Chrome-Lighthouse"),
		createAutoCompletionValueItem("Dataprovider"),
		createAutoCompletionValueItem("Discordbot"),
		createAutoCompletionValueItem("DuckDuckBot"),
		createAutoCompletionValueItem("EtaoSpider"),
		createAutoCompletionValueItem("Exabot"),
		createAutoCompletionValueItem("Facebot"),
		createAutoCompletionValueItem("FacebookExternalHit"),
		createAutoCompletionValueItem("Google-InspectionTool"),
		createAutoCompletionValueItem("Googlebot"),
		createAutoCompletionValueItem("Googlebot-Image"),
		createAutoCompletionValueItem("Googlebot-News"),
		createAutoCompletionValueItem("Googlebot-Video"),
		createAutoCompletionValueItem("GoogleOther"),
		createAutoCompletionValueItem("Googlebot-Video"),
		createAutoCompletionValueItem("Gort"),
		createAutoCompletionValueItem("LinkedInBot"),
		createAutoCompletionValueItem("MJ12bot"),
		createAutoCompletionValueItem("PiplBot"),
		createAutoCompletionValueItem("SemrushBot"),
		createAutoCompletionValueItem("Slurp"),
		createAutoCompletionValueItem("Storebot-Google"),
		createAutoCompletionValueItem("TelegramBot"),
		createAutoCompletionValueItem("Twitterbot"),
		createAutoCompletionValueItem("UptimeRobot"),
		createAutoCompletionValueItem("YandexAccessibilityBot"),
		createAutoCompletionValueItem("YandexAdNet"),
		createAutoCompletionValueItem("YandexBlogs"),
		createAutoCompletionValueItem("YandexCalendar"),
		createAutoCompletionValueItem("YandexDirect"),
		createAutoCompletionValueItem("YandexDirectDyn"),
		createAutoCompletionValueItem("YandexFavicons"),
		createAutoCompletionValueItem("YaDirectFetcher"),
		createAutoCompletionValueItem("YandexForDomain"),
		createAutoCompletionValueItem("YandexImages"),
		createAutoCompletionValueItem("YandexImageResizer"),
		createAutoCompletionValueItem("YandexMarket"),
		createAutoCompletionValueItem("YandexMedia"),
		createAutoCompletionValueItem("YandexMetrika"),
		createAutoCompletionValueItem("YandexMobileBot"),
		createAutoCompletionValueItem("YandexMobileScreenShotBot"),
		createAutoCompletionValueItem("YandexNews"),
		createAutoCompletionValueItem("YandexOntoDB"),
		createAutoCompletionValueItem("YandexOntoDBAPI"),
		createAutoCompletionValueItem("YandexPagechecker"),
		createAutoCompletionValueItem("YandexPartner"),
		createAutoCompletionValueItem("YandexRCA"),
		createAutoCompletionValueItem("YandexSearchShop"),
		createAutoCompletionValueItem("YandexSitelinks"),
		createAutoCompletionValueItem("YandexScreenshotBot"),
		createAutoCompletionValueItem("YandexTracker"),
		createAutoCompletionValueItem("YandexTracker"),
		createAutoCompletionValueItem("YandexVertis"),
		createAutoCompletionValueItem("YandexVerticals"),
		createAutoCompletionValueItem("YandexVideo"),
		createAutoCompletionValueItem("YandexVideoParser"),
		createAutoCompletionValueItem("YandexWebmaster")
	]
}
