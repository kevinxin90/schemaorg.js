let expect = require("chai").expect;
const ps = require('../index').Parser;
const assert = require('assert');


describe("BioThings Schema Parser", function() {
    let parser = new ps();
    beforeEach('load schema file', async function() {
        let se = await parser.load_json();
    });
    describe("Load schema file", function() {
        it("schema file is loaded correctly", function() {            
            expect(parser.schema).to.be.a('Object');
            expect(parser.schema).to.have.property('@graph');
            expect(parser.schema).to.have.property('@context');
            expect(parser.schema["@graph"]).to.be.a('Array');
            expect(parser.schema["@graph"][0]).to.have.property('@id');
        });
    });
    describe("List all classes defined in schema", function() {
        it("classes should include Gene, ChemicalSubstance, etc", async function() {
            let all_classes = await parser.fetch_all_classes();
            expect(all_classes).to.be.a('Array');
            expect(all_classes).to.be.an('array').that.includes('Gene');
            expect(all_classes).to.be.an('array').that.includes('ChemicalSubstance');
            expect(all_classes).to.be.an('array').that.includes('DiseaseOrPhenotypicFeature');
        });
        it("test if schema has not been pre-loaded", async function() {
            parser1 = new ps();
            let all_classes = await parser1.fetch_all_classes();
            expect(all_classes).to.be.a('Array');
            expect(all_classes).to.be.an('array').that.includes('Gene');
            expect(all_classes).to.be.an('array').that.includes('ChemicalSubstance');
            expect(all_classes).to.be.an('array').that.includes('DiseaseOrPhenotypicFeature');
        });
        it("classes should not inclue properties or other non-classes", async function() {
            let all_classes = await parser.fetch_all_classes();
            expect(all_classes).to.be.an('array').that.does.not.include('gene');
            expect(all_classes).to.be.an('array').that.does.not.include('bts:Gene');
            expect(all_classes).to.be.an('array').that.does.not.include('entrez');
            expect(all_classes).to.be.an('array').that.does.not.include('symbol');
            expect(all_classes).to.be.an('array').that.does.not.include('metabolizedBy');
        });
    });
    describe("List all properties defined in schema", function() {
        it("properties should include ensembl, hgnc, etc", async function() {
            let all_properties = await parser.fetch_all_properties();
            expect(all_properties).to.be.an('array').that.includes('ensembl');
            expect(all_properties).to.be.an('array').that.includes('hgnc');
            expect(all_properties).to.be.an('array').that.includes('metabolizedBy');
        });
        it("test if schema has not been pre-loaded", async function() {
            parser1 = new ps();
            let all_properties = await parser1.fetch_all_properties();
            expect(all_properties).to.be.an('array').that.includes('ensembl');
            expect(all_properties).to.be.an('array').that.includes('hgnc');
            expect(all_properties).to.be.an('array').that.includes('metabolizedBy');
        });
        it("properties should not inclue classes or other non-property values", async function() {
            let all_properties = await parser.fetch_all_properties();
            expect(all_properties).to.be.an('array').that.does.not.include('Gene');
            expect(all_properties).to.be.an('array').that.does.not.include('bts:ensembl');
            expect(all_properties).to.be.an('array').that.does.not.include('SequenceVariant');
            expect(all_properties).to.be.an('array').that.does.not.include('DiseaseOrPhenotypicFeature');
        });
    });
    describe("List all IDs defined in schema", function() {
        it("ids should include ensembl, hgnc, etc", async function() {
            let all_ids = await parser.fetch_all_ids();
            expect(all_ids).to.be.an('array').that.includes('ensembl');
            expect(all_ids).to.be.an('array').that.includes('hgnc');
        });
        it("test if schema has not been pre-loaded", async function() {
            parser1 = new ps();
            let all_ids = await parser1.fetch_all_ids();
            expect(all_ids).to.be.an('array').that.includes('ensembl');
            expect(all_ids).to.be.an('array').that.includes('hgnc');
        });
        it("ids should not inclue classes or other non-id values", async function() {
            let all_ids = await parser.fetch_all_ids();
            expect(all_ids).to.be.an('array').that.does.not.include('Gene');
            expect(all_ids).to.be.an('array').that.does.not.include('bts:ensembl');
            expect(all_ids).to.be.an('array').that.does.not.include('SequenceVariant');
            expect(all_ids).to.be.an('array').that.does.not.include('metabolizedBy');
        });
    });
    describe("Load entire schema into a tree structure", function() {
        it("all classes should be included", async function() {
            let se_tree = await parser.load_schema_into_tree();
            let nodes = se_tree.nodes;
            assert('Gene' in nodes);
            assert('SequenceVariant' in nodes);
            assert('MolecularEntity' in nodes);
            assert('BiologicalProcess' in nodes);
            assert('Pathway' in nodes);
            assert('Thing' in nodes);
        });
        it("properties should not be included", async function() {
            let se_tree = await parser.load_schema_into_tree();
            let nodes = se_tree.nodes;
            nodes = Array.from(Object.keys(nodes));
            expect(nodes).to.be.an('array').that.does.not.include('metabolizedBy');
        });
        it("correct parent child relationship should be captured", async function() {
            let se_tree = await parser.load_schema_into_tree();
            let nodes = se_tree.nodes;
            let children = Array.from(nodes['BiologicalProcess'].children);
            expect(children).to.be.an('array').that.includes('Pathway');
            let parents = Array.from(nodes['BiologicalProcess'].parents);
            expect(parents).to.be.an('array').that.includes('BiologicalProcessOrActivity');
            children = Array.from(nodes['Gene'].children);
            expect(children).to.be.an('array').to.have.lengthOf(0);
            parents = Array.from(nodes['Gene'].parents);
            expect(parents).to.be.an('array').that.does.not.includes('Thing')
            children = Array.from(nodes['RnaProduct'].children);
            expect(children).to.be.an('array').that.includes('RnaProductIsoform');
        })
    })
})