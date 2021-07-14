const emptyLeaves = json => {
  for (let k in json) {
    if (json[k] && typeof json[k] === 'object') {
      json[k] = emptyLeaves(json[k]);
    } else {
      json[k] = "";
    }
  }

  return json;
}

module.exports = {
  emptyLeaves
};
