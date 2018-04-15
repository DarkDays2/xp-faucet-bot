# XPFaucet-Bot

## About v1.0

At first, MaySoMusician started developing this bot for providing the functions of XP coin faucet. After he found it would be difficult, however, he cancelled that plan and changed course for adding the functions for community moderation and the radio system.

Now, MaySoMusician has published the first and final release including community moderation functions. Those function, such as `spam` commands or translating Xp-Bot error messages, are going to be deleted at the next v2.0 release, which will be published soon, because he is no longer a member of XP-JP Moderators nor of XP-JP Administration team. For the same reason, he will NOT provide any updates or fixes on the functions deleted at v2.0 release in the future however serious the found bugs are; XP-JP Administrations team or the lab will do. The function related to the radio system will be continued to be included.

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
