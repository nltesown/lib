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
 * @returns {boolean} true: succès, false: échec.
 * @version 1.0.0 2021-09-07
 */
async function copyFileWithCreationTimestamp(path, targetFolder = "") {
  let sourceFileExists = await pathExists(path);

  if (sourceFileExists === true) {
    let { mtime } = await stat(path);
    let timestamp = dayjs(mtime).format("YYYYMMDDHHmmss");
    let { dir, name, ext } = fspath.parse(path);
    let targetDir = fspath.normalize(`${dir}/${targetFolder}`);

    try {
      await mkdir(targetDir);
    } catch (e) {}

    try {
      await copyFile(
        path,
        fspath.normalize(`${targetDir}/${name}_${timestamp}${ext}`)
      );
      return true;
    } catch (e) {
      return false;
    }
  } else {
    return true;
  }
}

module.exports = copyFileWithCreationTimestamp;
