/**
 * @fileoverview description
 * @author denis
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {ecmaVersion: 6, sourceType: 'module'}
});

const aliasOptions = [{
  alias: '@'
}]

ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer} from '../../model/slices/addCommentFormSlice.ts'",
      errors: []
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer} from '@/entities/Article'",
      errors: [],
      options: aliasOptions
    }
  ],

  invalid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer} from '@/entities/Article/model/file.ts'",
      errors: [{message: "Абсолютный импорт разрешение только из Public API (index.ts)"}],
      options: aliasOptions
    },
  ],
});
