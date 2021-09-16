const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

/**
 * testFilesIdentical
 * Teste si deux fichiers de chemin `path1` et `path2` sont identiques.
 * Si on traite des fichiers JSON, on peut optionnellement appliquer préalablement un formatage JSON aux données.
 * Cela ne garantit pas du tout l'égalité des données JSON, mais permet de remédier à des différences éventuellement introduites par Prettier ou autre.
 * https://stackoverflow.com/questions/25783161/how-to-check-if-two-files-have-the-same-content
 * @param {string} path1
 * @param {string} path2
 * @param {boolean} preformatJSON true: tenter de parser les données en tant que JSON et les formater à l'identique.
 * @returns {boolean} true: Le contenu des deux fichiers est identique.
 * @version 0.2 2021-09-16
 */
async function testFilesIdentical(path1, path2, preformatJSON = false) {
  let buffer1, buffer2;

  if (preformatJSON === false) {
    // Comparaison simple (directement à partir des buffers, sans conversion intermédiaire).
    buffer1 = await readFile(path1);
    buffer2 = await readFile(path2);
  } else {
    // Comparaison avec conversion intermédiaire en chaîne, pour pouvoir effectuer un préformatage JSON.
    let data1 = await readFile(path1, "utf8");
    let data2 = await readFile(path2, "utf8");
    try {
      // Formatage des données JSON (on applique le formatage le plus compact).
      data1 = JSON.stringify(JSON.parse(data1));
      data2 = JSON.stringify(JSON.parse(data2));
    } catch (e) {
      // Echoue si `data1` ou `data2` ne sont pas du JSON valide. On ignore simplement la tentative de préformatage JSON.
    }
    buffer1 = Buffer.from(data1, "utf8");
    buffer2 = Buffer.from(data2, "utf8");
  }
  return buffer1.equals(buffer2);
}

module.exports = testFilesIdentical;
