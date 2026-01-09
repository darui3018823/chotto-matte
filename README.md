# Chotto Matte! Generator

> [日本語版はこちら / Japanese version](./japanese/README.md)

<table>
<tr>
<td width="50%">

![Example 1](./assets/example.png)
<p align="center"><em>Page image</em></p>

</td>
<td width="50%">

![Example 2](./assets/example2.png)
<p align="center"><em>Customization example</em></p>

</td>
</tr>
</table>

A single-page tool for placing vertical Japanese text on top of an image. The app ships with adjustable typography, layout controls, theme switching, and a shareable settings code so others can reproduce the same layout.

## Features
- Live text overlay on a preview image with vertical writing
- Font picker (Hiragino, M PLUS 1p, Noto Sans JP, system fallback, or custom Google Fonts) with weight presets
- Controls for size, letter spacing, line height, text box width, position, rotation, and color
- Auto line break toggle for pre or wrapped text
- Custom background image upload (local file) and light/dark theme toggle
- Settings code generator/importer for sharing or restoring configurations
- Font license viewer for LINE Seed JP and Google Fonts families

## Tech Stack
- HTML + Tailwind CDN with a small theme extension in [js/twcss_conf.js](./js/twcss_conf.js)
- Vanilla JavaScript UI logic in [js/script.js](./js/script.js)
- Styling helpers and font faces in [css/styles.css](./css/styles.css)
- Static Go server in [server.go](./server.go) to serve HTML, JS, CSS, assets, and fonts

## Hosted URL
The latest built version is available at https://tool.daruks.com. You can try it directly in your browser—no local server needed. If you plan to customize or develop, follow the local steps below.

## Getting Started
1) Install Go (1.25+ recommended).
2) From the project root, run `go run server.go`.
3) Open http://localhost:8080 in a browser.

> Tip: You can also build a standalone binary with `go build server.go` and run the executable.

## Usage
- Enter your message in the Message box; text renders vertically by default.
- Pick a font family and weight. For custom Google Fonts, type the exact family name.
- Adjust size, spacing, width, rotation, and position sliders/inputs as needed.
- Toggle auto line break to switch between wrapped and preserved line breaks.
- Pick a text color; the hex value is shown next to the color input.
- Upload a custom background image if you do not want the bundled sample.
- Copy the settings code to share; paste a code into the Import box and click Apply to restore.
- Use the theme button to switch between light/dark UI.

## Settings Code Reference
The settings string shown in “Settings Code” is a pipe-delimited list of key:value pairs. Keys map to the UI controls:
```
m: message (Base64 UTF-8)
f: font key (hiragino | mplus | noto | system | custom)
w: font weight value
cf: custom font name (for Google Fonts)
sz: font size (px)
ls: letter spacing (px)
lh: line height (%)
tw: text width (%)
lb: auto line break (1 enabled, 0 disabled)
c: color hex
r: rotation (deg)
x: horizontal position (%)
y: vertical position (%)
```

## Settings Code Compatibility

When sharing layout settings via the settings code, the following environment is used as the baseline:

- **Screen resolution**: 1920×1080
- **Browser header**: Approximately 90px (bookmark bar hidden)
- **Taskbar**: Windows 11 default of 47px

**Tested browsers** (all with bookmark bar hidden):
- Google Chrome
- Mozilla Firefox
- Microsoft Edge (Chromium)

> 💡 The layout has some tolerance built in for taskbar height variations—up to around 50px should display without issues. If you're using typical Windows settings, layouts should transfer smoothly without any special adjustments.

## Notes and Limitations
- The app relies on Tailwind CDN plus a small inline config; no build step is required.
- LINE Seed JP is bundled locally; other families load from Google Fonts CDN when chosen.

## Fonts and Licenses
- LINE Seed JP files live in [fonts](./fonts) with the license text ([fonts/OFL.txt](./fonts/OFL.txt)).
- Google Fonts families (M PLUS 1p, Noto Sans JP, Nunito Sans, Poppins, Red Hat Display) are fetched from the CDN and are licensed under the SIL Open Font License 1.1 (see [fonts/ofl_license.txt](./fonts/ofl_license.txt)).
- Additional license references are shown inside the UI via the Font Licenses panel.

## Project Licensing
- Project source code (HTML/CSS/JavaScript/Go) is licensed under BSD-2-Clause (see [LICENSE](./LICENSE)).
- Third-party assets (fonts, emojis) and their licenses are documented in [Notice.md](./Notice.md).
- Bundled images are used with explicit permission; redistribution is prohibited. See [License.md](./License.md) for details.
