"fn" @keyword
"return" @keyword
"struct" @keyword
"extern" @keyword
"let" @keyword
"const" @keyword
"if" @keyword
"else" @keyword
"loop" @keyword
"while" @keyword
; "match" @keyword
; "break" @keyword
; "continue" @keyword
; "import" @keyword

"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket

":" @punctuation.delimiter
"." @punctuation.delimiter
"," @punctuation.delimiter
";" @punctuation.delimiter

(comment) @comment

(prototype (identifier) @function)
(fn_call (identifier) @function)
(param_item (identifier) @variable.parameter)

(struct_init (identifier) @constructor)
(struct_field (identifier) @property)
(struct_init_field (identifier) @property)

(typeident) @type
(typeident_primitive) @type.builtin
"void" @type.builtin

(number) @constant.builtin
(bool) @constant.builtin

(string_escape) @escape
(char_escape) @escape

"*" @operator
"&" @operator

(char) @string
(string) @string

(ERROR) @error
