// This event executes when a new guild (server) is joined.

module.exports = (XPBot, guild) => {
  // We need to add this guild to our settings!
  XPBot.settings.set(guild.id, XPBot.config.defaultSettings);
};
