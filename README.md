# XPFaucet-Bot

## About v2.0
As most of you know, **the functions related to community moderation are no longer provided.** 

In v2.0.x and later I'll develop this for the radio system and joke functions e.g. DOGE-related *Ainote*.

## Installation
1. Install node.js (v8.0 or higher) and npm, then prepare a new Discord application at https://discordapp.com/developers/applications/me
2. Clone or download this repositry.
3. Install dependencies by executing `npm install`.
4. If you can't play the sounds, on Windows, uninstall `ffmpeg-binaries` and reinstall it into global environmental.

		npm uninstall ffmpeg-binaries
        npm install ffmpeg-binaries -g

5. Copy `config.js.sample` and rename it to `config.js`.
6. Fill in the bot owner's Discord account ID and the token of the bot.

		const config = {
			// Bot所有者のユーザーID。既定で権限レベル10。Bot所有者以外のユーザーIDは絶対に指定しないこと。
            "ownerID": "<Fill in owner's Discord ID>",
		...
			// Botのトークン。 https://discordapp.com/developers/applications/me で調べる。
			"token": "<Fill in the bot's token>",

7. Fill in the other settings according to the comments in `config.js`.
8. Copy `valuePerGuild.js.sample`, rename it to `valuePerGuild.js`, and change values suitably if you want.

Also refer to [Discord.js official homepage](https://discord.js.org/).

I'm sorry but some `*.js.sample` files may be outdated.