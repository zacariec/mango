const emptyLeaves = json => {
  for (const k in json) {
    if (json[k] && typeof json[k] === 'object') {
      json[k] = emptyLeaves(json[k]);
    } else {
      json[k] = "";
    }
  }

  return json;
}

export default emptyLeaves;
