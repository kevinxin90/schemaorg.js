exports.removePrefix = (curie) => {
    return curie.split(':').slice(-1)[0];
}