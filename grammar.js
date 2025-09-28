/**
 * @file Iblang grammar for tree-sitter
 * @author Luminight
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

function separated(rule, separator=",") {
  return seq(rule, repeat(seq(separator, rule)), optional(separator))

}

module.exports = grammar({
  name: "iblang",

  word: $ => $.identifier,
  extras: $ => [
    /\s/,
    $.comment,
  ],

  conflicts: $ => [
    [$.primary, $.struct_init],
  ],

  supertypes: $ => [
    $.expression,
  ],

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat($.declaration),

    declaration: $ => choice(
      $.fn_definition,
      $.struct_definition,
      $.extern_definition,
      $.const_declaration,
      $.var_declaration,
    ),

    comment: $ => token(
      choice(
        seq("//", /.*/),
        seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")
      )
    ),
    extern_definition: $ => seq("extern", $.prototype),

    fn_definition: $ => seq("fn", $.prototype, $.block),

    prototype: $ => seq($.identifier, $.param_list, optional($.return_type)),
    return_type: $ => seq(":", choice("void", $.typeident)),

    param_list: $ => seq('(', optional(separated($.param_item)), ')'),

    param_item: $ => seq($.identifier, ":", $.typeident),

    typeident: $ => seq(
      optional("*"),
      choice(
        prec(10, $.typeident_primitive),
        $.identifier
      ),
      repeat(seq("[", $.expression, "]"))
    ),
    typeident_primitive: $ => choice(
      "int", "str", "char", "bool", "float",
    ),

    struct_definition: $ => seq(
      "struct", $.identifier, 
      "{", separated($.struct_field), "}",
    ),
    struct_field: $ => seq($.identifier, ":", $.typeident),

    block: $ => seq("{", repeat($.statement), "}"),

    statement: $ => choice(
      $.var_declaration,
      $.const_declaration,
      $.block,
      $.return,
      $.if_statement,
      $.loop_statement,
      $.while_statement,
      seq($.expression, ";")
    ),

    var_declaration: $ => seq(
      "let", $.identifier, optional(seq(":", $.typeident)),
      "=", $.expression, ";"
    ),
    const_declaration: $ => seq(
      "const", $.identifier, optional(seq(":", $.typeident)),
      "=", $.expression, ";"
    ),
    return: $ => seq("return", optional($.expression), ";"),
    if_statement: $ => seq(
      "if", $.expression, 
      $.block, 
      optional(seq("else", choice(
        $.if_statement,
        $.block,
      )))
    ),
    loop_statement: $ => seq("loop", $.block),
    while_statement: $ => seq("while", $.expression, $.block),

    expression: $ => choice(
      $.binary_expression,
      $.unary_expression,
      $.primary,
      $.group,
    ),

    primary: $ => choice(
      $.number,
      $.string,
      $.char,
      $.bool,
      $.fn_call,
      $.struct_init,
      $.identifier,
    ),

    bool: $ => choice("true", "false"),

    fn_call: $ => seq(
      $.identifier,
      "(", optional($.call_param_list), ")"
    ),

    call_param_list: $ => separated($.expression),

    group: $ => seq("(", $.expression, ")"),

    struct_init: $ => seq(
      $.identifier, "{", separated($.struct_init_field), "}",
    ),
    struct_init_field: $ => seq($.identifier, ":", $.expression),
    array_init: $ => seq("[", separated($.expression), "]"),

    unary_expression: $ => prec(
      1,
      choice(
        seq("*", $.expression),
        seq("&", $.expression),
        seq("-", $.expression),
        seq("!", $.expression),
        seq("+", $.expression),
      )
    ),
    binary_expression: $ => choice(
      prec.right(2, seq($.expression, "=", $.expression)),
      prec.left(8, seq($.expression, "||", $.expression)),
      prec.left(6, seq($.expression, "&&", $.expression)),
      prec.left(10, seq($.expression, "==", $.expression)),
      prec.left(10, seq($.expression, "!=", $.expression)),
      prec.left(12, seq($.expression, ">", $.expression)),
      prec.left(12, seq($.expression, ">=", $.expression)),
      prec.left(12, seq($.expression, "<", $.expression)),
      prec.left(12, seq($.expression, "<=", $.expression)),
      prec.left(20, seq($.expression, "+", $.expression)),
      prec.left(20, seq($.expression, "-", $.expression)),
      prec.left(30, seq($.expression, "*", $.expression)),
      prec.left(32, seq($.expression, "/", $.expression)),
      prec.left(34, seq($.expression, "%", $.expression)),
      prec.left(120, seq($.expression, ".", $.expression)),
      prec.left(100, seq($.expression, "[", $.expression, "]")),
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: $ => token(seq(/[0-9]+/, optional(seq(".", /[0-9]+/)))),
    string: $ => seq(
      '"',
      repeat(choice($.string_escape, /./)),
      token.immediate('"')
    ),
    string_escape: $ => token.immediate(/\\[ntr0"]/),
    char: $ => seq(
      "'",
      choice($.char_escape, /./),
      token.immediate("'")
    ),
    char_escape: $ => token.immediate(/\\[ntr0']/),
  }
});
