const { readFile } = require("fs/promises");

const RULES = {
  MAX_LINES: 3,
  FIELDS: ["id", "name", "profession", "age"],
};

class File {
  static async csvToJSON(path) {
    const content = await readFile(path, "utf8");
    const validation = this.isValid(content);

    if (validation.valid === false) {
      throw new Error(validation.error);
    }

    const result = this.parseCSVToJSON(content);
    return result;
  }

  static isValid(csvString, options = RULES) {
    const [header, ...fileWithoutHeader] = csvString.split("\n");

    const isHeaderValid = header === options.FIELDS.join(",");
    if (isHeaderValid === false) {
      return {
        valid: false,
        error: "Header is missing fields",
      };
    }

    if (fileWithoutHeader.length === 0) {
      return {
        valid: false,
        error: "File must not be empty",
      };
    }

    if (fileWithoutHeader.length > options.MAX_LINES) {
      return {
        valid: false,
        error: "File is longer than 3 lines",
      };
    }

    return { valid: true };
  }

  static parseCSVToJSON(csvString) {
    const lines = csvString.split("\n");

    const first = lines.shift();
    const header = first.split(","); // converts it into an array
    const users = lines.map((line) => {
      const columns = line.split(",");
      let user = {};
      for (const index in columns) {
        user[header[index]] = columns[index].trim();
      }
      return user;
    });

    return users;
  }
}

module.exports = File;
