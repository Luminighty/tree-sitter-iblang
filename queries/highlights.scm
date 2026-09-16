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
(fn_call (path) @function.call)
(fn_call (identifier) @function.call)
(param_item (identifier) @variable.parameter)

(struct_init (path) @constructor)
(struct_init (identifier) @constructor)
(object_field (identifier) @property)
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
(primary (path) @constant.enum)
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
(char_escape) @character.escape
(string) @string
(string_escape) @string.escape
(hexa_escape) @string.escape

(ERROR) @error
