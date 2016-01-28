describe("Basic itk-div", function () {
    it("itk-div", function () {
        root.innerHTML = "<itk-div>{ name }</itk-div>";
        riot.mount('itk-div', { name: 'xieyu' });
        expect(root.getElementsByTagName('itk-div')[0].innerHTML).to.be.equal("xieyu");
    });
});