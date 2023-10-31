const {isPathRelative} = require("../helpers");

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "description",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [{
      type: 'object',
      properties: {
        alias: {
          type: 'string'
        }
      }
    }],
  },

  create(context) {
    const alias = context.options[0]?.alias ?? ''

    const checkingLayers = {
      'entities': 'entities',
      'features': 'features',
      'shared': 'shared',
      'pages': 'pages',
      'widgets': 'widgets',
    }

    return {
      ImportDeclaration(node) {
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value

        if (isPathRelative(importTo)){
          return
        }


        // [entities, article, model, types]
        const segments = importTo.split('/')

        const layer = segments[0]

        if (!checkingLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2

        if(isImportNotFromPublicApi){
          context.report(node, 'Абсолютный импорт разрешение только из Public API (index.ts)')
        }

      }
    };
  },
};
