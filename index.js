const loadJsonFile = require('load-json-file');

exports.Parser = class {
    constructor() {
        this.path = './schemas/biothings/biothings_curie_kevin.jsonld';
    };

    async load_json() {
        this.schema = await loadJsonFile(this.path);
        return this.schema;
    }

    async fetch_all_classes() {
        if (typeof this.schema !== 'undefined') {
            return this.schema["@graph"].map(function(item) {
                if (item['@type'] == 'rdfs:Class'){
                    return item['rdfs:label']
                }
            });
        } else {
            await this.load_json();
            return this.fetch_all_classes();
        }
    }
}
  