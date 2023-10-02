# Change Log

## v1.4.0 - 2023-10-01

- Added `From` HTTP header (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/From) to the `Robots.txt: Import From Web` command's web crawler

## v1.3.0 - 2023-08-20

- Added command that allows importing `robots.txt` files from the web: `Robots.txt: Import From Web`

## v1.2.1 - 2023-08-15

- Fixed syntax analysis bug on directives if an inline comment was present

## v1.2.0 - 2023-08-13

- Implemented basic IntelliSense auto completion support (global and scoped)
- Fixed leak issue with two event listeners

## v1.1.0 - 2023-08-12

- Added config setting to toggle syntax analysis - `robots.text.analyzeSyntax`
- Fixed bug with `sitemap` directive analysis (incorrect diagnostic issue)

## v1.0.2 - 2023-08-11

- Added real-time code analysis
- Added formatter
- Fixed bug where syntax highlighting would be incorrect if a directive had leading whitespace or if it contained numbers or periods

## v1.0.1 - 2023-08-07

- Added icon

## v1.0.0 - 2023-08-06

- Initial release
