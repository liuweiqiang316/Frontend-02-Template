import { parserHTML } from '../src/parser.js'
var assert = require('assert')

describe("parser HTML: ", function () {
    let htmlStr_1 = '<a></a>'
    it(htmlStr_1, function () {
        let tree = parserHTML(htmlStr_1)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_2 = '<a href ></a>'
    it(htmlStr_2, function () {
        let tree = parserHTML(htmlStr_2)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_3 = '<a href="www.baidu.com" ></a>'
    it(htmlStr_3, function () {
        let tree = parserHTML(htmlStr_3)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_4 = '<a href="www.baidu.com" />'
    it(htmlStr_4, function () {
        let tree = parserHTML(htmlStr_4)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_5 = '<a href="www.baidu.com"/>'
    it(htmlStr_5, function () {
        let tree = parserHTML(htmlStr_5)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_6 = '<a href="www.baidu.com"></a>'
    it(htmlStr_6, function () {
        let tree = parserHTML(htmlStr_6)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_7 = '<a href=\'www.baidu.com\'></a>'
    it(htmlStr_7, function () {
        let tree = parserHTML(htmlStr_7)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_8 = '<a href=\'www.baidu.com\'id="aaa"></a>'
    it(htmlStr_8, function () {
        let tree = parserHTML(htmlStr_8)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_9 = '<a href=www.baidu.com id="aaa"></a>'
    it(htmlStr_9, function () {
        let tree = parserHTML(htmlStr_9)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_10 = '<a href=www.baidu.com id="aaa"></a>'
    it(htmlStr_10, function () {
        let tree = parserHTML(htmlStr_10)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_11 = '<style>a{color: red;}</style><a style="width:100px" ></a>'
    it(htmlStr_11, function () {
        let tree = parserHTML(htmlStr_11)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_12 = '<style>#a{color: red;}</style><a style="width:100px" ></a>'
    it(htmlStr_12, function () {
        let tree = parserHTML(htmlStr_12)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_13 = '<style>.a{color: red;}</style><a style="width:100px" ></a>'
    it(htmlStr_13, function () {
        let tree = parserHTML(htmlStr_13)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_14 = '<style>a{color: red;} #aaa{color: red;}</style><a id="aaa"></a>'
    it(htmlStr_14, function () {
        let tree = parserHTML(htmlStr_14)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_15 = '<style>a{color: red;} .aaa{color: red;}</style><a class="aaa"></a>'
    it(htmlStr_15, function () {
        let tree = parserHTML(htmlStr_15)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_16 = '<aaa>'
    it(htmlStr_16, function () {
        let tree = parserHTML(htmlStr_16)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_17 = '</>'
    it(htmlStr_17, function () {
        let tree = parserHTML(htmlStr_17)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_18 = '< />'
    it(htmlStr_18, function () {
        let tree = parserHTML(htmlStr_18)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_19 = '<a href />'
    it(htmlStr_19, function () {
        let tree = parserHTML(htmlStr_19)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_20 = '<a href=www.baidu.com/>'
    it(htmlStr_20, function () {
        let tree = parserHTML(htmlStr_20)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_21 = '<a href=www.baidu.com>'
    it(htmlStr_21, function () {
        let tree = parserHTML(htmlStr_21)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_22 = '<a  href=www.baidu.com>'
    it(htmlStr_22, function () {
        let tree = parserHTML(htmlStr_22)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_23 = '<h1 >'
    it(htmlStr_23, function () {
        let tree = parserHTML(htmlStr_23)
        assert.equal(tree.children[0].tagName, 'a')
        assert.equal(tree.children[0].children.length, 0)
    })

    let htmlStr_24 = '<h1 ></h2>'
    it(htmlStr_24, function () {
        try {
            let tree = parserHTML(htmlStr_24)
        } catch (err) {
            console.log(err)
        }
    })
})