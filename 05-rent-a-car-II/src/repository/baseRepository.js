const { readFile } = require("fs/promises");

class BaseRepository {
  constructor({ file }) {
    this.file = file;
  }

  async find(itemID) {
    const fecthedFile = await readFile(this.file);
    const content = JSON.parse(fecthedFile);

    if (!itemID) return content;
    return content.find(({ id }) => id === itemID);
  }
}

module.exports = BaseRepository;
