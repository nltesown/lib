const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

/**
 * testFilesIdentical
 * Teste si deux fichiers de chemin `path1` et `path2` sont identiques.
 * https://stackoverflow.com/questions/25783161/how-to-check-if-two-files-have-the-same-content
 * @param {string} path1
 * @param {string} path2
 * @returns {boolean} true: Le contenu des deux fichiers est identique.
 * @version 1.0.0 2021-09-07
 */
async function testFilesIdentical(path1, path2) {
  let buffer1 = await readFile(path1);
  let buffer2 = await readFile(path2);
  return buffer1.equals(buffer2);
}

module.exports = testFilesIdentical;
