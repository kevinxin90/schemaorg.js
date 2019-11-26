let expect = require("chai").expect;
const removePrefix = require('../utils').removePrefix;

describe("Test remove prefix function", function() {
    it("prefix removed", function() {
        let res = removePrefix('GO:12345');
        expect(res).to.equal('12345');
    })
})