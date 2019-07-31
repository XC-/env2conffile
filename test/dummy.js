const chai = require("chai");

const assert = chai.assert;
const expect = chai.expect;

chai.should();

describe("Dummy tests", () => {
  it("Should pass", () => {
    const foobar = 123;
    expect(foobar).to.be.equal(123);
  })

  it("Should randomly fail", () => {
    const foobar = Math.random();
    expect(foobar).to.be.lt(0.75);
  });
})
