let expect = require("chai").expect;
const removePrefix = require('../utils').removePrefix;
const extractClassNames = require('../utils').extractClassNames;

describe("Test remove prefix function", function() {
    it("prefix removed", function() {
        let res = removePrefix('GO:12345');
        expect(res).to.equal('12345');
    })
})

describe("Extract class names from domainIncludes", function() {
    it("extreact classes if it is a list", function() {
        let _input = [{"@id": "bts:GeneOrGeneProduct"}, {"@id": "bts:Transcript"}];
        let res = extractClassNames(_input);
        expect(res).to.be.an('array').of.lengthOf(2);
        expect(res).to.be.an('array').that.includes('GeneOrGeneProduct');
        expect(res).to.be.an('array').that.includes('Transcript');
        expect(res).to.be.an('array').that.does.not.includes('bts:Transcript');
    })
})