const handleModalSubmit = async (modalInteraction, connection) => {
  const name = modalInteraction.fields.getTextInputValue('playlistName');
  const isExisting = await connection.fetchPlaylistName(name);
  if (isExisting) {
    modalInteraction.reply({ content: 'A Playlist with this name already exists \nPlease try again   :x:', ephemeral: true });
    return false;
  }
  connection.setPlaylistName(name);
  connection.savePlaylist();
  await modalInteraction.reply({ content: `Playlist  **'${name}'**  was saved   :white_check_mark:`, components: [], ephemeral: true });
  return true;
};

module.exports = { handleModalSubmit };
