/**
 * @fileoverview feature sliced relative path checker
 * @author denis
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const path = require('path')

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: "feature sliced relative path checker",
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
    },

    create(context) {


        return {
            ImportDeclaration(node) {
                // app/entities/Article
                const importTo = node.source.value

                //C:\Users\denis\Desktop\projects\production_project\src\entities\Article
                const fromFilename = context.getFilename()

                if(shouldBeRelative(fromFilename, importTo)){
                    context.report(node, 'В рамках одного слайса все пути должны быть относительны')
                }

            }
        };
    },
};


function isPathRelative(path) {
    return path === '.' || path.startsWith('./') || path.startsWith('../')
}

const layers = {
    'entities': 'entities',
    'features': 'features',
    'shared': 'shared',
    'pages': 'pages',
    'widgets': 'widgets',
}

function shouldBeRelative(from, to) {
    if (isPathRelative(to)) {
        return false
    }
    // app/entities/Article
    const toArray = to.split('/')
    const toLayer = toArray[0]
    const toSlice = toArray[1]

    if (!toLayer || !toSlice || !layers[toLayer]) {
        return false
    }

    const normalizedPath = path.toNamespacedPath(from)
    const projectFrom = normalizedPath.split('src')[1]
    const fromArray = projectFrom.split('\\') // регулярка /\\|\// , попробовать на маке или path.sep

    const fromLayer = fromArray[1]
    const fromSlice = fromArray[2]

    if(!fromLayer || !fromSlice || !layers[fromLayer]){
        return false
    }

    return fromSlice === toSlice && toLayer === fromLayer
}

console.log(shouldBeRelative('C:/Users/denis/Desktop/projects/prod/src/entities/Article', 'entities/Article'))

// console.log(path.toNamespacedPath('C:\\Users\\denis\\Desktop\\projects\\eslint-plugin-fsd-stabilized'))
// console.log(path.toNamespacedPath('C:/Users/denis/Desktop/projects/eslint-plugin-fsd-stabilized'))
