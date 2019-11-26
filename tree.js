exports.Node = class {

    constructor(name) {
        this.children = new Set();
        this.parents = new Set();
        this.name = name;
    }

    add_child(child) {
        this.children.add(child);
    }

    add_parent(parent) {
        this.parents.add(parent);
    }
}

exports.Tree = class {

    constructor() {
        this.nodes = {};
    }

    add_node(node_obj) {
        this.nodes[node_obj.name] = node_obj;
    }

}