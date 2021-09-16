const fs = require("fs");
const { promisify } = require("util");
const fspath = require("path");
const stat = promisify(fs.stat);
const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);
const pathExists = require("./pathExists");
const dayjs = require("dayjs");

/**
 * copyFileWithCreationTimestamp
 * Copie le fichier de chemin `path` en ajoutant à son nom un suffixe indiquant la date de modifiation du fichier d'origine.
 * Ce suffixe est de format `YYYYMMDDHHmm`.
 * Un répertoire cible peut être spécifié, relativement au répertoire de `path`.
 * Par défaut, la copie est enregistrée dans le même répertoire que `path`.
 * Renvoie un booléen indiquant la réussite ou l'échec de l'opération.
 * IMPORTANT : Si le fichier `path` n'existe pas, on ne fait rien, mais l'opération est considérée comme réussie.
 * @param {string} path Chemin d'accès du fichier à copier.
 * @param {string} targetFolder Par défaut : "".
 * @returns {string} Nom de fichier de la copie. `undefined` si le fichier d'origine n'existait pas.
 * @version 0.2.0  2021-09-16 Renvoie le nom du fichier écrit en cas de succès (Breaking: la signature de la valeur de retour a changé.)
 */
async function copyFileWithCreationTimestamp(path, targetFolder = "") {
  let sourceFileExists = await pathExists(path);

  if (sourceFileExists === true) {
    let { mtime } = await stat(path);
    let timestamp = dayjs(mtime).format("YYYYMMDDHHmmss");
    let { dir, name, ext } = fspath.parse(path);
    let targetDir = fspath.normalize(`${dir}/${targetFolder}`);
    let newPath;

    try {
      await mkdir(targetDir);
    } catch (e) {}

    try {
      newPath = fspath.normalize(`${targetDir}/${name}_${timestamp}${ext}`);
      await copyFile(path, newPath);
      return fspath.basename(newPath);
    } catch (e) {
      // Un erreur s'est produite lors de l'écriture de la copie.
      throw e;
    }
  } else {
    return undefined;
  }
}

module.exports = copyFileWithCreationTimestamp;
