const _ = require("lodash");

/**
 * collectionDifferenceAddedRemoved
 * Renvoie la différence (_.difference) entre deux collections d'objets, dans les deux sens.
 * La comparaison entre objets se fait sur le critère d'une clé, qui peut être composite (composées de plusieurs propriétés).
 * La clé utilisée, simple ou composite, doit permettre d'identifier les objets de façon unique.
 * Permet, en particulier, de comparer deux états d'une collection dans le temps.
 * Renvoie un objet composé de 3 propriétés : added, removed, shared.
 * - added : objets absents de `data1` et présents dans `data2`.
 * - removed : objets présents dans `data1` et absents de `data2`.
 * - shared : objets présents dans `data1` et `data2`.
 * IMPORTANT : `shared` ne liste que les valeurs des propriétés utilisées comme clés, car les autres peuvent être différentes entre `data1` et `data2`.
 * @param {Array} data1 Collection 1 (la plus ancienne chronologiquement).
 * @param {Array} data2 Collection 2 (la plus récente chronologiquement).
 * @param {string|Array(string)} compareKey Clé de comparaison.
 * @returns {object}
 * @version 1.0 2021-09-09
 */
function collectionDifferenceAddedRemoved(data1, data2, compareKey = "id") {
  const added = diff(data2, data1);
  const removed = diff(data1, data2);
  const shared = _.intersectionWith(
    _(data1)
      .map((d) => _.pick(d, compareKey))
      .value(),
    _(data2)
      .map((d) => _.pick(d, compareKey))
      .value(),
    _.isEqual
  );

  return { added, removed, shared };

  function diff(a, b) {
    return _.differenceBy(a, b, (d) => {
      if (Array.isArray(compareKey) === true) {
        let compositeKey = _(compareKey)
          .map((k) => d[k])
          .value()
          .join("-");
        return compositeKey;
      } else {
        return d[compareKey];
      }
    });
  }
}

module.exports = collectionDifferenceAddedRemoved;

// TEST :
// let data1 = [
//   { id: 1, type: 1, title: "Caco" },
//   { id: 1, type: 7, title: "Dada" },
//   { id: 2, type: 1, title: "Ludu" },
//   { id: 3, type: 2, title: "Mambo" },
// ];
// let data2 = [
//   { id: 1, type: 7, title: "Coco" },
//   { id: 4, type: 3, title: "Midaa" },
//   { id: 2, type: 1, title: "Ludu" },
//   { id: 3, type: 2, title: "Mambo" },
//   { id: 3, type: 1, title: "Ratonga" },
// ];
// console.log(collectionDifferenceAddedRemoved(data1, data2, ["id", "type"]));

// RESULTAT :
// {
//   added: [
//     { id: 4, type: 3, title: "Midaa" },
//     { id: 3, type: 1, title: "Ratonga" },
//   ],
//   removed: [{ id: 1, type: 1, title: "Caco" }],
//   shared: [
//     { id: 1, type: 7 },
//     { id: 2, type: 1 },
//     { id: 3, type: 2 },
//   ],
// }
