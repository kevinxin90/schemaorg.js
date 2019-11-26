const loadJsonFile = require('load-json-file');
const Tree = require('./tree').Tree;
const node = require('./tree').Node;
const removePrefix = require('./utils').removePrefix;

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

    async fetch_all_properties() {
        if (typeof this.schema !== 'undefined') {
            return this.schema["@graph"].map(function(item) {
                if (item['@type'] == 'rdf:Property'){
                    return item['rdfs:label']
                }
            });
        } else {
            await this.load_json();
            return this.fetch_all_properties();
        }
    }

    async fetch_all_ids() {
        if (typeof this.schema !== 'undefined') {
            return this.schema["@graph"].map(function(item) {
                if (item['@type'] == 'rdf:Property'
                    && 'rdfs:subPropertyOf' in item
                    && item['rdfs:subPropertyOf']['@id'] == 'http://schema.org/identifier'){
                    return item['rdfs:label']
                }
            });
        } else {
            await this.load_json();
            return this.fetch_all_properties();
        }
    }

    async load_schema_into_tree() {
        if (typeof this.schema !== 'undefined') {
            this.se_tree = new Tree();
            let nodes = {};
            this.schema["@graph"].forEach(element => {
                let name = element["rdfs:label"];
                if (! (name in nodes)) {
                    nodes[name] = new node(name);
                } 
                if ('rdfs:subClassOf' in element) {
                    let parent_name = removePrefix(element["rdfs:subClassOf"]["@id"]);
                    nodes[name].add_parent(parent_name);
                    if (! (parent_name in nodes)) {
                        let parent_obj = new node(parent_name);
                        parent_obj.add_child(name);
                        nodes[parent_name] = parent_obj;
                    } else {
                        nodes[parent_name].add_child(name);
                    }
                }
            });
            this.se_tree.nodes = nodes;
            return this.se_tree;
        } else {
            await this.load_json();
            return this.load_schema_into_tree();
        }
    }
}
  