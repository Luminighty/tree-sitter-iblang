"fn" @keyword.function
"return" @keyword.return
"struct" @keyword.type
"enum" @keyword.type
"union" @keyword.type
"extern" @keyword.modifier
"let" @keyword
"const" @keyword
"if" @keyword.conditional
"else" @keyword.conditional
"match" @keyword.conditional
"loop" @keyword.repeat
"while" @keyword.repeat
"for" @keyword.repeat
"break" @keyword.repeat
"continue" @keyword.repeat
"import" @keyword
"sizeof" @keyword
"pub" @keyword.modifier

"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket

":" @punctuation.delimiter
"::" @punctuation.delimiter
"." @punctuation.delimiter
"," @punctuation.delimiter
";" @punctuation.delimiter

(comment) @comment

(global_const_declaration (identifier) @module (import))
(import (string) @string.special.path)
(prototype (identifier) @function)
(fn_call (path) @function.call)
(fn_call (identifier) @function.call)
(param_item (identifier) @variable.parameter)

(struct_definition (identifier) @type.defintion)
(union_definition (identifier) @type.defintion)
(object_field (identifier) @property)
(enum_definition (identifier) @type.defintion)
(enum_field (identifier) @constant.enum)

(struct_init (path) @constructor)
(struct_init (identifier) @constructor)
(struct_init_field (identifier) @property)

(typeident) @type
(typeident (path) @type)
(typeident_any) @type.builtin
(typeident_primitive) @type.builtin
"void" @type.builtin

; Literals
(number) @number
(bool) @boolean
(null) @constant.builtin
(primary (path) @variable.member)
(primary (identifier) @variable)
(match_arm_cond (path) @constant.enum)
(constant) @constant

"*" @operator
"&" @operator
"|" @operator
"^" @operator
"=>" @operator
"=" @operator
"+=" @operator
"-=" @operator
"/=" @operator
"*=" @operator
"%=" @operator
"||" @operator
"&&" @operator
"==" @operator
"!=" @operator
">" @operator
">=" @operator
"<=" @operator
"+" @operator
"-" @operator
"*" @operator
"/" @operator
"%" @operator
"as" @operator
"!" @operator
"|=" @operator
"&=" @operator
"^=" @operator
">>=" @operator
"<<=" @operator

(char) @character
(char_escape) @string.escape
(string) @string
(string_escape) @string.escape
(hexa_escape) @string.escape

(ERROR) @error
