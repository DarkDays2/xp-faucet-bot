// This event executes when a new guild (server) is left.

module.exports = (XPBot, guild) => {
  // Well they're gone. Let's remove them from the settings!
  XPBot.settings.delete(guild.id);
};
