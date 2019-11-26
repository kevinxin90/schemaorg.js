let expect = require("chai").expect;
const tree = require('../tree').Tree;
const node = require('../tree').Node;
const assert = require('assert');

describe("Test Node Constructor", function() {
    describe("add a child", function() {
        it("add a unique child should cause the length of children to increase by one", function() {            
            let gene = new node('Gene');
            expect(gene.children).to.have.lengthOf(0);
            gene.add_child('Transcript');
            expect(gene.children).to.have.lengthOf(1);
            gene.add_child('Rna');
            expect(gene.children).to.have.lengthOf(2);
        });
        it("add a duplicate child should not change the length of child", function() {            
            let gene = new node('Gene');
            gene.add_child('Transcript');
            gene.add_child('Rna');
            const prev_length = gene.children.size;
            //this is the duplicate
            gene.add_child('Transcript');
            expect(gene.children.size).to.equal(prev_length);
        });
    });
    describe("add a parent", function() {
        it("add a unique parent should cause the length of parents to increase by one", function() {            
            let gene = new node('Gene');
            expect(gene.parents).to.have.lengthOf(0);
            gene.add_parent('Bioentity');
            expect(gene.parents).to.have.lengthOf(1);
            gene.add_parent('Thing');
            expect(gene.parents).to.have.lengthOf(2);
        });
        it("add a duplicate parent should not change the length of parents", function() {            
            let gene = new node('Gene');
            gene.add_parent('Bioentity');
            gene.add_parent('Thing');
            const prev_length = gene.parents.size;
            //this is the duplicate
            gene.add_parent('Bioentity');
            expect(gene.parents.size).to.equal(prev_length);
        });
    });
    describe("get children", function() {
        it("element should be in children property if add_child is called with it", function() {            
            let gene = new node('Gene');
            gene.add_child('Transcript');
            assert(gene.children.has('Transcript'));
            gene.add_child('Rna');
            assert(gene.children.has('Rna'));
            assert(gene.children.has('Transcript'));
        });
    });
    describe("add property", function() {
        it("test a property is correctly added", function() {            
            let gene = new node('Gene');
            gene.add_property('ensembl');
            assert(gene.properties.has('ensembl'));
            gene.add_property('hgnc');
            assert(gene.properties.has('hgnc'));
            assert(gene.properties.has('ensembl'));
        });
    });
});

describe("Test Tree Constructor", function() {
    describe("add a node", function() {
        it("add a unique node should cause the length of nodes to increase by one", function() {            
            let se = new tree();
            expect(Object.keys(se.nodes)).to.have.lengthOf(0);
            let gene = new node('Gene');
            se.add_node(gene);
            expect(Object.keys(se.nodes)).to.have.lengthOf(1);
            expect(se.nodes['Gene']).to.equal(gene);
        });
    });

    describe("test get ancestores", function() {
        it("Returns all ancestor nodes having a path to source node in the tree", function() {
            let se = new tree();
            let node1 = new node('Gene');
            let node2 = new node('GeneOrGeneProduct');
            let node3 = new node('BiologicalEntity');
            let node4 = new node('Thing');
            let node5 = new node('Random');
            node1.add_parent('GeneOrGeneProduct');
            node2.add_parent('BiologicalEntity');
            node2.add_parent('Thing');
            se.add_node(node1);
            se.add_node(node2);
            se.add_node(node3);
            se.add_node(node4);
            se.add_node(node5);
            let properties = Array.from(se.find_ancestores('Gene'));
            expect(properties).to.be.an('array').that.includes('GeneOrGeneProduct');
            expect(properties).to.be.an('array').that.includes('BiologicalEntity');
            expect(properties).to.be.an('array').that.includes('Thing');
            expect(properties).to.be.an('array').that.does.not.includes('Random');
            expect(properties).to.be.an('array').that.does.not.includes('Gene');
        })
    })

    describe("test get descendants", function() {
        it("Returns all descendant nodes having a path to source node in the tree", function() {
            let se = new tree();
            let node1 = new node('Gene');
            let node2 = new node('GeneOrGeneProduct');
            let node3 = new node('BiologicalEntity');
            let node4 = new node('Thing');
            let node5 = new node('Random');
            node4.add_child('BiologicalEntity');
            node4.add_child('GeneOrGeneProduct');
            node3.add_child('Gene');
            se.add_node(node1);
            se.add_node(node2);
            se.add_node(node3);
            se.add_node(node4);
            se.add_node(node5);
            let descendants = Array.from(se.find_descendants('Thing'));
            expect(descendants).to.be.an('array').that.includes('GeneOrGeneProduct');
            expect(descendants).to.be.an('array').that.includes('BiologicalEntity');
            expect(descendants).to.be.an('array').that.includes('Gene');
            expect(descendants).to.be.an('array').that.does.not.includes('Random');
            expect(descendants).to.be.an('array').that.does.not.includes('Thing');
        })
    })

    describe("test get properties", function() {
        it("Returns all properties which apply to a specific node", function() {
            let se = new tree();
            let node1 = new node('Gene');
            let node2 = new node('GeneOrGeneProduct');
            let node3 = new node('BiologicalEntity');
            let node4 = new node('Thing');
            let node5 = new node('Random');
            node1.add_parent('GeneOrGeneProduct');
            node2.add_parent('BiologicalEntity');
            node2.add_parent('Thing');
            node2.add_property('uniprot');
            node2.add_property('inPathwayWith');
            node4.add_property('name');
            node4.add_property('description');
            node1.add_property('entrez');
            node5.add_property('test');
            se.add_node(node1);
            se.add_node(node2);
            se.add_node(node3);
            se.add_node(node4);
            se.add_node(node5);
            let properties = Array.from(se.find_properties('Gene'));
            expect(properties).to.be.an('array').that.includes('uniprot');
            expect(properties).to.be.an('array').that.includes('inPathwayWith');
            expect(properties).to.be.an('array').that.includes('name');
            expect(properties).to.be.an('array').that.includes('entrez');
            expect(properties).to.be.an('array').that.does.not.includes('test');
        })
    })
});