const assert = require("node:assert/strict");

const File = require("./src/file");

(async () => {
  {
    const file_path = "./mock/invalid/empty-file.csv";
    const expected = new Error("File must not be empty");
    const result = File.csvToJSON(file_path);
    await assert.rejects(result, expected);
  }

  {
    const file_path = "./mock/invalid/header.csv";
    const expected = new Error("Header is missing fields");
    const result = File.csvToJSON(file_path);
    await assert.rejects(result, expected);
  }

  {
    const file_path = "./mock/invalid/longer-file.csv";
    const expected = new Error("File is longer than 3 lines");
    const result = File.csvToJSON(file_path);
    await assert.rejects(result, expected);
  }

  {
    const file_path = "./mock/valid/file.csv";
    const expected = [
      {
        id: "01",
        name: "rodrigo",
        profession: "professor",
        age: "28",
      },
      {
        id: "02",
        name: "luis",
        profession: "surfista",
        age: "34",
      },
    ];

    const result = await File.csvToJSON(file_path);
    await assert.deepEqual(result, expected);
  }
})();
