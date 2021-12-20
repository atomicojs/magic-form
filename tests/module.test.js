import { expect } from "@esm-bundle/chai";
import { sum } from "../src/module";

describe("my test", () => {
    it("foo is bar", () => {
        expect(sum(1, 3)).to.equal(4);
    });
});
