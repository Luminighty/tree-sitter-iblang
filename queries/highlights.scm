"fn" @keyword
"return" @keyword
"struct" @keyword
"enum" @keyword
"union" @keyword
"extern" @keyword
"let" @keyword
"const" @keyword
"if" @keyword
"else" @keyword
"loop" @keyword
"while" @keyword
"match" @keyword
"break" @keyword
"continue" @keyword
"import" @keyword
"for" @keyword
"sizeof" @keyword
"pub" @keyword

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

(prototype (identifier) @function)
(fn_call (identifier) @function)
(param_item (identifier) @variable.parameter)

(struct_init (path) @constructor)
(object_field (identifier) @property)
(struct_init_field (identifier) @property)

(typeident) @type
(typeident (path) @type)
(typeident_any) @type.builtin
(typeident_primitive) @type.builtin
"void" @type.builtin

(number) @constant.builtin
(bool) @constant.builtin
(null) @constant.builtin
(primary (path) @constant.enum)
(match_arm_cond (path) @constant.enum)
(constant) @constant

(string_escape) @escape
(char_escape) @escape
(hexa_escape) @hexa_escape

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

(char) @string
(string) @string

(ERROR) @error
