let removePrefix = (curie) => {
    return curie.split(':').slice(-1)[0];
}

exports.extractClassNames = (element) => {
    if (! (Array.isArray(element))) {
        element = [element];
    }
    return element.map(x => removePrefix(x["@id"]))
}

exports.removePrefix = removePrefix;