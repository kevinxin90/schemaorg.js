let expect = require("chai").expect;
let ps = require('../index').Parser;
const loadJsonFile = require('load-json-file');

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
    describe("List all calsses defined in schema", function() {
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
})