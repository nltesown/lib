const fs = require("fs");
const { promisify } = require("util");
const access = promisify(fs.access);

/**
 * pathExists
 * Teste l'existence du chemin `path` dans le système de fichier.
 * Le chemin peut désigner un fichier ou un répertoire.
 * @param {string} path Chemin d'accès du fichier.
 * @returns {boolean} true: le fichier existe, false: le fichier n'existe pas.
 * @version 1.0.0 2021-09-06
 */
async function pathExists(path) {
  try {
    await access(path, fs.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = pathExists;
