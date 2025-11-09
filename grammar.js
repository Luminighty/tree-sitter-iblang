/**
 * @file Iblang grammar for tree-sitter
 * @author Luminight
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

function separated(rule, separator=",", allow_tail_sep=true) {
  const list = [rule, repeat(seq(separator, rule))]
  if (allow_tail_sep) list.push(optional(separator))
  return seq(...list)
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
    source_file: $ => repeat(choice($.declaration, $.import)),

    declaration: $ => seq(
      optional("pub"),
      choice(
        $.fn_definition,
        $.struct_definition,
        $.union_definition,
        $.enum_definition,
        $.extern_definition,
        $.global_const_declaration,
        $.var_declaration,
      )
    ),

    import: $ => seq("import", $.string),

    comment: $ => token(
      choice(
        seq("//", /.*/),
        seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")
      )
    ),
    extern_definition: $ => seq("extern", choice($.extern_fn, $.extern_global)),
    extern_global: $ => seq($.identifier, ":", $.typeident, ";"),
    extern_fn: $ => $.prototype,

    fn_definition: $ => seq("fn", $.prototype, $.block),

    prototype: $ => seq($.identifier, $.param_list, optional($.return_type)),
    return_type: $ => seq(":", choice("void", $.typeident)),

    param_list: $ => seq(
      '(', 
        optional(separated($.param_item, ",", false)),
        optional(seq(",", optional("..."))),
      ')'
    ),
    param_item: $ => seq($.identifier, ":", $.typeident),

    typeident: $ => prec.right(seq(
      optional(repeat("*")),
      choice(
        prec(20, $.typeident_any),
        prec(10, $.typeident_primitive),
        $.identifier,
        $.typeident_fn,
      ),
      repeat(seq("[", $.expression, "]"))
    )),
    typeident_fn: $ => seq(
      "fn", 
      "(", 
      separated($.typeident, ",", false), optional(seq(",", optional("..."))), 
      ")",
      optional(seq(":", $.typeident))
    ),
    typeident_any: $ => token(seq("*", "any")),
    typeident_primitive: $ => choice(
      "int", "str", "char", "bool", "float",
    ),

    enum_definition: $ => seq(
      "enum", $.identifier, 
      "{", separated($.enum_field), "}",
    ),
    enum_field: $ => seq(
      $.identifier, optional(seq("=", $.expression)),
    ),
    union_definition: $ => seq(
      "union", $.identifier, 
      "{", separated($.object_field), "}",
    ),
    struct_definition: $ => seq(
      "struct", $.identifier, 
      "{", separated($.object_field), "}",
    ),
    object_field: $ => seq($.identifier, ":", $.typeident),

    block: $ => seq("{", repeat($.statement), "}"),

    statement: $ => choice(
      $.var_declaration,
      $.const_declaration,
      $.block,
      $.return,
      $.if_statement,
      $.loop_statement,
      $.for_statement,
      $.while_statement,
      $.match_statement,
      $.break,
      $.continue,
      seq($.expression, ";")
    ),
    break: $ => seq("break", ";"),
    continue: $ => seq("continue", ";"),

    for_statement: $ => seq(
      "for", 
      choice($.var_declaration, seq($.expression, ";")),
      $.expression,
      ";",
      $.expression,
      $.block,
    ),
    match_statement: $ => seq(
      "match",
      $.expression,
      "{", repeat($.match_arm), "}"
    ),
    match_arm: $ => seq(
      separated($.match_arm_cond, "|", false),
      "=>",
      choice(
        $.block,
        $.return,
        $.match_statement,
        $.break,
        $.continue,
        seq($.expression, ","),
      )
    ),
    match_arm_cond: $ => choice($.number, $.char, $.path, "_"),
    path: $ => seq($.identifier, repeat(seq("::", $.identifier))),

    var_declaration: $ => seq(
      "let", $.identifier, optional(seq(":", $.typeident)),
      "=", $.expression, ";"
    ),
    global_const_declaration: $ => seq(
      "const", $.identifier, 
      choice(
        seq(optional(seq(":", $.typeident)), "=", $.expression, ";"),
        seq("=", $.import)
      ),
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
      $.null,
      $.fn_call,
      $.struct_init,
      $.identifier,
      $.array_init,
      seq("sizeof", "(", $.typeident, ")"),
    ),

    bool: $ => choice("true", "false"),
    null: $ => "null",

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
      prec.right(2, seq($.expression,  "=", $.expression)),
      prec.right(2, seq($.expression,  "+=", $.expression)),
      prec.right(2, seq($.expression,  "-=", $.expression)),
      prec.right(2, seq($.expression,  "/=", $.expression)),
      prec.right(2, seq($.expression,  "*=", $.expression)),
      prec.right(2, seq($.expression,  "%=", $.expression)),
      prec.left(8, seq($.expression,   "||", $.expression)),
      prec.left(6, seq($.expression,   "&&", $.expression)),
      prec.left(10, seq($.expression,  "==", $.expression)),
      prec.left(10, seq($.expression,  "!=", $.expression)),
      prec.left(12, seq($.expression,  ">", $.expression)),
      prec.left(12, seq($.expression,  ">=", $.expression)),
      prec.left(12, seq($.expression,  "<", $.expression)),
      prec.left(12, seq($.expression,  "<=", $.expression)),
      prec.left(20, seq($.expression,  "+", $.expression)),
      prec.left(20, seq($.expression,  "-", $.expression)),
      prec.left(30, seq($.expression,  "*", $.expression)),
      prec.left(32, seq($.expression,  "/", $.expression)),
      prec.left(34, seq($.expression,  "%", $.expression)),
      prec.left(40, seq($.expression,  "as", $.typeident)),
      prec.left(120, seq($.expression, ".", $.expression)),
      prec.left(130, seq($.expression, "::", $.expression)),
      prec.left(100, seq($.expression, "[", $.expression, "]")),
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: $ => token(seq(/[0-9]+/, optional(seq(".", /[0-9]+/)))),
    string: $ => seq(
      '"',
      repeat(choice($.string_escape, /[^"\\\n]/)),
      token.immediate('"')
    ),
    string_escape: $ => token.immediate(/\\[ntr0"]/),
    char: $ => seq(
      "'",
      choice($.char_escape, /[^\'\\\n]/),
      token.immediate("'")
    ),
    char_escape: $ => token.immediate(/\\[ntr0']/),
  }
});
