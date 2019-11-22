const loadJsonFile = require('load-json-file');

exports.Parser = class Parser {
    constructor() {
        this.path = './schemas/biothings/biothings_curie_kevin.jsonld';
    };
    
    async load_json() {
        this.schema = await loadJsonFile(this.path);
        return this.schema;
    }
}
  