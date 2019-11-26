exports.Node = class {

    constructor(name) {
        this.children = new Set();
        this.parents = new Set();
        this.properties = new Set();
        this.name = name;
    }

    add_child(child) {
        this.children.add(child);
    }

    add_parent(parent) {
        this.parents.add(parent);
    }

    add_property(prop) {
        this.properties.add(prop);
    }
}

exports.Tree = class {

    constructor() {
        this.nodes = {};
    }

    add_node(node_obj) {
        this.nodes[node_obj.name] = node_obj;
    }

    find_ancestores(node_name, ancestors=new Set()) {
        if (!(node_name in this.nodes)) {
            return ancestors;
        } else {
            let parents = this.nodes[node_name].parents;
            if (!(parents.size === 0)) {
                parents.forEach(parent => {
                    ancestors.add(parent);
                    ancestors = this.find_ancestores(parent, ancestors);
                })
            }
            return ancestors;
        }
    }

    find_descendants(node_name, descendants=new Set()) {
        if (!(node_name in this.nodes)) {
            return descendants;
        } else {
            let children = this.nodes[node_name].children;
            if (!(children.size === 0)) {
                children.forEach(child => {
                    descendants.add(child);
                    descendants = this.find_descendants(child, descendants);
                })
            }
            return descendants;
        }
    }

    find_properties(node_name, properties=new Set()) {
        if (!(node_name in this.nodes)) {
            return properties;
        } else {
            let parents = this.nodes[node_name].parents;
            let current_props = this.nodes[node_name].properties;
            properties = new Set([...properties, ...current_props]);
            if (!(parents.size === 0)) {
                parents.forEach(parent => {
                    properties = this.find_properties(parent, properties);
                })
            }
            return properties;
        }
    }

}