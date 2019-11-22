let expect = require("chai").expect;
let ps = require('../index').Parser;
const loadJsonFile = require('load-json-file');

describe("BioThings Schema Parser", function() {
    describe("Load schema file", function() {
        it("schema file is loaded correctly", async function() {
            let parser = new ps();
            var hash = await parser.load_json();
            expect(parser.schema).to.be.a('Object');
        });
    });
})