


var __filename = "<UNKNOWN>";
if (!Object.create || !Object.defineProperty || !Object.defineProperties) alert("Example will fail because your browser does not support ECMAScript 5. Try with another browser!");
var __filename = "" + window.location;
window.Streamline = { globals: {} };
function require(str) {
 if (str == "streamline/lib/util/flows") return Streamline.flows;
 else if (str == "streamline/lib/globals") return Streamline.globals;
 else if (str == "streamline/lib/callbacks/runtime") return Streamline.runtime;
 else if (str == "streamline/lib/callbacks/transform") return Streamline;
 else if (str == "streamline/lib/callbacks/builtins") return Streamline.builtins;
 else if (str == "streamline/lib/globals") return Streamline.globals;
 else if (str == "streamline/lib/util/future") return Streamline.future;
 else alert("cannot require " + str)
}
var Streamline = (function() {
function alert(message) {
 throw new Error(message);
}
(function() {
    var narcissus = {
        options: {
            version: 185,
        },
        hostGlobal: this
    };
    Narcissus = narcissus;
})();
Narcissus.definitions = (function() {
    var tokens = [
        "END",
        "\n", ";",
        ",",
        "=",
        "?", ":", "CONDITIONAL",
        "||",
        "&&",
        "|",
        "^",
        "&",
        "==", "!=", "===", "!==",
        "<", "<=", ">=", ">",
        "<<", ">>", ">>>",
        "+", "-",
        "*", "/", "%",
        "!", "~", "UNARY_PLUS", "UNARY_MINUS",
        "++", "--",
        ".",
        "[", "]",
        "{", "}",
        "(", ")",
        "SCRIPT", "BLOCK", "LABEL", "FOR_IN", "CALL", "NEW_WITH_ARGS", "INDEX",
        "ARRAY_INIT", "OBJECT_INIT", "PROPERTY_INIT", "GETTER", "SETTER",
        "GROUP", "LIST", "LET_BLOCK", "ARRAY_COMP", "GENERATOR", "COMP_TAIL",
        "IDENTIFIER", "NUMBER", "STRING", "REGEXP",
        "break",
        "case", "catch", "const", "continue",
        "debugger", "default", "delete", "do",
        "else",
        "false", "finally", "for", "function",
        "if", "in", "instanceof",
        "let",
        "new", "null",
        "return",
        "switch",
        "this", "throw", "true", "try", "typeof",
        "var", "void",
        "yield",
        "while", "with",
    ];
    var statementStartTokens = [
        "break",
        "const", "continue",
        "debugger", "do",
        "for",
        "if",
        "return",
        "switch",
        "throw", "try",
        "var",
        "yield",
        "while", "with",
    ];
    var opTypeNames = {
        '\n': "NEWLINE",
        ';': "SEMICOLON",
        ',': "COMMA",
        '?': "HOOK",
        ':': "COLON",
        '||': "OR",
        '&&': "AND",
        '|': "BITWISE_OR",
        '^': "BITWISE_XOR",
        '&': "BITWISE_AND",
        '===': "STRICT_EQ",
        '==': "EQ",
        '=': "ASSIGN",
        '!==': "STRICT_NE",
        '!=': "NE",
        '<<': "LSH",
        '<=': "LE",
        '<': "LT",
        '>>>': "URSH",
        '>>': "RSH",
        '>=': "GE",
        '>': "GT",
        '++': "INCREMENT",
        '--': "DECREMENT",
        '+': "PLUS",
        '-': "MINUS",
        '*': "MUL",
        '/': "DIV",
        '%': "MOD",
        '!': "NOT",
        '~': "BITWISE_NOT",
        '.': "DOT",
        '[': "LEFT_BRACKET",
        ']': "RIGHT_BRACKET",
        '{': "LEFT_CURLY",
        '}': "RIGHT_CURLY",
        '(': "LEFT_PAREN",
        ')': "RIGHT_PAREN"
    };
    var keywords = {__proto__: null};
    var tokenIds = {};
    var consts = "const ";
    for (var i = 0, j = tokens.length; i < j; i++) {
        if (i > 0)
            consts += ", ";
        var t = tokens[i];
        var name;
        if (/^[a-z]/.test(t)) {
            name = t.toUpperCase();
            keywords[t] = i;
        } else {
            name = (/^\W/.test(t) ? opTypeNames[t] : t);
        }
        consts += name + " = " + i;
        tokenIds[name] = i;
        tokens[t] = i;
    }
    consts += ";";
    var isStatementStartCode = {__proto__: null};
    for (i = 0, j = statementStartTokens.length; i < j; i++)
        isStatementStartCode[keywords[statementStartTokens[i]]] = true;
    var assignOps = ['|', '^', '&', '<<', '>>', '>>>', '+', '-', '*', '/', '%'];
    for (i = 0, j = assignOps.length; i < j; i++) {
        t = assignOps[i];
        assignOps[t] = tokens[t];
    }
    function defineGetter(obj, prop, fn, dontDelete, dontEnum) {
        Object.defineProperty(obj, prop,
                              { get: fn, configurable: !dontDelete, enumerable: !dontEnum });
    }
    function defineProperty(obj, prop, val, dontDelete, readOnly, dontEnum) {
        Object.defineProperty(obj, prop,
                              { value: val, writable: !readOnly, configurable: !dontDelete,
                                enumerable: !dontEnum });
    }
    function isNativeCode(fn) {
        return ((typeof fn) === "function") && fn.toString().match(/\[native code\]/);
    }
    function getPropertyDescriptor(obj, name) {
        while (obj) {
            if (({}).hasOwnProperty.call(obj, name))
                return Object.getOwnPropertyDescriptor(obj, name);
            obj = Object.getPrototypeOf(obj);
        }
    }
    function getOwnProperties(obj) {
        var map = {};
        for (var name in Object.getOwnPropertyNames(obj))
            map[name] = Object.getOwnPropertyDescriptor(obj, name);
        return map;
    }
    function makePassthruHandler(obj) {
        return {
            getOwnPropertyDescriptor: function(name) {
                var desc = Object.getOwnPropertyDescriptor(obj, name);
                desc.configurable = true;
                return desc;
            },
            getPropertyDescriptor: function(name) {
                var desc = getPropertyDescriptor(obj, name);
                desc.configurable = true;
                return desc;
            },
            getOwnPropertyNames: function() {
                return Object.getOwnPropertyNames(obj);
            },
            defineProperty: function(name, desc) {
                Object.defineProperty(obj, name, desc);
            },
            "delete": function(name) { return delete obj[name]; },
            fix: function() {
                if (Object.isFrozen(obj)) {
                    return getOwnProperties(obj);
                }
                return undefined;
            },
            has: function(name) { return name in obj; },
            hasOwn: function(name) { return ({}).hasOwnProperty.call(obj, name); },
            get: function(receiver, name) { return obj[name]; },
            set: function(receiver, name, val) { obj[name] = val; return true; },
            enumerate: function() {
                var result = [];
                for (name in obj) { result.push(name); };
                return result;
            },
            keys: function() { return Object.keys(obj); }
        };
    }
    function noPropFound() { return undefined; }
    var hasOwnProperty = ({}).hasOwnProperty;
    function StringMap() {
        this.table = Object.create(null, {});
        this.size = 0;
    }
    StringMap.prototype = {
        has: function(x) { return hasOwnProperty.call(this.table, x); },
        set: function(x, v) {
            if (!hasOwnProperty.call(this.table, x))
                this.size++;
            this.table[x] = v;
        },
        get: function(x) { return this.table[x]; },
        getDef: function(x, thunk) {
            if (!hasOwnProperty.call(this.table, x)) {
                this.size++;
                this.table[x] = thunk();
            }
            return this.table[x];
        },
        forEach: function(f) {
            var table = this.table;
            for (var key in table)
                f.call(this, key, table[key]);
        },
        toString: function() { return "[object StringMap]" }
    };
    function Stack(elts) {
        this.elts = elts || null;
    }
    Stack.prototype = {
        push: function(x) {
            return new Stack({ top: x, rest: this.elts });
        },
        top: function() {
            if (!this.elts)
                throw new Error("empty stack");
            return this.elts.top;
        },
        isEmpty: function() {
            return this.top === null;
        },
        find: function(test) {
            for (var elts = this.elts; elts; elts = elts.rest) {
                if (test(elts.top))
                    return elts.top;
            }
            return null;
        },
        has: function(x) {
            return Boolean(this.find(function(elt) { return elt === x }));
        },
        forEach: function(f) {
            for (var elts = this.elts; elts; elts = elts.rest) {
                f(elts.top);
            }
        }
    };
    return {
        tokens: tokens,
        opTypeNames: opTypeNames,
        keywords: keywords,
        isStatementStartCode: isStatementStartCode,
        tokenIds: tokenIds,
        consts: consts,
        assignOps: assignOps,
        defineGetter: defineGetter,
        defineProperty: defineProperty,
        isNativeCode: isNativeCode,
        makePassthruHandler: makePassthruHandler,
        noPropFound: noPropFound,
        StringMap: StringMap,
        Stack: Stack
    };
}());
Narcissus.lexer = (function() {
    var definitions = Narcissus.definitions;
    eval(definitions.consts);
    var opTokens = {};
    for (var op in definitions.opTypeNames) {
        if (op === '\n' || op === '.')
            continue;
        var node = opTokens;
        for (var i = 0; i < op.length; i++) {
            var ch = op[i];
            if (!(ch in node))
                node[ch] = {};
            node = node[ch];
            node.op = op;
        }
    }
    function Tokenizer(s, f, l) {
        this.cursor = 0;
        this.source = String(s);
        this.tokens = [];
        this.tokenIndex = 0;
        this.lookahead = 0;
        this.scanNewlines = false;
        this.unexpectedEOF = false;
        this.filename = f || "";
        this.lineno = l || 1;
    }
    Tokenizer.prototype = {
        get done() {
            return this.peek(true) === END;
        },
        get token() {
            return this.tokens[this.tokenIndex];
        },
        match: function (tt, scanOperand) {
            return this.get(scanOperand) === tt || this.unget();
        },
        mustMatch: function (tt) {
            if (!this.match(tt)) {
                throw this.newSyntaxError("Missing " +
                                          definitions.tokens[tt].toLowerCase());
            }
            return this.token;
        },
        forceIdentifier: function() {
         if (!this.match(IDENTIFIER)) {
          if (this.get() >= definitions.keywords[0] || this.unget) {
           this.token.type = IDENTIFIER;
          }
          else {
           throw this.newSyntaxError("Missing identifier");
          }
         }
         return this.token;
        },
        peek: function (scanOperand) {
            var tt, next;
            if (this.lookahead) {
                next = this.tokens[(this.tokenIndex + this.lookahead) & 3];
                tt = (this.scanNewlines && next.lineno !== this.lineno)
                     ? NEWLINE
                     : next.type;
            } else {
                tt = this.get(scanOperand);
                this.unget();
            }
            return tt;
        },
        peekOnSameLine: function (scanOperand) {
            this.scanNewlines = true;
            var tt = this.peek(scanOperand);
            this.scanNewlines = false;
            return tt;
        },
        skip: function () {
            var input = this.source;
            for (;;) {
                var ch = input[this.cursor++];
                var next = input[this.cursor];
                if (ch === '\n' && !this.scanNewlines) {
                    this.lineno++;
                } else if (ch === '/' && next === '*') {
                    this.cursor++;
                    for (;;) {
                        ch = input[this.cursor++];
                        if (ch === undefined)
                            throw this.newSyntaxError("Unterminated comment");
                        if (ch === '*') {
                            next = input[this.cursor];
                            if (next === '/') {
                                this.cursor++;
                                break;
                            }
                        } else if (ch === '\n') {
                            this.lineno++;
                        }
                    }
                } else if (ch === '/' && next === '/') {
                    this.cursor++;
                    for (;;) {
                        ch = input[this.cursor++];
                        if (ch === undefined)
                            return;
                        if (ch === '\n') {
                            this.lineno++;
                            break;
                        }
                    }
                } else if (ch !== ' ' && ch !== '\t') {
                    this.cursor--;
                    return;
                }
            }
        },
        lexExponent: function() {
            var input = this.source;
            var next = input[this.cursor];
            if (next === 'e' || next === 'E') {
                this.cursor++;
                ch = input[this.cursor++];
                if (ch === '+' || ch === '-')
                    ch = input[this.cursor++];
                if (ch < '0' || ch > '9')
                    throw this.newSyntaxError("Missing exponent");
                do {
                    ch = input[this.cursor++];
                } while (ch >= '0' && ch <= '9');
                this.cursor--;
                return true;
            }
            return false;
        },
        lexZeroNumber: function (ch) {
            var token = this.token, input = this.source;
            token.type = NUMBER;
            ch = input[this.cursor++];
            if (ch === '.') {
                do {
                    ch = input[this.cursor++];
                } while (ch >= '0' && ch <= '9');
                this.cursor--;
                this.lexExponent();
                token.value = parseFloat(input.substring(token.start, this.cursor));
            } else if (ch === 'x' || ch === 'X') {
                do {
                    ch = input[this.cursor++];
                } while ((ch >= '0' && ch <= '9') || (ch >= 'a' && ch <= 'f') ||
                         (ch >= 'A' && ch <= 'F'));
                this.cursor--;
                token.value = parseInt(input.substring(token.start, this.cursor));
            } else if (ch >= '0' && ch <= '7') {
                do {
                    ch = input[this.cursor++];
                } while (ch >= '0' && ch <= '7');
                this.cursor--;
                token.value = parseInt(input.substring(token.start, this.cursor));
            } else {
                this.cursor--;
                this.lexExponent();
                token.value = 0;
            }
        },
        lexNumber: function (ch) {
            var token = this.token, input = this.source;
            token.type = NUMBER;
            var floating = false;
            do {
                ch = input[this.cursor++];
                if (ch === '.' && !floating) {
                    floating = true;
                    ch = input[this.cursor++];
                }
            } while (ch >= '0' && ch <= '9');
            this.cursor--;
            var exponent = this.lexExponent();
            floating = floating || exponent;
            var str = input.substring(token.start, this.cursor);
            token.value = floating ? parseFloat(str) : parseInt(str);
        },
        lexDot: function (ch) {
            var token = this.token, input = this.source;
            var next = input[this.cursor];
            if (next >= '0' && next <= '9') {
                do {
                    ch = input[this.cursor++];
                } while (ch >= '0' && ch <= '9');
                this.cursor--;
                this.lexExponent();
                token.type = NUMBER;
                token.value = parseFloat(input.substring(token.start, this.cursor));
            } else {
                token.type = DOT;
                token.assignOp = null;
                token.value = '.';
            }
        },
        lexString: function (ch) {
            var token = this.token, input = this.source;
            token.type = STRING;
            var hasEscapes = false;
            var delim = ch;
            while ((ch = input[this.cursor++]) !== delim) {
                if (this.cursor == input.length)
                    throw this.newSyntaxError("Unterminated string literal");
                if (ch === '\\') {
                    hasEscapes = true;
                    if (input[this.cursor] === '\n') this.lineno++;
                    if (++this.cursor == input.length)
                        throw this.newSyntaxError("Unterminated string literal");
                }
            }
            token.value = hasEscapes
                          ? eval(input.substring(token.start, this.cursor))
                          : input.substring(token.start + 1, this.cursor - 1);
        },
        lexRegExp: function (ch) {
            var token = this.token, input = this.source;
            token.type = REGEXP;
            do {
                ch = input[this.cursor++];
                if (ch === '\\') {
                    this.cursor++;
                } else if (ch === '[') {
                    do {
                        if (ch === undefined)
                            throw this.newSyntaxError("Unterminated character class");
                        if (ch === '\\')
                            this.cursor++;
                        ch = input[this.cursor++];
                    } while (ch !== ']');
                } else if (ch === undefined) {
                    throw this.newSyntaxError("Unterminated regex");
                }
            } while (ch !== '/');
            do {
                ch = input[this.cursor++];
            } while (ch >= 'a' && ch <= 'z');
            this.cursor--;
            token.value = eval(input.substring(token.start, this.cursor));
        },
        lexOp: function (ch) {
            var token = this.token, input = this.source;
            var node = opTokens[ch];
            var next = input[this.cursor];
            if (next in node) {
                node = node[next];
                this.cursor++;
                next = input[this.cursor];
                if (next in node) {
                    node = node[next];
                    this.cursor++;
                    next = input[this.cursor];
                }
            }
            var op = node.op;
            if (definitions.assignOps[op] && input[this.cursor] === '=') {
                this.cursor++;
                token.type = ASSIGN;
                token.assignOp = definitions.tokenIds[definitions.opTypeNames[op]];
                op += '=';
            } else {
                token.type = definitions.tokenIds[definitions.opTypeNames[op]];
                token.assignOp = null;
            }
            token.value = op;
        },
        lexIdent: function (ch) {
            var token = this.token, input = this.source;
            do {
                ch = input[this.cursor++];
            } while ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') ||
                     (ch >= '0' && ch <= '9') || ch === '$' || ch === '_');
            this.cursor--;
            var id = input.substring(token.start, this.cursor);
            token.type = definitions.keywords[id] || IDENTIFIER;
            token.value = id;
        },
        get: function (scanOperand) {
            var token;
            while (this.lookahead) {
                --this.lookahead;
                this.tokenIndex = (this.tokenIndex + 1) & 3;
                token = this.tokens[this.tokenIndex];
                if (token.type !== NEWLINE || this.scanNewlines)
                    return token.type;
            }
            this.skip();
            this.tokenIndex = (this.tokenIndex + 1) & 3;
            token = this.tokens[this.tokenIndex];
            if (!token)
                this.tokens[this.tokenIndex] = token = {};
            var input = this.source;
            if (this.cursor === input.length)
                return token.type = END;
            token.start = this.cursor;
            token.lineno = this.lineno;
            var ch = input[this.cursor++];
            if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '$' || ch === '_') {
                this.lexIdent(ch);
            } else if (scanOperand && ch === '/') {
                this.lexRegExp(ch);
            } else if (ch in opTokens) {
                this.lexOp(ch);
            } else if (ch === '.') {
                this.lexDot(ch);
            } else if (ch >= '1' && ch <= '9') {
                this.lexNumber(ch);
            } else if (ch === '0') {
                this.lexZeroNumber(ch);
            } else if (ch === '"' || ch === "'") {
                this.lexString(ch);
            } else if (this.scanNewlines && ch === '\n') {
                token.type = NEWLINE;
                token.value = '\n';
                this.lineno++;
            } else {
                throw this.newSyntaxError("Illegal token");
            }
            token.end = this.cursor;
            return token.type;
        },
        unget: function () {
            if (++this.lookahead === 4) throw "PANIC: too much lookahead!";
            this.tokenIndex = (this.tokenIndex - 1) & 3;
        },
        newSyntaxError: function (m) {
            var e = new SyntaxError(this.filename + ":" + this.lineno + ":" + m);
            e.source = this.source;
            e.cursor = this.lookahead
                       ? this.tokens[(this.tokenIndex + this.lookahead) & 3].start
                       : this.cursor;
            return e;
        },
    };
    return { Tokenizer: Tokenizer };
}());
Narcissus.parser = (function() {
    var lexer = Narcissus.lexer;
    var definitions = Narcissus.definitions;
    const StringMap = definitions.StringMap;
    const Stack = definitions.Stack;
    eval(definitions.consts);
    function pushDestructuringVarDecls(n, s) {
        for (var i in n) {
            var sub = n[i];
            if (sub.type === IDENTIFIER) {
                s.varDecls.push(sub);
            } else {
                pushDestructuringVarDecls(sub, s);
            }
        }
    }
    const NESTING_TOP = 0, NESTING_SHALLOW = 1, NESTING_DEEP = 2;
    function StaticContext(parentScript, parentBlock, inFunction, inForLoopInit, nesting) {
        this.parentScript = parentScript;
        this.parentBlock = parentBlock;
        this.inFunction = inFunction;
        this.inForLoopInit = inForLoopInit;
        this.nesting = nesting;
        this.allLabels = new Stack();
        this.currentLabels = new Stack();
        this.labeledTargets = new Stack();
        this.defaultTarget = null;
        Narcissus.options.ecma3OnlyMode && (this.ecma3OnlyMode = true);
        Narcissus.options.parenFreeMode && (this.parenFreeMode = true);
    }
    StaticContext.prototype = {
        ecma3OnlyMode: false,
        parenFreeMode: false,
        update: function(ext) {
            var desc = {};
            for (var key in ext) {
                desc[key] = {
                    value: ext[key],
                    writable: true,
                    enumerable: true,
                    configurable: true
                }
            }
            return Object.create(this, desc);
        },
        pushLabel: function(label) {
            return this.update({ currentLabels: this.currentLabels.push(label),
                                 allLabels: this.allLabels.push(label) });
        },
        pushTarget: function(target) {
            var isDefaultTarget = target.isLoop || target.type === SWITCH;
            if (isDefaultTarget) target.target = this.defaultTarget;
            if (this.currentLabels.isEmpty()) {
                return isDefaultTarget
                     ? this.update({ defaultTarget: target })
                     : this;
            }
            target.labels = new StringMap();
            this.currentLabels.forEach(function(label) {
                target.labels.set(label, true);
            });
            return this.update({ currentLabels: new Stack(),
                                 labeledTargets: this.labeledTargets.push(target),
                                 defaultTarget: isDefaultTarget
                                                ? target
                                                : this.defaultTarget });
        },
        nest: function(atLeast) {
            var nesting = Math.max(this.nesting, atLeast);
            return (nesting !== this.nesting)
                 ? this.update({ nesting: nesting })
                 : this;
        }
    };
    function Script(t, inFunction) {
        var n = new Node(t, scriptInit());
        var x = new StaticContext(n, n, inFunction, false, NESTING_TOP);
        Statements(t, x, n);
        return n;
    }
    definitions.defineProperty(Array.prototype, "top",
                               function() {
                                   return this.length && this[this.length-1];
                               }, false, false, true);
    function Node(t, init) {
        var token = t.token;
        if (token) {
            this.type = token.type;
            this.value = token.value;
            this.lineno = token.lineno;
            this.start = token.start;
            this.end = token.end;
        } else {
            this.lineno = t.lineno;
        }
        this.tokenizer = t;
        this.children = [];
        for (var prop in init)
            this[prop] = init[prop];
    }
    var Np = Node.prototype = {};
    Np.constructor = Node;
    Np.toSource = Object.prototype.toSource;
    Np.push = function (kid) {
        if (kid !== null) {
            if (kid.start < this.start)
                this.start = kid.start;
            if (this.end < kid.end)
                this.end = kid.end;
        }
        return this.children.push(kid);
    }
    Node.indentLevel = 0;
    function tokenString(tt) {
        var t = definitions.tokens[tt];
        return /^\W/.test(t) ? definitions.opTypeNames[t] : t.toUpperCase();
    }
    Np.toString = function () {
        var a = [];
        for (var i in this) {
            if (this.hasOwnProperty(i) && i !== 'type' && i !== 'target')
                a.push({id: i, value: this[i]});
        }
        a.sort(function (a,b) { return (a.id < b.id) ? -1 : 1; });
        const INDENTATION = "    ";
        var n = ++Node.indentLevel;
        var s = "{\n" + INDENTATION.repeat(n) + "type: " + tokenString(this.type);
        for (i = 0; i < a.length; i++)
            s += ", " + a[i].id + ": " + a[i].value;
        n = --Node.indentLevel;
        s += "\n" + INDENTATION.repeat(n) + "}";
        return s;
    }
    Np.getSource = function () {
        return this.tokenizer.source.slice(this.start, this.end);
    };
    const LOOP_INIT = { isLoop: true };
    function blockInit() {
        return { type: BLOCK, varDecls: [] };
    }
    function scriptInit() {
        return { type: SCRIPT,
                 funDecls: [],
                 varDecls: [],
                 modDecls: [],
                 impDecls: [],
                 expDecls: [],
                 loadDeps: [],
                 hasEmptyReturn: false,
                 hasReturnWithValue: false,
                 isGenerator: false };
    }
    definitions.defineGetter(Np, "filename",
                             function() {
                                 return this.tokenizer.filename;
                             });
    definitions.defineGetter(Np, "length",
                             function() {
                                 throw new Error("Node.prototype.length is gone; " +
                                                 "use n.children.length instead");
                             });
    definitions.defineProperty(String.prototype, "repeat",
                               function(n) {
                                   var s = "", t = this + s;
                                   while (--n >= 0)
                                       s += t;
                                   return s;
                               }, false, false, true);
    function MaybeLeftParen(t, x) {
        if (x.parenFreeMode)
            return t.match(LEFT_PAREN) ? LEFT_PAREN : END;
        return t.mustMatch(LEFT_PAREN).type;
    }
    function MaybeRightParen(t, p) {
        if (p === LEFT_PAREN)
            t.mustMatch(RIGHT_PAREN);
    }
    function Statements(t, x, n) {
        try {
            while (!t.done && t.peek(true) !== RIGHT_CURLY)
                n.push(Statement(t, x));
        } catch (e) {
            if (t.done)
                t.unexpectedEOF = true;
            throw e;
        }
    }
    function Block(t, x) {
        t.mustMatch(LEFT_CURLY);
        var n = new Node(t, blockInit());
        Statements(t, x.update({ parentBlock: n }).pushTarget(n), n);
        t.mustMatch(RIGHT_CURLY);
        n.end = t.token.end;
        return n;
    }
    const DECLARED_FORM = 0, EXPRESSED_FORM = 1, STATEMENT_FORM = 2;
    function Statement(t, x) {
        var i, label, n, n2, p, c, ss, tt = t.get(true), tt2, x2, x3;
        switch (tt) {
          case FUNCTION:
            return FunctionDefinition(t, x, true,
                                      (x.nesting !== NESTING_TOP)
                                      ? STATEMENT_FORM
                                      : DECLARED_FORM);
          case LEFT_CURLY:
            n = new Node(t, blockInit());
            Statements(t, x.update({ parentBlock: n }).pushTarget(n).nest(NESTING_SHALLOW), n);
            t.mustMatch(RIGHT_CURLY);
            n.end = t.token.end;
            return n;
          case IF:
            n = new Node(t);
            n.condition = HeadExpression(t, x);
            x2 = x.pushTarget(n).nest(NESTING_DEEP);
            n.thenPart = Statement(t, x2);
            n.elsePart = t.match(ELSE) ? Statement(t, x2) : null;
            return n;
          case SWITCH:
            n = new Node(t, { cases: [], defaultIndex: -1 });
            n.discriminant = HeadExpression(t, x);
            x2 = x.pushTarget(n).nest(NESTING_DEEP);
            t.mustMatch(LEFT_CURLY);
            while ((tt = t.get()) !== RIGHT_CURLY) {
                switch (tt) {
                  case DEFAULT:
                    if (n.defaultIndex >= 0)
                        throw t.newSyntaxError("More than one switch default");
                  case CASE:
                    n2 = new Node(t);
                    if (tt === DEFAULT)
                        n.defaultIndex = n.cases.length;
                    else
                        n2.caseLabel = Expression(t, x2, COLON);
                    break;
                  default:
                    throw t.newSyntaxError("Invalid switch case");
                }
                t.mustMatch(COLON);
                n2.statements = new Node(t, blockInit());
                while ((tt=t.peek(true)) !== CASE && tt !== DEFAULT &&
                        tt !== RIGHT_CURLY)
                    n2.statements.push(Statement(t, x2));
                n.cases.push(n2);
            }
            n.end = t.token.end;
            return n;
          case FOR:
            n = new Node(t, LOOP_INIT);
            if (t.match(IDENTIFIER)) {
                if (t.token.value === "each")
                    n.isEach = true;
                else
                    t.unget();
            }
            if (!x.parenFreeMode)
                t.mustMatch(LEFT_PAREN);
            x2 = x.pushTarget(n).nest(NESTING_DEEP);
            x3 = x.update({ inForLoopInit: true });
            if ((tt = t.peek()) !== SEMICOLON) {
                if (tt === VAR || tt === CONST) {
                    t.get();
                    n2 = Variables(t, x3);
                } else if (tt === LET) {
                    t.get();
                    if (t.peek() === LEFT_PAREN) {
                        n2 = LetBlock(t, x3, false);
                    } else {
                        x3.parentBlock = n;
                        n.varDecls = [];
                        n2 = Variables(t, x3);
                    }
                } else {
                    n2 = Expression(t, x3);
                }
            }
            if (n2 && t.match(IN)) {
                n.type = FOR_IN;
                n.object = Expression(t, x3);
                if (n2.type === VAR || n2.type === LET) {
                    c = n2.children;
                    if (c.length !== 1 && n2.destructurings.length !== 1) {
                        throw new SyntaxError("Invalid for..in left-hand side",
                                              t.filename, n2.lineno);
                    }
                    if (n2.destructurings.length > 0) {
                        n.iterator = n2.destructurings[0];
                    } else {
                        n.iterator = c[0];
                    }
                    n.varDecl = n2;
                } else {
                    if (n2.type === ARRAY_INIT || n2.type === OBJECT_INIT) {
                        n2.destructuredNames = checkDestructuring(t, x3, n2);
                    }
                    n.iterator = n2;
                }
            } else {
                n.setup = n2;
                t.mustMatch(SEMICOLON);
                if (n.isEach)
                    throw t.newSyntaxError("Invalid for each..in loop");
                n.condition = (t.peek() === SEMICOLON)
                              ? null
                              : Expression(t, x3);
                t.mustMatch(SEMICOLON);
                tt2 = t.peek();
                n.update = (x.parenFreeMode
                            ? tt2 === LEFT_CURLY || definitions.isStatementStartCode[tt2]
                            : tt2 === RIGHT_PAREN)
                           ? null
                           : Expression(t, x3);
            }
            if (!x.parenFreeMode)
                t.mustMatch(RIGHT_PAREN);
            n.body = Statement(t, x2);
            n.end = t.token.end;
            return n;
          case WHILE:
            n = new Node(t, { isLoop: true });
            n.condition = HeadExpression(t, x);
            n.body = Statement(t, x.pushTarget(n).nest(NESTING_DEEP));
            n.end = t.token.end;
            return n;
          case DO:
            n = new Node(t, { isLoop: true });
            n.body = Statement(t, x.pushTarget(n).nest(NESTING_DEEP));
            t.mustMatch(WHILE);
            n.condition = HeadExpression(t, x);
            if (!x.ecmaStrictMode) {
                t.match(SEMICOLON);
                n.end = t.token.end;
                return n;
            }
            break;
          case BREAK:
          case CONTINUE:
            n = new Node(t);
            x2 = x.pushTarget(n);
            if (t.peekOnSameLine() === IDENTIFIER) {
                t.get();
                n.label = t.token.value;
            }
            n.target = n.label
                     ? x2.labeledTargets.find(function(target) { return target.labels.has(n.label) })
                     : x2.defaultTarget;
            if (!n.target)
                throw t.newSyntaxError("Invalid " + ((tt === BREAK) ? "break" : "continue"));
            if (tt === CONTINUE) {
                for (var ttt = n.target; ttt && !ttt.isLoop; ttt = ttt.target)
                    ;
                if (!ttt) throw t.newSyntaxError("Invalid continue");
            }
            break;
          case TRY:
            n = new Node(t, { catchClauses: [] });
            n.tryBlock = Block(t, x);
            while (t.match(CATCH)) {
                n2 = new Node(t);
                p = MaybeLeftParen(t, x);
                switch (t.get()) {
                  case LEFT_BRACKET:
                  case LEFT_CURLY:
                    t.unget();
                    n2.varName = DestructuringExpression(t, x, true);
                    break;
                  case IDENTIFIER:
                    n2.varName = t.token.value;
                    break;
                  default:
                    throw t.newSyntaxError("missing identifier in catch");
                    break;
                }
                if (t.match(IF)) {
                    if (x.ecma3OnlyMode)
                        throw t.newSyntaxError("Illegal catch guard");
                    if (n.catchClauses.length && !n.catchClauses.top().guard)
                        throw t.newSyntaxError("Guarded catch after unguarded");
                    n2.guard = Expression(t, x);
                }
                MaybeRightParen(t, p);
                n2.block = Block(t, x);
                n.catchClauses.push(n2);
            }
            if (t.match(FINALLY))
                n.finallyBlock = Block(t, x);
            if (!n.catchClauses.length && !n.finallyBlock)
                throw t.newSyntaxError("Invalid try statement");
            n.end = t.token.end;
            return n;
          case CATCH:
          case FINALLY:
            throw t.newSyntaxError(definitions.tokens[tt] + " without preceding try");
          case THROW:
            n = new Node(t);
            n.exception = Expression(t, x);
            break;
          case RETURN:
            n = ReturnOrYield(t, x);
            break;
          case WITH:
            n = new Node(t);
            n.object = HeadExpression(t, x);
            n.body = Statement(t, x.pushTarget(n).nest(NESTING_DEEP));
            n.end = t.token.end;
            return n;
          case VAR:
          case CONST:
            n = Variables(t, x);
            n.eligibleForASI = true;
            break;
          case LET:
            if (t.peek() === LEFT_PAREN)
                n = LetBlock(t, x, true);
            else
                n = Variables(t, x);
            n.eligibleForASI = true;
            break;
          case DEBUGGER:
            n = new Node(t);
            break;
          case NEWLINE:
          case SEMICOLON:
            n = new Node(t, { type: SEMICOLON });
            n.expression = null;
            return n;
          default:
            if (tt === IDENTIFIER) {
                tt = t.peek();
                if (tt === COLON) {
                    label = t.token.value;
                    if (x.allLabels.has(label))
                        throw t.newSyntaxError("Duplicate label");
                    t.get();
                    n = new Node(t, { type: LABEL, label: label });
                    n.statement = Statement(t, x.pushLabel(label).nest(NESTING_SHALLOW));
                    n.target = (n.statement.type === LABEL) ? n.statement.target : n.statement;
                    n.end = t.token.end;
                    return n;
                }
            }
            n = new Node(t, { type: SEMICOLON });
            t.unget();
            n.expression = Expression(t, x);
            n.end = n.expression.end;
            break;
        }
        MagicalSemicolon(t);
        n.end = t.token.end;
        return n;
    }
    function MagicalSemicolon(t) {
        var tt;
        if (t.lineno === t.token.lineno) {
            tt = t.peekOnSameLine();
            if (tt !== END && tt !== NEWLINE && tt !== SEMICOLON && tt !== RIGHT_CURLY)
                throw t.newSyntaxError("missing ; before statement");
        }
        t.match(SEMICOLON);
    }
    function ReturnOrYield(t, x) {
        var n, b, tt = t.token.type, tt2;
        var parentScript = x.parentScript;
        if (tt === RETURN) {
            if (false && !x.inFunction)
                throw t.newSyntaxError("Return not in function");
        } else {
            if (!x.inFunction)
                throw t.newSyntaxError("Yield not in function");
            parentScript.isGenerator = true;
        }
        n = new Node(t, { value: undefined });
        tt2 = t.peek(true);
        if (tt2 !== END && tt2 !== NEWLINE &&
            tt2 !== SEMICOLON && tt2 !== RIGHT_CURLY
            && (tt !== YIELD ||
                (tt2 !== tt && tt2 !== RIGHT_BRACKET && tt2 !== RIGHT_PAREN &&
                 tt2 !== COLON && tt2 !== COMMA))) {
            if (tt === RETURN) {
                n.value = Expression(t, x);
                parentScript.hasReturnWithValue = true;
            } else {
                n.value = AssignExpression(t, x);
            }
        } else if (tt === RETURN) {
            parentScript.hasEmptyReturn = true;
        }
        if (parentScript.hasReturnWithValue && parentScript.isGenerator)
            throw t.newSyntaxError("Generator returns a value");
        return n;
    }
    function FunctionDefinition(t, x, requireName, functionForm) {
        var tt;
        var f = new Node(t, { params: [] });
        if (f.type !== FUNCTION)
            f.type = (f.value === "get") ? GETTER : SETTER;
        if (t.match(IDENTIFIER))
            f.name = t.token.value;
        else if (requireName)
            throw t.newSyntaxError("missing function identifier");
        var x2 = new StaticContext(null, null, true, false, NESTING_TOP);
        t.mustMatch(LEFT_PAREN);
        if (!t.match(RIGHT_PAREN)) {
            do {
                switch (t.get()) {
                  case LEFT_BRACKET:
                  case LEFT_CURLY:
                    t.unget();
                    f.params.push(DestructuringExpression(t, x2));
                    break;
                  case IDENTIFIER:
                    f.params.push(t.token.value);
                    break;
                  default:
                    throw t.newSyntaxError("missing formal parameter");
                    break;
                }
            } while (t.match(COMMA));
            t.mustMatch(RIGHT_PAREN);
        }
        tt = t.get();
        if (tt !== LEFT_CURLY)
            t.unget();
        if (tt !== LEFT_CURLY) {
            f.body = AssignExpression(t, x2);
            if (f.body.isGenerator)
                throw t.newSyntaxError("Generator returns a value");
        } else {
            f.body = Script(t, true);
        }
        if (tt === LEFT_CURLY)
            t.mustMatch(RIGHT_CURLY);
        f.end = t.token.end;
        f.functionForm = functionForm;
        if (functionForm === DECLARED_FORM)
            x.parentScript.funDecls.push(f);
        return f;
    }
    function Variables(t, x, letBlock) {
        var n, n2, ss, i, s, tt;
        tt = t.token.type;
        switch (tt) {
          case VAR:
          case CONST:
            s = x.parentScript;
            break;
          case LET:
            s = x.parentBlock;
            break;
          case LEFT_PAREN:
            tt = LET;
            s = letBlock;
            break;
        }
        n = new Node(t, { type: tt, destructurings: [] });
        do {
            tt = t.get();
            if (tt === LEFT_BRACKET || tt === LEFT_CURLY) {
                t.unget();
                var dexp = DestructuringExpression(t, x, true);
                n2 = new Node(t, { type: IDENTIFIER,
                                   name: dexp,
                                   readOnly: n.type === CONST });
                n.push(n2);
                pushDestructuringVarDecls(n2.name.destructuredNames, s);
                n.destructurings.push({ exp: dexp, decl: n2 });
                if (x.inForLoopInit && t.peek() === IN) {
                    continue;
                }
                t.mustMatch(ASSIGN);
                if (t.token.assignOp)
                    throw t.newSyntaxError("Invalid variable initialization");
                n2.initializer = AssignExpression(t, x);
                continue;
            }
            if (tt !== IDENTIFIER)
                throw t.newSyntaxError("missing variable name");
            n2 = new Node(t, { type: IDENTIFIER,
                               name: t.token.value,
                               readOnly: n.type === CONST });
            n.push(n2);
            s.varDecls.push(n2);
            if (t.match(ASSIGN)) {
                if (t.token.assignOp)
                    throw t.newSyntaxError("Invalid variable initialization");
                n2.initializer = AssignExpression(t, x);
            }
        } while (t.match(COMMA));
        n.end = t.token.end;
        return n;
    }
    function LetBlock(t, x, isStatement) {
        var n, n2;
        n = new Node(t, { type: LET_BLOCK, varDecls: [] });
        t.mustMatch(LEFT_PAREN);
        n.variables = Variables(t, x, n);
        t.mustMatch(RIGHT_PAREN);
        if (isStatement && t.peek() !== LEFT_CURLY) {
            n2 = new Node(t, { type: SEMICOLON,
                               expression: n });
            isStatement = false;
        }
        if (isStatement)
            n.block = Block(t, x);
        else
            n.expression = AssignExpression(t, x);
        return n;
    }
    function checkDestructuring(t, x, n, simpleNamesOnly) {
        if (n.type === ARRAY_COMP)
            throw t.newSyntaxError("Invalid array comprehension left-hand side");
        if (n.type !== ARRAY_INIT && n.type !== OBJECT_INIT)
            return;
        var lhss = {};
        var nn, n2, idx, sub, cc, c = n.children;
        for (var i = 0, j = c.length; i < j; i++) {
            if (!(nn = c[i]))
                continue;
            if (nn.type === PROPERTY_INIT) {
                cc = nn.children;
                sub = cc[1];
                idx = cc[0].value;
            } else if (n.type === OBJECT_INIT) {
                sub = nn;
                idx = nn.value;
            } else {
                sub = nn;
                idx = i;
            }
            if (sub.type === ARRAY_INIT || sub.type === OBJECT_INIT) {
                lhss[idx] = checkDestructuring(t, x, sub, simpleNamesOnly);
            } else {
                if (simpleNamesOnly && sub.type !== IDENTIFIER) {
                    throw t.newSyntaxError("missing name in pattern");
                }
                lhss[idx] = sub;
            }
        }
        return lhss;
    }
    function DestructuringExpression(t, x, simpleNamesOnly) {
        var n = PrimaryExpression(t, x);
        n.destructuredNames = checkDestructuring(t, x, n, simpleNamesOnly);
        return n;
    }
    function GeneratorExpression(t, x, e) {
        return new Node(t, { type: GENERATOR,
                             expression: e,
                             tail: ComprehensionTail(t, x) });
    }
    function ComprehensionTail(t, x) {
        var body, n, n2, n3, p;
        body = new Node(t, { type: COMP_TAIL });
        do {
            n = new Node(t, { type: FOR_IN, isLoop: true });
            if (t.match(IDENTIFIER)) {
                if (t.token.value === "each")
                    n.isEach = true;
                else
                    t.unget();
            }
            p = MaybeLeftParen(t, x);
            switch(t.get()) {
              case LEFT_BRACKET:
              case LEFT_CURLY:
                t.unget();
                n.iterator = DestructuringExpression(t, x);
                break;
              case IDENTIFIER:
                n.iterator = n3 = new Node(t, { type: IDENTIFIER });
                n3.name = n3.value;
                n.varDecl = n2 = new Node(t, { type: VAR });
                n2.push(n3);
                x.parentScript.varDecls.push(n3);
                break;
              default:
                throw t.newSyntaxError("missing identifier");
            }
            t.mustMatch(IN);
            n.object = Expression(t, x);
            MaybeRightParen(t, p);
            body.push(n);
        } while (t.match(FOR));
        if (t.match(IF))
            body.guard = HeadExpression(t, x);
        return body;
    }
    function HeadExpression(t, x) {
        var p = MaybeLeftParen(t, x);
        var n = ParenExpression(t, x);
        MaybeRightParen(t, p);
        if (p === END && !n.parenthesized) {
            var tt = t.peek();
            if (tt !== LEFT_CURLY && !definitions.isStatementStartCode[tt])
                throw t.newSyntaxError("Unparenthesized head followed by unbraced body");
        }
        return n;
    }
    function ParenExpression(t, x) {
        var n = Expression(t, x.update({ inForLoopInit: x.inForLoopInit &&
                                                        (t.token.type === LEFT_PAREN) }));
        if (t.match(FOR)) {
            if (n.type === YIELD && !n.parenthesized)
                throw t.newSyntaxError("Yield expression must be parenthesized");
            if (n.type === COMMA && !n.parenthesized)
                throw t.newSyntaxError("Generator expression must be parenthesized");
            n = GeneratorExpression(t, x, n);
        }
        return n;
    }
    function Expression(t, x) {
        var n, n2;
        n = AssignExpression(t, x);
        if (t.match(COMMA)) {
            n2 = new Node(t, { type: COMMA });
            n2.push(n);
            n = n2;
            do {
                n2 = n.children[n.children.length-1];
                if (n2.type === YIELD && !n2.parenthesized)
                    throw t.newSyntaxError("Yield expression must be parenthesized");
                n.push(AssignExpression(t, x));
            } while (t.match(COMMA));
        }
        return n;
    }
    function AssignExpression(t, x) {
        var n, lhs;
        if (t.match(YIELD, true))
            return ReturnOrYield(t, x);
        n = new Node(t, { type: ASSIGN });
        lhs = ConditionalExpression(t, x);
        if (!t.match(ASSIGN)) {
            return lhs;
        }
        switch (lhs.type) {
          case OBJECT_INIT:
          case ARRAY_INIT:
            lhs.destructuredNames = checkDestructuring(t, x, lhs);
          case IDENTIFIER: case DOT: case INDEX: case CALL:
            break;
          default:
            throw t.newSyntaxError("Bad left-hand side of assignment");
            break;
        }
        n.assignOp = t.token.assignOp;
        n.push(lhs);
        n.push(AssignExpression(t, x));
        return n;
    }
    function ConditionalExpression(t, x) {
        var n, n2;
        n = OrExpression(t, x);
        if (t.match(HOOK)) {
            n2 = n;
            n = new Node(t, { type: HOOK });
            n.push(n2);
            n.push(AssignExpression(t, x.update({ inForLoopInit: false })));
            if (!t.match(COLON))
                throw t.newSyntaxError("missing : after ?");
            n.push(AssignExpression(t, x));
        }
        return n;
    }
    function OrExpression(t, x) {
        var n, n2;
        n = AndExpression(t, x);
        while (t.match(OR)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(AndExpression(t, x));
            n = n2;
        }
        return n;
    }
    function AndExpression(t, x) {
        var n, n2;
        n = BitwiseOrExpression(t, x);
        while (t.match(AND)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(BitwiseOrExpression(t, x));
            n = n2;
        }
        return n;
    }
    function BitwiseOrExpression(t, x) {
        var n, n2;
        n = BitwiseXorExpression(t, x);
        while (t.match(BITWISE_OR)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(BitwiseXorExpression(t, x));
            n = n2;
        }
        return n;
    }
    function BitwiseXorExpression(t, x) {
        var n, n2;
        n = BitwiseAndExpression(t, x);
        while (t.match(BITWISE_XOR)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(BitwiseAndExpression(t, x));
            n = n2;
        }
        return n;
    }
    function BitwiseAndExpression(t, x) {
        var n, n2;
        n = EqualityExpression(t, x);
        while (t.match(BITWISE_AND)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(EqualityExpression(t, x));
            n = n2;
        }
        return n;
    }
    function EqualityExpression(t, x) {
        var n, n2;
        n = RelationalExpression(t, x);
        while (t.match(EQ) || t.match(NE) ||
               t.match(STRICT_EQ) || t.match(STRICT_NE)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(RelationalExpression(t, x));
            n = n2;
        }
        return n;
    }
    function RelationalExpression(t, x) {
        var n, n2;
        var x2 = x.update({ inForLoopInit: false });
        n = ShiftExpression(t, x2);
        while ((t.match(LT) || t.match(LE) || t.match(GE) || t.match(GT) ||
               (!x.inForLoopInit && t.match(IN)) ||
               t.match(INSTANCEOF))) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(ShiftExpression(t, x2));
            n = n2;
        }
        return n;
    }
    function ShiftExpression(t, x) {
        var n, n2;
        n = AddExpression(t, x);
        while (t.match(LSH) || t.match(RSH) || t.match(URSH)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(AddExpression(t, x));
            n = n2;
        }
        return n;
    }
    function AddExpression(t, x) {
        var n, n2;
        n = MultiplyExpression(t, x);
        while (t.match(PLUS) || t.match(MINUS)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(MultiplyExpression(t, x));
            n = n2;
        }
        return n;
    }
    function MultiplyExpression(t, x) {
        var n, n2;
        n = UnaryExpression(t, x);
        while (t.match(MUL) || t.match(DIV) || t.match(MOD)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(UnaryExpression(t, x));
            n = n2;
        }
        return n;
    }
    function UnaryExpression(t, x) {
        var n, n2, tt;
        switch (tt = t.get(true)) {
          case DELETE: case VOID: case TYPEOF:
          case NOT: case BITWISE_NOT: case PLUS: case MINUS:
            if (tt === PLUS)
                n = new Node(t, { type: UNARY_PLUS });
            else if (tt === MINUS)
                n = new Node(t, { type: UNARY_MINUS });
            else
                n = new Node(t);
            n.push(UnaryExpression(t, x));
            break;
          case INCREMENT:
          case DECREMENT:
            n = new Node(t);
            n.push(MemberExpression(t, x, true));
            break;
          default:
            t.unget();
            n = MemberExpression(t, x, true);
            if (t.tokens[(t.tokenIndex + t.lookahead - 1) & 3].lineno ===
                t.lineno) {
                if (t.match(INCREMENT) || t.match(DECREMENT)) {
                    n2 = new Node(t, { postfix: true });
                    n2.push(n);
                    n = n2;
                }
            }
            break;
        }
        return n;
    }
    function MemberExpression(t, x, allowCallSyntax) {
        var n, n2, name, tt;
        if (t.match(NEW)) {
            n = new Node(t);
            n.push(MemberExpression(t, x, false));
            if (t.match(LEFT_PAREN)) {
                n.type = NEW_WITH_ARGS;
                n.push(ArgumentList(t, x));
            }
        } else {
            n = PrimaryExpression(t, x);
        }
        while ((tt = t.get()) !== END) {
            switch (tt) {
              case DOT:
                n2 = new Node(t);
                n2.push(n);
                t.forceIdentifier();
                n2.push(new Node(t));
                break;
              case LEFT_BRACKET:
                n2 = new Node(t, { type: INDEX });
                n2.push(n);
                n2.push(Expression(t, x));
                t.mustMatch(RIGHT_BRACKET);
                n2.end = t.token.end;
                break;
              case LEFT_PAREN:
                if (allowCallSyntax) {
                    n2 = new Node(t, { type: CALL });
                    n2.push(n);
                    n2.push(ArgumentList(t, x));
                    break;
                }
              default:
                t.unget();
                return n;
            }
            n = n2;
        }
        return n;
    }
    function ArgumentList(t, x) {
        var n, n2;
        n = new Node(t, { type: LIST });
        if (t.match(RIGHT_PAREN, true)) {
            n.end = t.token.end;
            return n;
        }
        do {
            n2 = AssignExpression(t, x);
            if (n2.type === YIELD && !n2.parenthesized && t.peek() === COMMA)
                throw t.newSyntaxError("Yield expression must be parenthesized");
            if (t.match(FOR)) {
                n2 = GeneratorExpression(t, x, n2);
                if (n.children.length > 1 || t.peek(true) === COMMA)
                    throw t.newSyntaxError("Generator expression must be parenthesized");
            }
            n.push(n2);
        } while (t.match(COMMA));
        t.mustMatch(RIGHT_PAREN);
        n.end = t.token.end;
        return n;
    }
    function PrimaryExpression(t, x) {
        var n, n2, tt = t.get(true);
        switch (tt) {
          case FUNCTION:
            n = FunctionDefinition(t, x, false, EXPRESSED_FORM);
            break;
          case LEFT_BRACKET:
            n = new Node(t, { type: ARRAY_INIT });
            while ((tt = t.peek(true)) !== RIGHT_BRACKET) {
                if (tt === COMMA) {
                    t.get();
                    n.push(null);
                    continue;
                }
                n.push(AssignExpression(t, x));
                if (tt !== COMMA && !t.match(COMMA))
                    break;
            }
            if (n.children.length === 1 && t.match(FOR)) {
                n2 = new Node(t, { type: ARRAY_COMP,
                                   expression: n.children[0],
                                   tail: ComprehensionTail(t, x) });
                n = n2;
            }
            t.mustMatch(RIGHT_BRACKET);
            n.end = t.token.end;
            break;
          case LEFT_CURLY:
            var id, fd;
            n = new Node(t, { type: OBJECT_INIT });
          object_init:
            if (!t.match(RIGHT_CURLY)) {
                do {
                    tt = t.get();
                    if ((t.token.value === "get" || t.token.value === "set") &&
                        t.peek() === IDENTIFIER) {
                        if (x.ecma3OnlyMode)
                            throw t.newSyntaxError("Illegal property accessor");
                        n.push(FunctionDefinition(t, x, true, EXPRESSED_FORM));
                    } else {
                        switch (tt) {
                          case IDENTIFIER: case NUMBER: case STRING:
                            id = new Node(t, { type: IDENTIFIER });
                            break;
                          case RIGHT_CURLY:
                            if (x.ecma3OnlyMode)
                                throw t.newSyntaxError("Illegal trailing ,");
                            break object_init;
                          default:
                            if (t.token.value in definitions.keywords) {
                                id = new Node(t, { type: IDENTIFIER });
                                break;
                            }
                            throw t.newSyntaxError("Invalid property name");
                        }
                        if (t.match(COLON)) {
                            n2 = new Node(t, { type: PROPERTY_INIT });
                            n2.push(id);
                            n2.push(AssignExpression(t, x));
                            n.push(n2);
                        } else {
                            if (t.peek() !== COMMA && t.peek() !== RIGHT_CURLY)
                                throw t.newSyntaxError("missing : after property");
                            n.push(id);
                        }
                    }
                } while (t.match(COMMA));
                t.mustMatch(RIGHT_CURLY);
            }
            n.end = t.token.end;
            break;
          case LEFT_PAREN:
            var start = t.token.start;
            n = ParenExpression(t, x);
            t.mustMatch(RIGHT_PAREN);
            n.start = start;
            n.end = t.token.end;
            n.parenthesized = true;
            break;
          case LET:
            n = LetBlock(t, x, false);
            break;
          case NULL: case THIS: case TRUE: case FALSE:
          case IDENTIFIER: case NUMBER: case STRING: case REGEXP:
            n = new Node(t);
            break;
          default:
            throw t.newSyntaxError("missing operand");
            break;
        }
        return n;
    }
    function parse(s, f, l) {
        var t = new lexer.Tokenizer(s, f, l);
        var n = Script(t, false);
        if (!t.done)
            throw t.newSyntaxError("Syntax error");
        return n;
    }
    function parseStdin(s, ln) {
        for (;;) {
            try {
                var t = new lexer.Tokenizer(s, "stdin", ln.value);
                var n = Script(t, false);
                ln.value = t.lineno;
                return n;
            } catch (e) {
                if (!t.unexpectedEOF)
                    throw e;
                var more = readline();
                if (!more)
                    throw e;
                s += "\n" + more;
            }
        }
    }
    return {
        parse: parse,
        parseStdin: parseStdin,
        Node: Node,
        DECLARED_FORM: DECLARED_FORM,
        EXPRESSED_FORM: EXPRESSED_FORM,
        STATEMENT_FORM: STATEMENT_FORM,
        Tokenizer: lexer.Tokenizer,
        FunctionDefinition: FunctionDefinition
    };
}());
Narcissus.decompiler = (function() {
    const parser = Narcissus.parser;
    const definitions = Narcissus.definitions;
    const tokens = definitions.tokens;
    eval(definitions.consts);
    function indent(n, s) {
        var ss = "", d = true;
        for (var i = 0, j = s.length; i < j; i++) {
            if (d)
                for (var k = 0; k < n; k++)
                    ss += " ";
            ss += s[i];
            d = s[i] === '\n';
        }
        return ss;
    }
    function isBlock(n) {
        return n && (n.type === BLOCK);
    }
    function isNonEmptyBlock(n) {
        return isBlock(n) && n.children.length > 0;
    }
    function nodeStr(n) {
        return '"' +
               n.value.replace(/\\/g, "\\\\")
                      .replace(/"/g, "\\\"")
                      .replace(/\n/g, "\\n")
                      .replace(/\r/g, "\\r") +
               '"';
    }
    function pp(n, d, inLetHead) {
        var topScript = false;
        if (!n)
            return "";
        if (!(n instanceof Object))
            return n;
        if (!d) {
            topScript = true;
            d = 1;
        }
        var p = "";
        if (n.parenthesized)
            p += "(";
        switch (n.type) {
          case FUNCTION:
          case GETTER:
          case SETTER:
            if (n.type === FUNCTION)
                p += "function";
            else if (n.type === GETTER)
                p += "get";
            else
                p += "set";
            p += (n.name ? " " + n.name : "") + "(";
            for (var i = 0, j = n.params.length; i < j; i++)
                p += (i > 0 ? ", " : "") + pp(n.params[i], d);
            p += ") " + pp(n.body, d);
            break;
          case SCRIPT:
          case BLOCK:
            var nc = n.children;
            if (topScript) {
                for (var i = 0, j = nc.length; i < j; i++) {
                    if (i > 0)
                        p += "\n";
                    p += pp(nc[i], d);
                    var eoc = p[p.length - 1];
                    if (eoc != ";")
                        p += ";";
                }
                break;
            }
            p += "{";
            if (n.id !== undefined)
                p += " /* " + n.id + " */";
            p += "\n";
            for (var i = 0, j = nc.length; i < j; i++) {
                if (i > 0)
                    p += "\n";
                p += indent(4, pp(nc[i], d));
                var eoc = p[p.length - 1];
                if (eoc != ";")
                    p += ";";
            }
            p += "\n}";
            break;
          case LET_BLOCK:
            p += "let (" + pp(n.variables, d, true) + ") ";
            if (n.expression)
                p += pp(n.expression, d);
            else
                p += pp(n.block, d);
            break;
          case IF:
            p += "if (" + pp(n.condition, d) + ") ";
            var tp = n.thenPart, ep = n.elsePart;
            var b = isBlock(tp) || isBlock(ep);
            if (!b)
                p += "{\n";
            p += (b ? pp(tp, d) : indent(4, pp(tp, d))) + "\n";
            if (ep) {
                if (!b)
                    p += "} else {\n";
                else
                    p += " else ";
                p += (b ? pp(ep, d) : indent(4, pp(ep, d))) + "\n";
            }
            if (!b)
                p += "}";
            break;
          case SWITCH:
            p += "switch (" + pp(n.discriminant, d) + ") {\n";
            for (var i = 0, j = n.cases.length; i < j; i++) {
                var ca = n.cases[i];
                if (ca.type === CASE)
                    p += "  case " + pp(ca.caseLabel, d) + ":\n";
                else
                    p += "  default:\n";
                ps = pp(ca.statements, d);
                p += ps.slice(2, ps.length - 2) + "\n";
            }
            p += "}";
            break;
          case FOR:
            p += "for (" + pp(n.setup, d) + "; "
                         + pp(n.condition, d) + "; "
                         + pp(n.update, d) + ") ";
            var pb = pp(n.body, d);
            if (!isBlock(n.body))
                p += "{\n" + indent(4, pb) + ";\n}";
            else if (n.body)
                p += pb;
            break;
          case WHILE:
            p += "while (" + pp(n.condition, d) + ") ";
            var pb = pp(n.body, d);
            if (!isBlock(n.body))
                p += "{\n" + indent(4, pb) + ";\n}";
            else
                p += pb;
            break;
          case FOR_IN:
            var u = n.varDecl;
            p += n.isEach ? "for each (" : "for (";
            p += (u ? pp(u, d) : pp(n.iterator, d)) + " in " +
                 pp(n.object, d) + ") ";
            var pb = pp(n.body, d);
            if (!isBlock(n.body))
                p += "{\n" + indent(4, pb) + ";\n}";
            else if (n.body)
                p += pb;
            break;
          case DO:
            p += "do " + pp(n.body, d);
            p += " while (" + pp(n.condition, d) + ");";
            break;
          case BREAK:
            p += "break" + (n.label ? " " + n.label : "") + ";";
            break;
          case CONTINUE:
            p += "continue" + (n.label ? " " + n.label : "") + ";";
            break;
          case TRY:
            p += "try ";
            p += pp(n.tryBlock, d);
            for (var i = 0, j = n.catchClauses.length; i < j; i++) {
                var t = n.catchClauses[i];
                p += " catch (" + pp(t.varName, d) +
                                (t.guard ? " if " + pp(t.guard, d) : "") +
                                ") ";
                p += pp(t.block, d);
            }
            if (n.finallyBlock) {
                p += " finally ";
                p += pp(n.finallyBlock, d);
            }
            break;
          case THROW:
            p += "throw " + pp(n.exception, d);
            break;
          case RETURN:
            p += "return";
            if (n.value)
              p += " " + pp(n.value, d);
            break;
          case YIELD:
            p += "yield";
            if (n.value.type)
              p += " " + pp(n.value, d);
            break;
          case GENERATOR:
            p += pp(n.expression, d) + " " + pp(n.tail, d);
            break;
          case WITH:
            p += "with (" + pp(n.object, d) + ") ";
            p += pp(n.body, d);
            break;
          case LET:
          case VAR:
          case CONST:
            var nc = n.children;
            if (!inLetHead) {
                p += tokens[n.type] + " ";
            }
            for (var i = 0, j = nc.length; i < j; i++) {
                if (i > 0)
                    p += ", ";
                var u = nc[i];
                p += pp(u.name, d);
                if (u.initializer)
                    p += " = " + pp(u.initializer, d);
            }
            break;
          case DEBUGGER:
            p += "debugger\n";
            break;
          case SEMICOLON:
            if (n.expression) {
                p += pp(n.expression, d) + ";";
            }
            break;
          case LABEL:
            p += n.label + ":\n" + pp(n.statement, d);
            break;
          case COMMA:
          case LIST:
            var nc = n.children;
            for (var i = 0, j = nc.length; i < j; i++) {
                if (i > 0)
                    p += ", ";
                p += pp(nc[i], d);
            }
            break;
          case ASSIGN:
            var nc = n.children;
            var t = n.assignOp;
            p += pp(nc[0], d) + " " + (t ? tokens[t] : "") + "="
                              + " " + pp(nc[1], d);
            break;
          case HOOK:
            var nc = n.children;
            p += "(" + pp(nc[0], d) + " ? "
                     + pp(nc[1], d) + " : "
                     + pp(nc[2], d);
            p += ")";
            break;
          case OR:
          case AND:
            var nc = n.children;
            p += "(" + pp(nc[0], d) + " " + tokens[n.type] + " "
                     + pp(nc[1], d);
            p += ")";
            break;
          case BITWISE_OR:
          case BITWISE_XOR:
          case BITWISE_AND:
          case EQ:
          case NE:
          case STRICT_EQ:
          case STRICT_NE:
          case LT:
          case LE:
          case GE:
          case GT:
          case IN:
          case INSTANCEOF:
          case LSH:
          case RSH:
          case URSH:
          case PLUS:
          case MINUS:
          case MUL:
          case DIV:
          case MOD:
            var nc = n.children;
            p += "(" + pp(nc[0], d) + " " + tokens[n.type] + " "
                     + pp(nc[1], d) + ")";
            break;
          case DELETE:
          case VOID:
          case TYPEOF:
            p += tokens[n.type] + " " + pp(n.children[0], d);
            break;
          case NOT:
          case BITWISE_NOT:
            p += tokens[n.type] + pp(n.children[0], d);
            break;
          case UNARY_PLUS:
            p += "+" + pp(n.children[0], d);
            break;
          case UNARY_MINUS:
            p += "-" + pp(n.children[0], d);
            break;
          case INCREMENT:
          case DECREMENT:
            if (n.postfix) {
                p += pp(n.children[0], d) + tokens[n.type];
            } else {
                p += tokens[n.type] + pp(n.children[0], d);
            }
            break;
          case DOT:
            var nc = n.children;
            p += pp(nc[0], d) + "." + pp(nc[1], d);
            break;
          case INDEX:
            var nc = n.children;
            p += pp(nc[0], d) + "[" + pp(nc[1], d) + "]";
            break;
          case CALL:
            var nc = n.children;
            p += pp(nc[0], d) + "(" + pp(nc[1], d) + ")";
            break;
          case NEW:
          case NEW_WITH_ARGS:
            var nc = n.children;
            p += "new " + pp(nc[0], d);
            if (nc[1])
                p += "(" + pp(nc[1], d) + ")";
            break;
          case ARRAY_INIT:
            p += "[";
            var nc = n.children;
            for (var i = 0, j = nc.length; i < j; i++) {
                if(nc[i])
                    p += pp(nc[i], d);
                p += ","
            }
            p += "]";
            break;
          case ARRAY_COMP:
            p += "[" + pp (n.expression, d) + " ";
            p += pp(n.tail, d);
            p += "]";
            break;
          case COMP_TAIL:
            var nc = n.children;
            for (var i = 0, j = nc.length; i < j; i++) {
                if (i > 0)
                    p += " ";
                p += pp(nc[i], d);
            }
            if (n.guard)
                p += " if (" + pp(n.guard, d) + ")";
            break;
          case OBJECT_INIT:
            var nc = n.children;
            if (nc[0] && nc[0].type === PROPERTY_INIT)
                p += "{\n";
            else
                p += "{";
            for (var i = 0, j = nc.length; i < j; i++) {
                if (i > 0) {
                    p += ",\n";
                }
                var t = nc[i];
                if (t.type === PROPERTY_INIT) {
                    var tc = t.children;
                    var l;
                    if (typeof tc[0].value === "string" && !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(tc[0].value)) {
                        l = nodeStr(tc[0]);
                    } else {
                        l = pp(tc[0], d);
                    }
                    p += indent(4, l) + ": " +
                         indent(4, pp(tc[1], d)).substring(4);
                } else {
                    p += indent(4, pp(t, d));
                }
            }
            p += "\n}";
            break;
          case NULL:
            p += "null";
            break;
          case THIS:
            p += "this";
            break;
          case TRUE:
            p += "true";
            break;
          case FALSE:
            p += "false";
            break;
          case IDENTIFIER:
          case NUMBER:
          case REGEXP:
            p += n.value;
            break;
          case STRING:
            p += nodeStr(n);
            break;
          case GROUP:
            p += "(" + pp(n.children[0], d) + ")";
            break;
          default:
            throw "PANIC: unknown operation " + tokens[n.type] + " " + n.toSource();
        }
        if (n.parenthesized)
            p += ")";
        return p;
    }
    return {
        pp: pp
    };
}());
if (typeof exports !== 'undefined') {
 var Narcissus = require('../../deps/narcissus');
}
(function(exports){
 eval(Narcissus.definitions.consts);
 var tokens = Narcissus.definitions.tokens;
 exports.format = function(node, linesOpt) {
  var result = '';
  var ppOut = _pp(node);
  if (linesOpt == "ignore")
   return ppOut.source;
  var lineMap = ppOut.lineMap;
  var lines = ppOut.source.split("\n");
  if (linesOpt == "preserve") {
   var outputLineNo = 1, bol = true;
   for (var i = 0; i < lines.length; i++) {
    var sourceNodes = (lineMap[i] || []).filter(function(n) { return n._isSourceNode });
    if (sourceNodes.length > 0) {
     var sourceLineNo = sourceNodes[0].lineno;
     while (outputLineNo < sourceLineNo) {
      result += "\n";
      outputLineNo += 1;
      bol = true;
     }
    }
    result += bol ? lines[i] : lines[i].replace(/^\s+/, ' ');
    bol = false;
   }
  }
  else if (linesOpt == "mark"){
   for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var sourceNodes = (lineMap[i] || []).filter(function(n) { return n._isSourceNode });
    var linePrefix = '            ';
    if (sourceNodes.length > 0) {
     var sourceLineNo = '' + sourceNodes[0].lineno;
     linePrefix = '/* ';
     for (var j = sourceLineNo.length; j < 5; j++) linePrefix += ' ';
     linePrefix += sourceLineNo + ' */ ';
    }
    result += linePrefix + line + "\n";
   }
  }
  else
   throw new Error("bad --lines option: " + linesOpt)
  return result;
 }
 function _pp(node) {
  var curLineNo = 0;
  var lineNodeMap = {};
  var src = pp(node);
  return {
   source: src,
   lineMap: lineNodeMap
  };
  function countNewline(s) {
   curLineNo += 1;
   return s;
  }
  function indent(n, s) {
   var ss = "", d = true;
   for (var i = 0, j = s.length; i < j; i++) {
    if (d)
     for (var k = 0; k < n; k++)
      ss += " ";
    ss += s[i];
    d = s[i] === '\n';
   }
   return ss;
  }
  function isBlock(n) {
   return n && (n.type === BLOCK);
  }
  function isNonEmptyBlock(n) {
   return isBlock(n) && n.children.length > 0;
  }
  function nodeStr(n) {
   return '"' +
    n.value.replace(/\\/g, "\\\\")
           .replace(/"/g, "\\\"")
           .replace(/\n/g, "\\n")
           .replace(/\r/g, "\\r") +
           '"';
  }
  function pp(n, d, inLetHead) {
   var topScript = false;
   if (!n)
    return "";
   if (!(n instanceof Object))
    return n;
   if (!d) {
    topScript = true;
    d = 1;
   }
   if (!lineNodeMap[curLineNo])
    lineNodeMap[curLineNo] = [];
   lineNodeMap[curLineNo].push(n);
   var p = "";
   if (n.parenthesized)
    p += "(";
   switch (n.type) {
   case FUNCTION:
   case GETTER:
   case SETTER:
    if (n.type === FUNCTION)
     p += "function";
    else if (n.type === GETTER)
     p += "get";
    else
     p += "set";
    p += (n.name ? " " + n.name : "") + "(";
    for (var i = 0, j = n.params.length; i < j; i++)
     p += (i > 0 ? ", " : "") + pp(n.params[i], d);
    p += ") " + pp(n.body, d);
    break;
   case SCRIPT:
   case BLOCK:
    var nc = n.children;
    if (topScript) {
     for (var i = 0, j = nc.length; i < j; i++) {
      if (i > 0)
       p += countNewline("\n");
      p += pp(nc[i], d);
      var eoc = p[p.length - 1];
      if (eoc != ";")
       p += ";";
     }
     break;
    }
    p += "{";
    if (n.id !== undefined)
     p += " /* " + n.id + " */";
    p += countNewline("\n");
    for (var i = 0, j = nc.length; i < j; i++) {
     if (i > 0)
      p += countNewline("\n");
     p += indent(2, pp(nc[i], d));
     var eoc = p[p.length - 1];
     if (eoc != ";")
      p += ";";
    }
    p += countNewline("\n}");
    break;
   case LET_BLOCK:
    p += "let (" + pp(n.variables, d, true) + ") ";
    if (n.expression)
     p += pp(n.expression, d);
    else
     p += pp(n.block, d);
    break;
   case IF:
    p += "if (" + pp(n.condition, d) + ") ";
    var tp = n.thenPart, ep = n.elsePart;
    var b = isBlock(tp) || isBlock(ep);
    if (!b)
     p += countNewline("{\n");
    p += (b ? pp(tp, d) : indent(2, pp(tp, d)))
    if (ep && ";}".indexOf(p[p.length - 1]) < 0)
     p += ";";
    p += countNewline("\n");
    if (ep) {
     if (!b)
      p += countNewline("} else {\n");
     else
      p += " else ";
     p += (b ? pp(ep, d) : indent(2, pp(ep, d))) + countNewline("\n");
    }
    if (!b)
     p += "}";
    break;
   case SWITCH:
    p += "switch (" + pp(n.discriminant, d) + countNewline(") {\n");
    for (var i = 0, j = n.cases.length; i < j; i++) {
     var ca = n.cases[i];
     if (ca.type === CASE)
      p += "case " + pp(ca.caseLabel, d) + countNewline(":\n");
     else
      p += countNewline("  default:\n");
     ps = pp(ca.statements, d);
     p += ps.slice(2, ps.length - 2) + countNewline("\n");
     curLineNo -= 2;
    }
    p += "}";
    break;
   case FOR:
    p += "for (" + pp(n.setup, d) + "; "
        + pp(n.condition, d) + "; "
        + pp(n.update, d) + ") ";
    var pb = pp(n.body, d);
    if (!isBlock(n.body))
     p += countNewline("{\n") + indent(2, pb) + countNewline(";\n}");
    else if (n.body)
     p += pb;
    break;
   case WHILE:
    p += "while (" + pp(n.condition, d) + ") ";
    var pb = pp(n.body, d);
    if (!isBlock(n.body))
     p += countNewline("{\n") + indent(2, pb) + countNewline(";\n}");
    else
     p += pb;
    break;
   case FOR_IN:
    var u = n.varDecl;
    p += n.isEach ? "for each (" : "for (";
    p += (u ? pp(u, d) : pp(n.iterator, d)) + " in " +
      pp(n.object, d) + ") ";
    var pb = pp(n.body, d);
    if (!isBlock(n.body))
     p += countNewline("{\n") + indent(2, pb) + countNewline(";\n}");
    else if (n.body)
     p += pb;
    break;
   case DO:
    p += "do " + pp(n.body, d);
    p += " while (" + pp(n.condition, d) + ");";
    break;
   case BREAK:
    p += "break" + (n.label ? " " + n.label : "") + ";";
    break;
   case CONTINUE:
    p += "continue" + (n.label ? " " + n.label : "") + ";";
    break;
   case TRY:
    p += "try ";
    p += pp(n.tryBlock, d);
    for (var i = 0, j = n.catchClauses.length; i < j; i++) {
     var t = n.catchClauses[i];
     p += " catch (" + pp(t.varName, d) +
         (t.guard ? " if " + pp(t.guard, d) : "") +
         ") ";
     p += pp(t.block, d);
    }
    if (n.finallyBlock) {
     p += " finally ";
     p += pp(n.finallyBlock, d);
    }
    break;
   case THROW:
    p += "throw " + pp(n.exception, d);
    break;
   case RETURN:
    p += "return";
    if (n.value)
     p += " " + pp(n.value, d);
    break;
   case YIELD:
    p += "yield";
    if (n.value.type)
     p += " " + pp(n.value, d);
    break;
   case GENERATOR:
    p += pp(n.expression, d) + " " + pp(n.tail, d);
    break;
   case WITH:
    p += "with (" + pp(n.object, d) + ") ";
    p += pp(n.body, d);
    break;
   case LET:
   case VAR:
   case CONST:
    var nc = n.children;
    if (!inLetHead) {
     p += tokens[n.type] + " ";
    }
    for (var i = 0, j = nc.length; i < j; i++) {
     if (i > 0)
      p += ", ";
     var u = nc[i];
     p += pp(u.name, d);
     if (u.initializer)
      p += " = " + pp(u.initializer, d);
    }
    break;
   case DEBUGGER:
    p += countNewline("debugger\n");
    break;
   case SEMICOLON:
    if (n.expression) {
     p += pp(n.expression, d) + ";";
    }
    break;
   case LABEL:
    p += n.label + countNewline(":\n") + pp(n.statement, d);
    break;
   case COMMA:
   case LIST:
    var nc = n.children;
    for (var i = 0, j = nc.length; i < j; i++) {
     if (i > 0)
      p += ", ";
     p += pp(nc[i], d);
    }
    break;
   case ASSIGN:
    var nc = n.children;
    var t = n.assignOp;
    p += pp(nc[0], d) + " " + (t ? tokens[t] : "") + "=" + " " + pp(nc[1], d);
    break;
   case HOOK:
    var nc = n.children;
    p += "(" + pp(nc[0], d) + " ? "
       + pp(nc[1], d) + " : "
       + pp(nc[2], d);
    p += ")";
    break;
   case OR:
   case AND:
    var nc = n.children;
    p += "(" + pp(nc[0], d) + " " + tokens[n.type] + " "
       + pp(nc[1], d);
    p += ")";
    break;
   case BITWISE_OR:
   case BITWISE_XOR:
   case BITWISE_AND:
   case EQ:
   case NE:
   case STRICT_EQ:
   case STRICT_NE:
   case LT:
   case LE:
   case GE:
   case GT:
   case IN:
   case INSTANCEOF:
   case LSH:
   case RSH:
   case URSH:
   case PLUS:
   case MINUS:
   case MUL:
   case DIV:
   case MOD:
    var nc = n.children;
    p += "(" + pp(nc[0], d) + " " + tokens[n.type] + " "
       + pp(nc[1], d) + ")";
    break;
   case DELETE:
   case VOID:
   case TYPEOF:
    p += tokens[n.type] + " " + pp(n.children[0], d);
    break;
   case NOT:
   case BITWISE_NOT:
    p += tokens[n.type] + pp(n.children[0], d);
    break;
   case UNARY_PLUS:
    p += "+" + pp(n.children[0], d);
    break;
   case UNARY_MINUS:
    p += "-" + pp(n.children[0], d);
    break;
   case INCREMENT:
   case DECREMENT:
    if (n.postfix) {
     p += pp(n.children[0], d) + tokens[n.type];
    } else {
     p += tokens[n.type] + pp(n.children[0], d);
    }
    break;
   case DOT:
    var nc = n.children;
    p += pp(nc[0], d) + "." + pp(nc[1], d);
    break;
   case INDEX:
    var nc = n.children;
    p += pp(nc[0], d) + "[" + pp(nc[1], d) + "]";
    break;
   case CALL:
    var nc = n.children;
    p += pp(nc[0], d) + "(" + pp(nc[1], d) + ")";
    break;
   case NEW:
   case NEW_WITH_ARGS:
    var nc = n.children;
    p += "new " + pp(nc[0], d);
    if (nc[1])
     p += "(" + pp(nc[1], d) + ")";
    break;
   case ARRAY_INIT:
    p += "[";
    var nc = n.children;
    for (var i = 0, j = nc.length; i < j; i++) {
     if(nc[i])
      p += pp(nc[i], d);
     p += ","
    }
    p += "]";
    break;
   case ARRAY_COMP:
    p += "[" + pp (n.expression, d) + " ";
    p += pp(n.tail, d);
    p += "]";
    break;
   case COMP_TAIL:
    var nc = n.children;
    for (var i = 0, j = nc.length; i < j; i++) {
     if (i > 0)
      p += " ";
     p += pp(nc[i], d);
    }
    if (n.guard)
     p += " if (" + pp(n.guard, d) + ")";
    break;
   case OBJECT_INIT:
    var nc = n.children;
    if (nc[0] && nc[0].type === PROPERTY_INIT)
     p += countNewline("{\n");
    else
     p += "{";
    for (var i = 0, j = nc.length; i < j; i++) {
     if (i > 0) {
      p += countNewline(",\n");
     }
     var t = nc[i];
     if (t.type === PROPERTY_INIT) {
      var tc = t.children;
      var l;
      if (typeof tc[0].value === "string" && !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(tc[0].value)) {
       l = nodeStr(tc[0]);
      } else {
       l = pp(tc[0], d);
      }
      p += indent(2, l) + ": " +
        indent(2, pp(tc[1], d)).substring(2);
     } else {
      p += indent(2, pp(t, d));
     }
    }
    p += countNewline("\n}");
    break;
   case NULL:
    p += "null";
    break;
   case THIS:
    p += "this";
    break;
   case TRUE:
    p += "true";
    break;
   case FALSE:
    p += "false";
    break;
   case IDENTIFIER:
   case NUMBER:
   case REGEXP:
    p += n.value;
    break;
   case STRING:
    p += nodeStr(n);
    break;
   case GROUP:
    p += "(" + pp(n.children[0], d) + ")";
    break;
   default:
    throw "PANIC: unknown operation " + tokens[n.type] + " " + n.toSource();
   }
   if (n.parenthesized)
    p += ")";
   return p;
  }
 }
})(typeof exports !== 'undefined' ? exports : (window.Streamline = window.Streamline || {}));
if (typeof exports !== 'undefined') {
 var Narcissus = require('../../deps/narcissus');
 var format = require('./format').format;
} else {
 var format = Streamline.format;
}(function(exports) {
 exports.version = "0.4.0 (callbacks)";
 var parse = Narcissus.parser.parse;
 var pp = Narcissus.decompiler.pp;
 var definitions = Narcissus.definitions;
 eval(definitions.consts.replace(/const /g, "var "));
 function _assert(cond) {
  if (!cond) throw new Error("Assertion failed!")
 }
 function _tag(node) {
  if (!node || !node.type) return "*NOT_A_NODE*";
  var t = definitions.tokens[node.type];
  return /^\W/.test(t) ? definitions.opTypeNames[t] : t.toUpperCase();
 }
 function _node(ref, type, children) {
  return {
   _scope: ref && ref._scope,
   _async: ref && ref._async,
   type: type,
   children: children
  };
 }
 function _identifier(name, initializer) {
  return {
   _scope: initializer && initializer._scope,
   type: IDENTIFIER,
   name: name,
   value: name,
   initializer: initializer
  };
 }
 function _number(val) {
  return {
   type: NUMBER,
   value: val
  };
 }
 function _string(val) {
  return {
   type: STRING,
   value: val
  };
 }
 function _return(node) {
  return {
   type: RETURN,
   _scope: node._scope,
   value: node
  };
 }
 function _semicolon(node) {
  var stmt = _node(node, SEMICOLON);
  stmt.expression = node;
  return stmt;
 }
 function _safeName(precious, name) {
  while (precious[name]) name += 'A';
  return name;
 }
 function _flatten(node) {
  if (node.type == BLOCK || node.type == SCRIPT) {
   do {
    var found = false;
    var children = [];
    node.children.forEach(function(child) {
     if (child._isFunctionReference || (child.type == SEMICOLON && (child.expression == null || child.expression._isFunction))) return;
     node._async |= child._async;
     if (child.type == BLOCK || child.type == SCRIPT) {
      children = children.concat(child.children);
      found = true;
     } else children.push(child);
    })
    node.children = children;
   }
   while (found);
  }
  return node;
 }
 function _propagate(node, fn, doAll, clone) {
  var result = clone ? clone : node;
  for (var prop in node) {
   if (node.hasOwnProperty(prop) && prop.indexOf("Decls") < 0 && (doAll || prop != 'target') && prop[0] != '_') {
    var child = node[prop];
    if (child != null) {
     if (Array.isArray(child)) {
      if (clone) result[prop] = (child = [].concat(child));
      var undef = false;
      for (var i = 0; i < child.length; i++) {
       if (doAll || (child[i] && child[i].type)) {
        child[i] = fn(child[i], node);
        undef |= typeof child[i] === "undefined"
       }
      }
      if (undef) {
       result[prop] = child.filter(function(elt) {
        return typeof elt !== "undefined";
       });
      }
     } else {
      if (doAll || (child && child.type)) result[prop] = fn(child, node);
     }
    }
   }
  }
  return result;
 }
 function _clone(node) {
  var lastId = 0;
  var clones = {};
  function cloneOne(child) {
   if (!child || !child.type) return child;
   var cloneId = child._cloneId;
   if (!cloneId) cloneId = (child._cloneId = ++lastId);
   var clone = clones[cloneId];
   if (clone) return clone;
   clones[cloneId] = (clone = {
    _cloneId: cloneId
   });
   return _propagate(child, cloneOne, true, clone);
  }
  return _propagate(node, cloneOne, true, {});
 }
 function Template(pass, str, isExpression, createScope) {
  var _root = parse("function _t(){" + str + "}").children[0].body;
  if (_root.children.length == 1) _root = _root.children[0];
  else _root = _node(_root.children[0], BLOCK, _root.children);
  this.generate = function(scopeNode, bindings) {
   var scope = scopeNode._scope;
   _assert(scope != null);
   bindings = bindings || {};
   var fn = null;
   function gen(node) {
    if (node.type != SCRIPT && node.type != BLOCK) node._pass = pass;
    if (node.type == FUNCTION && createScope) {
     _assert(fn == null);
     fn = node;
    }
    if (!node || !node.type) {
     if (node == "_") return scope.options.callback;
     if (typeof node === "string") {
      if (node[0] === "$") return bindings[node];
      return _safeName(scope.options.precious, node);
     }
     return node;
    }
    node._scope = scope;
    var ident = node.type == SEMICOLON ? node.expression : node;
    if (ident && ident.type == IDENTIFIER && ident.value[0] === "$") {
     var result = bindings[ident.value];
     if (ident.initializer) {
      result.initializer = gen(ident.initializer);
      if (result.initializer._async) result._async = true;
     }
     return result;
    } else {
     node = _propagate(node, function(child) {
      child = gen(child);
      if (child && (child._async || (child === scope.options.callback && createScope)) && node.type !== FUNCTION) node._async = true;
      return child;
     }, true);
     node = _flatten(node);
     return node;
    }
   }
   var result = gen(_clone(_root));
   if (fn) {
    fn.parenthesized = true;
    var scope = new Scope(fn.body, fn._scope.options);
    scope.name = fn._scope.name;
    scope.line = fn._scope.line;
    scope.last = fn._scope.last;
    _assert(fn.params[0] === fn._scope.options.callback);
    scope.cbIndex = 0;
    function _changeScope(node, parent) {
     if (node.type == FUNCTION) return node;
     node._scope = scope;
     return _propagate(node, _changeScope);
    }
    _propagate(fn, _changeScope);
   }
   return isExpression ? result.value : result;
  }
  this.root = isExpression ? _root.value : _root;
 }
 function Scope(script, options) {
  this.script = script;
  this.line = 0;
  this.last = 0;
  this.vars = [];
  this.functions = [];
  this.options = options;
  this.cbIndex = -1;
  this.isAsync = function() {
   return this.cbIndex >= 0;
  }
 }
 function _genId(node) {
  return _safeName(node._scope.options.precious, "__" + ++node._scope.last);
 }
 function _markSource(node, options) {
  function _markOne(node) {
   if (typeof node.value === 'string' && node.value.substring(0, 2) === '__') options.precious[node.value] = true;
   node.params && node.params.forEach(function(param) {
    if (param.substring(0, 2) === '__') options.precious[param] = true;
   });
   node._isSourceNode = true;
   _propagate(node, function(child) {
    _markOne(child);
    return child;
   });
  }
  _markOne(node);
 }
 function _isScriptAsync(script, options) {
  var async = false;
  function _doIt(node, parent) {
   switch (node.type) {
   case FUNCTION:
    return node;
   case IDENTIFIER:
    if (node.value == options.callback) {
     async = true;
    } else {
     _propagate(node, _doIt);
    }
    return node;
   case CALL:
    var fn = node.children[0],
     args = node.children[1],
     ident;
    if (fn.type === DOT && (ident = fn.children[1]).value === "call" && (fn = fn.children[0]).type === FUNCTION && fn.params.length === 0 && !fn.name && args.children.length === 1 && args.children[0].type === THIS) {
     _propagate(fn.body, _doIt);
     return node;
    }
   default:
    if (!async) {
     _propagate(node, _doIt);
    }
    return node;
   }
  }
  _propagate(script, _doIt);
  return async;
 }
 var _rootTemplate = new Template("root",
 "(function main(_){ $script }).call(this, __trap);");
 function _canonTopLevelScript(script, options) {
  script._scope = new Scope(script, options);
  if (_isScriptAsync(script, options)) return _rootTemplate.generate(script, {
   $script: script
  });
  else return script;
 }
 var _assignTemplate = new Template("canon", "$lhs = $rhs;");
 function _guessName(node, parent) {
  function _sanitize(name) {
   name = name.replace(/[^A-Z0-9_$]/ig, '_o_');
   return name && !/^\d/.test(name) ? name : '_o_' + name;
  }
  var id = _genId(node),
   n, nn;
  if (parent.type === IDENTIFIER) return _sanitize(parent.value) + id;
  if (parent.type === ASSIGN) {
   n = parent.children[0];
   var s = "";
   while ((n.type === DOT && (nn = n.children[1]).type === IDENTIFIER) || (n.type === INDEX && (nn = n.children[1]).type === STRING)) {
    s = s ? nn.value + "_" + s : nn.value;
    n = n.children[0];
   }
   if (n.type === IDENTIFIER) s = s ? n.value + "_" + s : n.value;
   if (s) return _sanitize(s) + id;
  } else if (parent.type == PROPERTY_INIT) {
   n = parent.children[0];
   if (n.type === IDENTIFIER || n.type === STRING) return _sanitize(n.value) + id;
  }
  return id;
 }
 function _canonScopes(node, options) {
  function _doIt(node, parent) {
   var scope = parent._scope;
   node._scope = scope;
   var async = scope.isAsync();
   if (!async && node.type !== FUNCTION) {
    if (node.type === IDENTIFIER && node.value === options.callback) throw new Error(node.filename + ": Function contains async calls but does not have _ parameter: " + node.name + " at line " + node.lineno);
    return _propagate(node, _doIt);
   }
   switch (node.type) {
   case FUNCTION:
    var result = node;
    var cbIndex = node.params.reduce(function(index, param, i) {
     if (param != options.callback) return index;
     if (index < 0) return i;
     else throw new Error("duplicate _ parameter");
    }, -1);
    if (cbIndex >= 0) {
     if (!node.name) node.name = _guessName(node, parent);
    }
    if (async && (parent.type === SCRIPT || parent.type === BLOCK)) {
     scope.functions.push(node);
     result = undefined;
    }
    var bodyScope = new Scope(node.body, options);
    node.body._scope = bodyScope;
    bodyScope.name = node.name;
    bodyScope.cbIndex = cbIndex;
    bodyScope.line = node.lineno;
    node.body = _propagate(node.body, _doIt);
    if (cbIndex >= 0) bodyScope.functions.push(_string("BEGIN_BODY"));
    node.body.children = bodyScope.functions.concat(node.body.children);
    if (bodyScope.hasThis && !node._inhibitThis) {
     bodyScope.vars.push(_identifier(_safeName(options.precious, "__this"), _node(node, THIS)));
    }
    if (bodyScope.hasArguments && !node._inhibitArguments) {
     bodyScope.vars.push(_identifier(_safeName(options.precious, "__arguments"), _identifier("arguments")));
    }
    if (bodyScope.vars.length > 0) {
     node.body.children.splice(0, 0, _node(node, VAR, bodyScope.vars));
    }
    return result;
   case VAR:
    var children = node.children.map(function(child) {
     if (!scope.vars.some(function(elt) {
      return elt.value == child.value;
     })) {
      scope.vars.push(_identifier(child.value));
     }
     if (!child.initializer) return null;
     child = _assignTemplate.generate(parent, {
      $lhs: _identifier(child.value),
      $rhs: child.initializer
     });
     if (parent.type === FOR) child = child.expression;
     return child;
    }).filter(function(child) {
     return child != null;
    });
    if (children.length == 0) {
     return;
    }
    var type = parent.type == BLOCK || parent.type === SCRIPT ? BLOCK : COMMA;
    var result = _node(parent, type, children);
    result = _propagate(result, _doIt);
    parent._async |= result._async;
    return result;
   case THIS:
    scope.hasThis = true;
    return _identifier(_safeName(options.precious, "__this"));
   case IDENTIFIER:
    if (node.value === "arguments") {
     scope.hasArguments = true;
     return _identifier(_safeName(options.precious, "__arguments"));
    }
    node = _propagate(node, _doIt);
    node._async |= node.value === options.callback;
    if (node._async && !parent.isArgsList &&
     !(parent.type === PROPERTY_INIT && node === parent.children[0]) &&
     !(parent.type === DOT && node === parent.children[1]))
     throw new Error("invalid usage of '_'")
    parent._async |= node._async;
    return node;
   case NEW_WITH_ARGS:
    var cbIndex = node.children[1].children.reduce(function(index, arg, i) {
     if (arg.type !== IDENTIFIER || arg.value !== options.callback) return index;
     if (index < 0) return i;
     else throw new Error("duplicate _ argument");
    }, -1);
    if (cbIndex >= 0) {
     var constr = _node(node, CALL, [_identifier(_safeName(options.precious, '__construct')), _node(node, LIST, [node.children[0], _number(cbIndex)])]);
     node = _node(node, CALL, [constr, node.children[1]]);
    }
    node.children[1].isArgsList = true;
    node = _propagate(node, _doIt);
    parent._async |= node._async;
    return node;
   case CALL:
    node.children[1].isArgsList = true;
    _convertCoffeeScriptCalls(node, options);
    _convertApply(node, options);
    node.children[1].isArgsList = true;
   default:
    node = _propagate(node, _doIt);
    _setBreaks(node);
    parent._async |= node._async;
    return node;
   }
  }
  return _propagate(node, _doIt);
 }
 function _convertCoffeeScriptCalls(node, options) {
  var fn = node.children[0];
  var args = node.children[1];
  if (fn.type === FUNCTION && fn.params.length === 0 && !fn.name && args.children.length == 0) {
   fn._noFuture = true;
   fn.params = [options.callback];
   args.children = [_identifier(options.callback)];
  } else if (fn.type === DOT) {
   var ident = fn.children[1];
   fn = fn.children[0];
   if (fn.type === FUNCTION && fn.params.length === 0 && !fn.name && ident.type === IDENTIFIER) {
    if (ident.value === "call" && args.children.length === 1 && args.children[0].type === THIS) {
     node.children[0] = fn;
     fn._noFuture = true;
     fn.params = [options.callback];
     args.children = [_identifier(options.callback)];
     node._scope.hasThis = true;
     fn._inhibitThis = true;
    } else if (ident.value === "apply" && args.children.length === 2 && args.children[0].type === THIS && args.children[1].type === IDENTIFIER && args.children[1].value === "arguments") {
     node.children[0] = fn;
     fn._noFuture = true;
     fn.params = [options.callback];
     args.children = [_identifier(options.callback)];
     node._scope.hasThis = true;
     node._scope.hasArguments = true;
     fn._inhibitThis = true;
     fn._inhibitArguments = true;
    }
   }
  }
 }
 function _convertApply(node, options) {
  var dot = node.children[0];
  var args = node.children[1];
  if (dot.type === DOT) {
   var ident = dot.children[1];
   if (ident.type === IDENTIFIER && ident.value === "apply" && args.children.length === 2 && args.children[0].type === THIS && args.children[1].type === IDENTIFIER && args.children[1].value === "arguments") {
    var f = dot.children[0];
    node.children[0] = _identifier('__apply');
    args.children = [_identifier(options.callback), f, _identifier('__this'), _identifier('__arguments'), _number(node._scope.cbIndex)];
    node._scope.hasThis = true;
    node._scope.hasArguments = true;
   }
  }
 }
 function _setBreaks(node) {
  switch (node.type) {
  case IF:
   node._breaks = node.thenPart._breaks && node.elsePart && node.elsePart._breaks;
   break;
  case SWITCH:
   for (var i = 0; i < node.cases.length; i++) {
    var stmts = node.cases[i].statements;
    if (node._async && stmts.children.length > 0 && !stmts._breaks) {
     if (i == node.cases.length - 2 && node.cases[i + 1].type === DEFAULT && node.cases[i + 1].statements.children.length === 1 && node.cases[i + 1].statements.children[0].type === SEMICOLON && node.cases[i + 1].statements.children[0].expression == null) {
      stmts.children.push(_node(node, BREAK));
      stmts._breaks = true;
     } else if (i === node.cases.length - 1) {
      stmts.children.push(_node(node, BREAK));
      stmts._breaks = true;
     } else {
      throw new Error(node.filename + ": unsupported construct: switch case with some path not terminated by break, return or throw");
     }
    }
   }
   break;
  case TRY:
   node._breaks = node.tryBlock._breaks && node.catchClauses[0] && node.catchClauses[0].block._breaks;
   break;
  case BLOCK:
  case SCRIPT:
   node.children.forEach(function(child) {
    node._breaks |= child._breaks;
   });
   break;
  case RETURN:
  case THROW:
  case BREAK:
   node._breaks = true;
   break;
  }
 }
 function _statementify(exp) {
  if (!exp) return exp;
  var block = _node(exp, BLOCK, []);
  function uncomma(node) {
   if (node.type === COMMA) {
    node.children.forEach(uncomma);
   } else {
    block.children.push(node.type == SEMICOLON ? node : _semicolon(node));
   }
  }
  uncomma(exp);
  return block;
 }
 function _blockify(node) {
  if (!node || node.type == BLOCK) return node;
  if (node.type == COMMA) return _statementify(node);
  var block = _node(node, BLOCK, [node]);
  block._async = node._async;
  return block;
 }
 var _flowsTemplates = {
  WHILE: new Template("flows", "{" +
  "	for (; $condition;) {" +
  "		$body;" +
  "	}" +
  "}"),
  DO: new Template("flows", "{" +
  "	var $firstTime = true;" +
  "	for (; $firstTime || $condition;) {" +
  "		$firstTime = false;" +
  "		$body;" +
  "	}" +
  "}"),
  FOR: new Template("flows", "{" +
  "	$setup;" +
  "	for (; $condition; $update) {" +
  "		$body;" +
  "	}" +
  "}"),
  FOR_IN: new Template("flows", "{" +
  "	var $array = __forIn($object);" +
  "	var $i = 0;" +
  "	for (; $i < $array.length;) {" +
  "		$iter = $array[$i++];" +
  "		$body;" +
  "	}" +
  "}"),
  TRY: new Template("flows", "" +
  "try {" +
  "	try { $try; }" +
  "	catch ($ex) { $catch; }" +
  "}" +
  "finally { $finally; }"),
  AND: new Template("flows", "" +
  "return (function $name(_){" +
  "	var $v = $op1;" +
  "	if (!$v) {" +
  "		return $v;" +
  "	}" +
  "	return $op2;" +
  "})(_)", true, true),
  OR: new Template("flows", "" +
  "return (function $name(_){" +
  "	var $v = $op1;" +
  "	if ($v) {" +
  "		return $v;" +
  "	}" +
  "	return $op2;" +
  "})(_)", true, true),
  HOOK: new Template("flows", "" +
  "return (function $name(_){" +
  "	var $v = $condition;" +
  "	if ($v) {" +
  "		return $true;" +
  "	}" +
  "	return $false;" +
  "})(_);", true, true),
  COMMA: new Template("flows", "" +
  "return (function $name(_){" +
  "	$body;" +
  "	return $result;" +
  "})(_);", true, true),
  CONDITION: new Template("flows", "" +
  "return (function $name(_){" +
  "	return $condition;" +
  "})(_);", true, true),
  UPDATE: new Template("flows", "" +
  "return (function $name(_){" +
  "	$update;" +
  "})(_);", true, true)
 };
 function _canonFlows(node, options) {
  function _doIt(node, parent) {
   var scope = node._scope;
   function _doAsyncFor(node) {
    if (node.condition && node.condition._async && node.condition.type !== CALL) node.condition = _flowsTemplates.CONDITION.generate(node, {
     $name: "__$" + node._scope.name,
     $condition: node.condition
    });
    if (node.update && node.update._async) node.update = _flowsTemplates.UPDATE.generate(node, {
     $name: "__$" + node._scope.name,
     $update: _statementify(node.update)
    });
   }
   if (node.type == FOR && node._pass === "flows") _doAsyncFor(node);
   if (!scope || !scope.isAsync() || node._pass === "flows") return _propagate(node, _doIt);
   switch (node.type) {
   case IF:
    node.thenPart = _blockify(node.thenPart);
    node.elsePart = _blockify(node.elsePart);
    break;
   case SWITCH:
    if (node._async) {
     var def = node.cases.filter(function(n) {
      return n.type == DEFAULT
     })[0];
     if (!def) {
      def = _node(node, DEFAULT);
      def.statements = _node(node, BLOCK, []);
      node.cases.push(def);
     }
     if (!def._breaks) {
      def.statements.children.push(_node(node, BREAK))
     }
    }
    break;
   case WHILE:
    node.body = _blockify(node.body);
    if (node._async) {
     node = _flowsTemplates.WHILE.generate(node, {
      $condition: node.condition,
      $body: node.body
     });
    }
    break;
   case DO:
    node.body = _blockify(node.body);
    if (node._async) {
     node = _flowsTemplates.DO.generate(node, {
      $firstTime: _identifier(_genId(node)),
      $condition: node.condition,
      $body: node.body
     });
    }
    break;
   case FOR:
    node.condition = node.condition || _number(1);
    node.body = _blockify(node.body);
    if (node._async) {
     if (node.setup) {
      node = _flowsTemplates.FOR.generate(node, {
       $setup: _statementify(node.setup),
       $condition: node.condition,
       $update: node.update,
       $body: node.body
      });
     } else {
      if (node._pass !== "flows") {
       node._pass = "flows";
       _doAsyncFor(node);
      }
     }
    }
    break;
   case FOR_IN:
    node.body = _blockify(node.body);
    if (node._async) {
     if (node.iterator.type != IDENTIFIER) {
      throw new Error("unsupported 'for ... in' syntax: type=" + _tag(node.iterator));
     }
     node = _flowsTemplates.FOR_IN.generate(node, {
      $array: _identifier(_genId(node)),
      $i: _identifier(_genId(node)),
      $object: node.object,
      $iter: node.iterator,
      $body: node.body
     });
    }
    break;
   case TRY:
    if (node.tryBlock && node.catchClauses[0] && node.finallyBlock) {
     node = _flowsTemplates.TRY.generate(node, {
      $try: node.tryBlock,
      $catch: node.catchClauses[0].block,
      $ex: node.catchClauses[0].varName,
      $finally: node.finallyBlock
     })
    }
    break;
   case AND:
   case OR:
    if (node._async) {
     node = _flowsTemplates[_tag(node)].generate(node, {
      $name: "__$" + node._scope.name,
      $v: _identifier(_genId(node)),
      $op1: node.children[0],
      $op2: node.children[1]
     });
    }
    break;
   case HOOK:
    if (node._async) {
     node = _flowsTemplates.HOOK.generate(node, {
      $name: "__$" + node._scope.name,
      $v: _identifier(_genId(node)),
      $condition: node.children[0],
      $true: node.children[1],
      $false: node.children[2]
     });
    }
    break;
   case COMMA:
    if (node._async) {
     node = _flowsTemplates.COMMA.generate(node, {
      $name: "__$" + node._scope.name,
      $body: _node(node, BLOCK, node.children.slice(0, node.children.length - 1).map(_semicolon)),
      $result: node.children[node.children.length - 1]
     });
    }
    break;
   }
   return _propagate(node, _doIt);
  }
  return _propagate(node, _doIt);
 }
 function _split(node, prop) {
  var exp = node[prop];
  if (!exp || !exp._async) return node;
  var id = _genId(node);
  var v = _identifier(id, exp);
  node[prop] = _identifier(id);
  return _node(node, BLOCK, [_node(node, VAR, [v]), node]);
 }
 function _disassemble(node, options) {
  function _disassembleIt(node, parent, noResult) {
   if (!node._async) return _propagate(node, _scanIt);
   node = _propagate(node, _disassembleIt);
   if (node.type === CALL) {
    if (node.children[0].type === IDENTIFIER && node.children[0].value.indexOf('__wrap') == 0) {
     node._isWrapper = true;
     return node;
    }
    var args = node.children[1];
    if (args.children.some(function(arg) {
     return (arg.type === IDENTIFIER && arg.value === options.callback) || arg._isWrapper;
    })) {
     if (noResult) {
      node._scope.disassembly.push(_statementify(node));
      return;
     } else {
      if (parent.type == IDENTIFIER && parent.value.indexOf('__') === 0) {
       node._skipDisassembly = true;
       return node;
      }
      var id = _genId(node);
      var v = _identifier(id, node);
      node = _node(node, VAR, [v]);
      node._scope.disassembly.push(node);
      return _identifier(id);
     }
    }
   }
   return node;
  }
  function _scanIt(node, parent) {
   var scope = node._scope;
   if (!scope || !scope.isAsync() || !node._async) return _propagate(node, _scanIt);
   switch (node.type) {
   case IF:
    node = _split(node, "condition");
    break;
   case SWITCH:
    node = _split(node, "discriminant");
    break;
   case FOR:
    break;
   case RETURN:
    node = _split(node, "value");
    break;
   case THROW:
    node = _split(node, "exception");
    break;
   case VAR:
    _assert(node.children.length === 1);
    var ident = node.children[0];
    scope.disassembly = [];
    ident.initializer = _disassembleIt(ident.initializer, ident);
    node._async = ident.initializer._skipDisassembly;
    scope.disassembly.push(node);
    return _node(parent, BLOCK, scope.disassembly);
   case SEMICOLON:
    scope.disassembly = [];
    node.expression = _disassembleIt(node.expression, node, true);
    if (node.expression) {
     node._async = false;
     scope.disassembly.push(node);
    }
    return _node(parent, BLOCK, scope.disassembly);
   }
   return _propagate(node, _scanIt);
  }
  return _propagate(node, _scanIt);
 }
 var _cbTemplates = {
  FUNCTION: new Template("cb", "{" +
  "	$decls;" +
  "	var __frame = { name: $fname, line: $line };" +
  "	return __func(_, this, arguments, $fn, $index, __frame, function $name(){" +
  "		$body;" +
  "		_();" +
  "	});" +
  "}"),
  FUNCTION_INTERNAL: new Template("cb", "{ $decls; $body; _(); }"),
  RETURN: new Template("cb", "return _(null, $value);"),
  RETURN_UNDEFINED: new Template("cb", "return _(null);"),
  THROW: new Template("cb", "return _($exception);"),
  IF: new Template("cb", "" +
  "return (function $name(__then){" +
  "	if ($condition) { $then; __then(); }" +
  "	else { $else; __then(); }" +
  "})(function $name(){ $tail; });"),
  SWITCH: new Template("cb", "" +
  "return (function $name(__break){" +
  "	$statement;" +
  "})(function $name(){ $tail; });"),
  BREAK: new Template("cb", "return __break();"),
  CONTINUE: new Template("cb", "" +
  "while (__more) { __loop(); } __more = true;" +
  "return;"),
  LOOP1: new Template("cb", "" +
  "if ($v) {" +
  "	$body;" +
  "	while (__more) { __loop(); } __more = true;" +
  "}" +
  "else { __break(); }"),
  LOOP2: new Template("temp", "var $v = $condition; $loop1;"),
  LOOP2_UPDATE: new Template("temp", "" +
  "if ($beenHere) { $update; } else { $beenHere = true; }" +
  "var $v = $condition; $loop1;"),
  FOR: new Template("cb", "" +
  "return (function ___(__break){" +
  "	var __more;" +
  "	var __loop = __cb(_, __frame, 0, 0, function $name(){" +
  "		__more = false;" +
  "		$loop2" +
  "	});" +
  "	do { __loop(); } while (__more); __more = true;" +
  "})(function $name(){ $tail;});"),
  FOR_UPDATE: new Template("cb", "" +
  "var $beenHere = false;" +
  "return (function ___(__break){" +
  "	var __more;" +
  "	var __loop = __cb(_, __frame, 0, 0, function $name(){" +
  "		__more = false;" +
  "		$loop2" +
  "	});" +
  "	do { __loop(); } while (__more); __more = true;" +
  "})(function $name(){ $tail; });"),
  CATCH: new Template("cb", "" +
  "return (function ___(__then){" +
  "	(function ___(_){" +
  "		__tryCatch(_, function $name(){ $try; __then(); });" +
  "	})(function ___($ex, __result){" +
  "		__tryCatch(_, function $name(){" +
  "			if ($ex) { $catch; __then(); }" +
  "			else { _(null, __result); }" +
  "		});" +
  "	});" +
  "})(function ___(){" +
  "	__tryCatch(_, function $name(){ $tail; });" +
  "});"),
  FINALLY: new Template("cb", "" +
  "return (function ___(__then){" +
  "	(function ___(_){" +
  "		__tryCatch(_, function $name(){ $try; _(null, null, true); });" +
  "	})(function ___(__e, __r, __cont){" +
  "		(function ___(__then){" +
  "			__tryCatch(_, function $name(){ $finally; __then(); });" +
  "		})(function ___(){" +
  "			__tryCatch(_, function ___(){" +
  "				if (__cont) __then(); else _(__e, __r);" +
  "			});" +
  "		})" +
  "	});" +
  "})(function ___(){" +
  "	__tryCatch(_, function $name(){ $tail; });" +
  "});"),
  CALL_VOID: new Template("cb", "return __cb(_, __frame, $offset, $col, function $name(){ $tail; }, true)", true),
  CALL_TMP: new Template("cb", "return __cb(_, __frame, $offset, $col, function ___(__0, $result){ $tail }, true)", true),
  CALL_RESULT: new Template("cb", "" +
  "return __cb(_, __frame, $offset, $col, function $name(__0, $v){" +
  "	var $result = $v;" +
  "	$tail" +
  "}, true)", true)
 };
 function _callbackify(node, options) {
  function _scanIt(node, parent) {
   node = _flatten(node);
   if (!node._scope || !node._scope.isAsync() || node._pass === "cb") return _propagate(node, _scanIt);
   switch (node.type) {
   case SCRIPT:
    if (parent._pass !== "cb") {
     var decls;
     for (var cut = 0; cut < node.children.length; cut++) {
      var child = node.children[cut];
      if (child.type === STRING && child.value === "BEGIN_BODY") {
       decls = node.children.splice(0, cut);
       node.children.splice(0, 1);
       break;
      }
     }
     var template = parent._noFuture || parent._pass === "flows" ? _cbTemplates.FUNCTION_INTERNAL : _cbTemplates.FUNCTION;
     node = template.generate(node, {
      $fn: parent.name,
      $name: "__$" + node._scope.name,
      $fname: _string(parent.name),
      $line: _number(node._scope.line),
      $index: _number(node._scope.cbIndex),
      $decls: _node(node, BLOCK, decls || []),
      $body: node
     });
    }
    node.type = SCRIPT;
   case BLOCK:
    for (var i = 0; i < node.children.length; i++) {
     node.children[i] = _restructureIt(node, i);
    }
    return node;
   }
   return _propagate(node, _scanIt);
  }
  function _extractTail(parent, i) {
   return _node(parent, BLOCK, parent.children.splice(i + 1, parent.children.length - i - 1));
  }
  function _restructureIt(parent, i) {
   var node = parent.children[i];
   if (node._pass === "cb") return _propagate(node, _scanIt);
   switch (node.type) {
   case RETURN:
    _extractTail(parent, i);
    var template = node.value ? _cbTemplates.RETURN : _cbTemplates.RETURN_UNDEFINED;
    node = template.generate(node, {
     $value: node.value
    });
    break;
   case THROW:
    _extractTail(parent, i);
    node = _cbTemplates.THROW.generate(node, {
     $exception: node.exception
    });
    break;
   case BREAK:
    if (node.target && !node.target._async) {
     break;
    }
    _extractTail(parent, i);
    if (node.label) {
     throw new Error(node.filename + ": labelled break not supported yet");
    }
    node = _cbTemplates.BREAK.generate(node, {});
    break;
   case CONTINUE:
    if (node.target && !node.target._async) {
     break;
    }
    _extractTail(parent, i);
    if (node.label) {
     throw new Error(node.filename + ": labelled continue not supported yet");
    }
    node = _cbTemplates.CONTINUE.generate(node, {});
    break;
   case TRY:
    var tail = _extractTail(parent, i);
    if (node.catchClauses[0]) {
     node = _cbTemplates.CATCH.generate(node, {
      $name: "__$" + node._scope.name,
      $try: node.tryBlock,
      $catch: node.catchClauses[0].block,
      $ex: node.catchClauses[0].varName,
      $tail: tail
     });
    } else {
     node = _cbTemplates.FINALLY.generate(node, {
      $name: "__$" + node._scope.name,
      $try: node.tryBlock,
      $finally: node.finallyBlock,
      $tail: tail
     });
    }
    break;
   default:
    if (node._async) {
     var tail = _extractTail(parent, i);
     switch (node.type) {
     case IF:
      node = _cbTemplates.IF.generate(node, {
       $name: "__$" + node._scope.name,
       $condition: node.condition,
       $then: node.thenPart,
       $else: node.elsePart || _node(node, BLOCK, []),
       $tail: tail
      });
      break;
     case SWITCH:
      node._pass = "cb";
      node = _cbTemplates.SWITCH.generate(node, {
       $name: "__$" + node._scope.name,
       $statement: node,
       $tail: tail
      });
      break;
     case FOR:
      var v = _identifier(_genId(node));
      var loop1 = _cbTemplates.LOOP1.generate(node, {
       $v: v,
       $body: node.body,
      });
      var update = node.update;
      var beenHere = update && _identifier(_genId(node));
      var loop2 = (update ? _cbTemplates.LOOP2_UPDATE : _cbTemplates.LOOP2).generate(node, {
       $v: v,
       $condition: node.condition,
       $beenHere: beenHere,
       $update: _statementify(update),
       $loop1: loop1
      });
      node = (update ? _cbTemplates.FOR_UPDATE : _cbTemplates.FOR).generate(node, {
       $name: "__$" + node._scope.name,
       $beenHere: beenHere,
       $loop2: loop2,
       $tail: tail
      });
      break;
     case VAR:
      _assert(node.children.length == 1);
      var ident = node.children[0];
      _assert(ident.type === IDENTIFIER);
      var call = ident.initializer;
      delete ident.initializer;
      _assert(call && call.type === CALL);
      return _restructureCall(call, tail, ident.value);
     case SEMICOLON:
      var call = node.expression;
      _assert(call.type === CALL)
      return _restructureCall(call, tail);
     default:
      throw new Error("internal error: bad node type: " + _tag(node) + ": " + pp(node));
     }
    }
   }
   return _scanIt(node, parent);
   function _restructureCall(node, tail, result) {
    var args = node.children[1];
    function _cbIndex(args) {
     return args.children.reduce(function(index, arg, i) {
      if ((arg.type == IDENTIFIER && arg.value === options.callback) || arg._isWrapper) return i;
      else return index;
     }, -1);
    }
    var i = _cbIndex(args);
    _assert(i >= 0);
    if (args.children[i]._isWrapper) {
     args = args.children[i].children[1];
     i = _cbIndex(args);
    }
    var bol = node.start;
    while (bol >= 0 && options.source[bol] != '\n')
    bol--;
    args.children[i] = (result ? result.indexOf('__') === 0 ? _cbTemplates.CALL_TMP : _cbTemplates.CALL_RESULT : _cbTemplates.CALL_VOID).generate(node, {
     $v: _genId(node),
     $frameName: _string(node._scope.name),
     $offset: _number(node.lineno - node._scope.line),
     $col: _number(node.start - bol - 1),
     $name: "__$" + node._scope.name,
     $result: result,
     $tail: tail
    });
    node = _propagate(node, _scanIt);
    var stmt = _node(node, RETURN, []);
    stmt.value = node;
    stmt._pass = "cb";
    return stmt;
   }
  }
  return _propagate(node, _scanIt);
 }
 function _checkUsed(val, used) {
  if (typeof val === "string" && val.substring(0, 2) === "__") used[val] = true;
 }
 var _optims = {
  function__0$fn: new Template("simplify", "return function ___(__0) { $fn(); }", true).root,
  function$return: new Template("simplify", "return function $fn1() { return $fn2(); }", true).root,
  function__0$arg1return_null$arg2: new Template("simplify", "return function ___(__0, $arg1) { return _(null, $arg2); }", true).root,
  __cb__: new Template("simplify", "return __cb(_, $frameVar, $line, $col, _)", true).root,
  __cbt__: new Template("simplify", "return __cb(_, $frameVar, $line, $col, _, true)", true).root,
  function$fn: new Template("simplify", "return function $fn1() { $fn2(); }", true).root
 }
 function _simplify(node, options, used) {
  if (node._simplified) return node;
  node._simplified = true;
  _propagate(node, function(child) {
   return _simplify(child, options, used)
  });
  _checkUsed(node.value, used);
  function _match(prop, v1, v2, result) {
   var ignored = ["parenthesized", "lineno", "start", "end", "tokenizer", "hasReturnWithValue"];
   if (prop.indexOf('_') == 0 || ignored.indexOf(prop) >= 0) return true;
   if (v1 == v2) return true;
   if (v1 == null || v2 == null) {
    if (prop == "children" && v1 && v1.length === 0) return true;
    return false;
   }
   if (Array.isArray(v1)) {
    if (v1.length != v2.length) return false;
    for (var i = 0; i < v1.length; i++) {
     if (!_match(prop, v1[i], v2[i], result)) return false;
    }
    return true;
   }
   if (v1.type === IDENTIFIER && v1.value[0] === "$" && v2.type === NUMBER) {
    result[v1.value] = v2.value;
    return true;
   }
   if (typeof v1 == "string" && v1[0] == "$" && typeof v2 == "string") {
    result[v1] = v2;
    return true;
   }
   if (v1.type) {
    var exp;
    if (v1.type == SCRIPT && v1.children[0] && (exp = v1.children[0].expression) && typeof exp.value == "string" && exp.value[0] == '$') {
     result[exp.value] = v2;
     return true;
    }
    if (v1.type != v2.type) return false;
    if (v1.type == IDENTIFIER && v1.value == '$') {
     result[v1.value] = v2.value;
     return true;
    }
    for (var prop in v1) {
     if (v1.hasOwnProperty(prop) && prop.indexOf("Decls") < 0 && prop != "target") {
      if (!_match(prop, v1[prop], v2[prop], result)) return false;
     }
    }
    return true;
   }
   return false;
  }
  var result = {};
  if (_match("", _optims.function__0$fn, node, result)) return _identifier(result.$fn);
  if (_match("", _optims.function$return, node, result) && (result.$fn1 === '___' || result.$fn1.indexOf('__$') === 0) && (result.$fn2 === '__break')) return _identifier(result.$fn2);
  if (_match("", _optims.function__0$arg1return_null$arg2, node, result) && result.$arg1 == result.$arg2) return _identifier("_");
  if (options.optimize && _match("", _optims.__cb__, node, result)) return _identifier("_");
  if (options.optimize && _match("", _optims.__cbt__, node, result)) return _identifier("_");
  if (_match("", _optims.function$fn, node, result) && (result.$fn1 === '___' || result.$fn1.indexOf('__$') === 0) && (result.$fn2 === '_' || result.$fn2 === '__then' || result.$fn2 === '__loop')) return _identifier(result.$fn2);
  _flatten(node);
  return node;
 }
 function _extend(obj, other) {
  for (var i in other) {
   obj[i] = other[i];
  }
  return obj;
 }
 function _cl(obj) {
  return _extend({}, obj);
 }
 exports.transform = function(source, options) {
  try {
   source = source.replace(/\r\n/g, "\n");
   options = options ? _extend({}, options) : {};
   var sourceOptions = /streamline\.options\s*=\s*(\{.*\})/.exec(source);
   if (sourceOptions) {
    _extend(options, JSON.parse(sourceOptions[1]));
   }
   options.source = source;
   options.callback = options.callback || "_";
   options.lines = options.lines || "preserve";
   options.precious = {};
   var node = parse(source + "\n");
   var strict = node.children[0] && node.children[0].expression && node.children[0].expression.value == "use strict";
   strict && node.children.splice(0, 1);
   _markSource(node, options);
   node = _canonTopLevelScript(node, options);
   node = _canonScopes(node, options);
   node = _canonFlows(node, options);
   node = _disassemble(node, options);
   node = _callbackify(node, options);
   var used = {};
   node = _simplify(node, options, used);
   var result = format(node, options.lines);
   if (!options.noHelpers) result = exports.helpersSource(options, used, strict) + result;
   return result;
  } catch (err) {
   var message = "error streamlining " + (options.sourceName || 'source') + ": " + err.message;
   if (err.source && err.cursor) {
    var line = 1;
    for (var i = 0; i < err.cursor; i++) {
     if (err.source[i] === "\n") line += 1;
    }
    message += " on line " + line;
   } else if (err.stack) {
    message += "\nSTACK:\n" + err.stack;
   }
   throw new Error(message);
  }
 }
 function _trim(fn) {
  return fn.toString().replace(/\s+/g, " ");
 }
 exports.helpersSource = function(options, used, strict) {
  var srcName = "" + options.sourceName;
  var i = srcName.indexOf('node_modules/');
  if (i == -1 && typeof process === 'object' && typeof process.cwd === 'function') i = process.cwd().length;
  srcName = i >= 0 ? srcName.substring(i + 13) : srcName;
  var sep = options.lines == "preserve" ? " " : "\n";
  strict = strict ? '"use strict";' + sep : "";
  var s = sep + strict;
  var rt = require("streamline/lib/callbacks/runtime").runtime(options.sourceName + ".js");
  var __rt = _safeName(options.precious, "__rt");
  s += "var " + __rt + "=require('streamline/lib/callbacks/runtime').runtime(__filename)";
  for (var key in rt) {
   var k = _safeName(options.precious, key);
   if (used[k]) s += "," + k + "=" + __rt + "." + key;
  }
  s += ";" + sep;
  return s;
 }
})(typeof exports !== 'undefined' ? exports : (window.Streamline = window.Streamline || {}));
(function(exports) {
 var globals = require("streamline/lib/globals");
 exports.future = function(fn, args, i) {
  var err, result, done, q = [];
  args = Array.prototype.slice.call(args);
  function notify(e, r) {
   err = e, result = r, done = true;
   q && q.forEach(function(f) {
    try {
     if (f.timeout) {
      clearTimeout(f.timeout);
      delete f.timeout;
     }
     var ignore = f.ignore;
     f.ignore = true;
     if (!ignore) f(e, r);
    } catch (ex) {
     __trap(ex);
    }
   });
   q = null;
  };
  args[i] = notify;
  future.prev = globals.future;
  globals.future = future;
  try {
   fn.apply(this, args);
  } finally {
   globals.future = future.prev;
  }
  function future(cb, timeout) {
   if (!cb) return future;
   if (future.cancelled) return cb(new Error("future cancelled"));
   if (done) return cb(err, result);
   if (typeof timeout === 'number') {
    timeout = { timeout: timeout };
   }
   var ncb = cb;
   if (timeout != null) {
    ncb = function(e, r) {
     cb(e, r);
    }
    ncb.timeout = setTimeout(function() {
     if (ncb.timeout) {
      clearTimeout(ncb.timeout);
      delete ncb.timeout;
      var nfy = cb, v;
      if (timeout.probe) {
       ncb.ignore = true;
      } else {
       future.cancelled = true;
       nfy = notify;
      }
      if ("return" in timeout) {
       v = timeout.return;
       nfy(null, typeof v === 'function' ? v() : v);
      } else {
       v = timeout.throw || "timeout";
       nfy(typeof v === 'function' ? v() : typeof v === 'string' ? new Error(v) : v);
      }
     }
    }, timeout.timeout);
   }
   q.push(ncb);
  }
  return future;
 }
})(typeof exports !== 'undefined' ? exports : (Streamline.future = Streamline.future || {}));
(function(exports) {
 var __g = require("streamline/lib/globals");
 var __future = require("streamline/lib/util/future").future;
 __g.context = __g.context || {};
 __g.depth = __g.depth || 0;
 __g.trampoline = (function() {
  var q = [];
  return {
   queue: function(fn) {
    q.push(fn);
   },
   flush: function() {
    __g.depth++;
    try {
     var fn;
     while (fn = q.shift()) fn();
    } finally {
     __g.depth--;
    }
   }
  }
 })();
 exports.runtime = function(filename) {
  function __func(_, __this, __arguments, fn, index, frame, body) {
   if (!_) {
    return __future.call(__this, fn, __arguments, index);
   }
   frame.file = filename;
   frame.prev = __g.frame;
   __g.frame = frame;
   __g.depth++;
   try {
    frame.active = true;
    body();
   } catch (e) {
    __setEF(e, frame.prev);
    __propagate(_, e);
   } finally {
    frame.active = false;
    __g.frame = frame.prev;
    if (--__g.depth === 0 && __g.trampoline) __g.trampoline.flush();
   }
  }
  return {
   __g: __g,
   __func: __func,
   __cb: __cb,
   __future: __future,
   __propagate: __propagate,
   __trap: __trap,
   __tryCatch: __tryCatch,
   __forIn: __forIn,
   __apply: __apply,
   __construct: __construct,
   __setEF: __setEF
  };
 }
 function __cb(_, frame, offset, col, fn, trampo) {
  frame.offset = offset;
  frame.col = col;
  var ctx = __g.context;
  var fut = __g.future;
  return function ___(err, result) {
   for (var f = fut; f; f = f.prev) {
    if (f.cancelled) err = new Error("cancelled");
   }
   var oldFrame = __g.frame;
   __g.frame = frame;
   __g.context = ctx;
   var oldFut = __g.future;
   __g.future = fut;
   __g.depth++;
   try {
    if (trampo && frame.active && __g.trampoline) {
     __g.trampoline.queue(function() {
      return ___(err, result);
     });
    } else {
     if (err) {
      __setEF(err, frame);
      return _(err);
     }
     frame.active = true;
     return fn(null, result);
    }
   } catch (ex) {
    __setEF(ex, frame);
    return __propagate(_, ex);
   } finally {
    frame.active = false;
    __g.frame = oldFrame;
    if (--__g.depth === 0 && __g.trampoline) __g.trampoline.flush();
    __g.future = oldFut;
   }
  }
 }
 function __propagate(_, err) {
  try {
   _(err);
  } catch (ex) {
   __trap(ex);
  }
 }
 function __trap(err) {
  if (err) {
   if (__g.context && __g.context.errorHandler) __g.context.errorHandler(err);
   else __g.trampoline.queue(function() {
    throw err;
   });
  }
 }
 __tryCatch: function __tryCatch(_, fn) {
  try {
   fn();
  } catch (e) {
   try {
    _(e);
   } catch (ex) {
    __trap(ex);
   }
  }
 }
 function __forIn(object) {
  var array = [];
  for (var obj in object) {
   array.push(obj);
  }
  return array;
 }
 function __apply(cb, fn, thisObj, args, index) {
  if (cb == null) return __future(__apply, arguments, 0);
  args = Array.prototype.slice.call(args, 0);
  args[index != null ? index : args.length] = cb;
  return fn.apply(thisObj, args);
 }
 function __construct(constructor, i) {
  var key = '__async' + i,
   f;
  return constructor[key] || (constructor[key] = function() {
   var args = arguments;
   function F() {
    var self = this;
    var cb = args[i];
    args[i] = function(e, r) {
     cb(e, self);
    }
    return constructor.apply(self, args);
   }
   F.prototype = constructor.prototype;
   return new F();
  });
 }
 function __setEF(e, f) {
  function formatStack(e, raw) {
   var s = raw,
    f, skip, skipFunc = 0;
   if (s) {
    var ff;
    s = s.split('\n').map(function(l) {
     var ffOffset = (typeof navigator === 'object' && typeof require === 'function' && require.async) ? 10 : 0;
     var m = /(^[^(]+)\([^@]*\@(.*)\:(\d+)$/.exec(l);
     l = m ? "    at " + m[1] + " (" + m[2] + ":" + (parseInt(m[3]) - ffOffset) + ":0)" : l;
     ff = ff || (m != null);
     var i = l.indexOf('__$');
     if (i >= 0 && !skip) {
      skip = true;
      return l.substring(0, i) + l.substring(i + 3) + '\n';
     }
     return skip ? '' : l + '\n';
    }).join('');
    if (ff)
    s = "Error: " + e.message + '\n' + s;
    for (var f = e.__frame; f; f = f.prev) {
     if (f.offset >= 0) s += "    at " + f.name + " (" + f.file + ":" + (f.line + f.offset) + ":" + f.col + ")\n"
    }
   }
   return s;
  };
  e.__frame = e.__frame || f;
  if (exports.stackTraceEnabled && e.__lookupGetter__ && e.__lookupGetter__("rawStack") == null) {
   var getter = e.__lookupGetter__("stack");
   if (!getter) {
    var raw = e.stack || "raw stack unavailable";
    getter = function() {
     return raw;
    }
   }
   e.__defineGetter__("rawStack", getter);
   e.__defineGetter__("stack", function() {
    return formatStack(e, getter());
   });
  }
 }
 exports.stackTraceEnabled = true;
})(typeof exports !== 'undefined' ? exports : (Streamline.runtime = Streamline.runtime || {}));
require && require("streamline/lib/callbacks/builtins");
                                                                  var __rt=require('streamline/lib/callbacks/runtime').runtime(__filename),__func=__rt.__func,__cb=__rt.__cb; (function(exports) {
  "use strict";
  var VERSION = 3;
  var future = function(fn, args, i) {
    var err, result, done, q = [], self = this;
    args = Array.prototype.slice.call(args);
    args[i] = function(e, r) {
      err = e, result = r, done = true;
      (q && q.forEach(function(f) {
        f.call(self, e, r); }));
      q = null; };
    fn.apply(this, args);
    return function F(cb) {
      if (!cb) { return F };
      if (done) { cb.call(self, err, result); } else {
        q.push(cb); }; }; };
  exports.funnel = function(max) {
    max = ((max == null) ? -1 : max);
    if ((max === 0)) { max = funnel.defaultSize; };
    if ((typeof max !== "number")) { throw new Error(("bad max number: " + max)) };
    var queue = [], active = 0, closed = false;
    var fun = function(callback, fn) {
      if ((callback == null)) { return future(fun, arguments, 0) };
      if (((max < 0) || (max == Infinity))) { return fn(callback) };
      queue.push({
        fn: fn,
        cb: callback });
      function _doOne() {
        var current = queue.splice(0, 1)[0];
        if (!current.cb) { return current.fn() };
        active++;
        current.fn(function(err, result) {
          active--;
          if (!closed) {
            current.cb(err, result);
            while (((active < max) && (queue.length > 0))) { _doOne();; }; } ; }); };
      while (((active < max) && (queue.length > 0))) { _doOne();; }; };
    fun.close = function() {
      queue = [], closed = true; };
    return fun; };
  var funnel = exports.funnel;
  funnel.defaultSize = 4;
  function _parallel(options) {
    if ((typeof options === "number")) { return options };
    if ((typeof options.parallel === "number")) { return options.parallel };
    return (options.parallel ? -1 : 1); };
  if ((Array.prototype.forEach_ && (Array.prototype.forEach_.version_ >= VERSION))) { return };
  try {
    Object.defineProperty({ }, "x", { });
  } catch (e) {
    return; };
  var has = Object.prototype.hasOwnProperty;
  delete Array.prototype.forEach_;
  Object.defineProperty(Array.prototype, "forEach_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__1(_, options, fn, thisObj) { var par, len, i, __this = this; var __frame = { name: "value__1", line: 120 }; return __func(_, this, arguments, value__1, 0, __frame, function __$value__1() {
        if ((typeof options === "function")) { thisObj = fn, fn = options, options = 1; } ;
        par = _parallel(options);
        thisObj = ((thisObj !== undefined) ? thisObj : __this);
        len = __this.length; return (function __$value__1(__then) {
          if (((par === 1) || (len <= 1))) {
            i = 0; var __2 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__1() { __more = false; if (__2) { i++; } else { __2 = true; } ; var __1 = (i < len); if (__1) { return (function __$value__1(__then) {
                    if (has.call(__this, i)) { return fn.call(thisObj, __cb(_, __frame, 7, 28, __then, true), __this[i], i); } else { __then(); } ; })(function __$value__1() { while (__more) { __loop(); }; __more = true; }); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } else {
            return __this.map_(__cb(_, __frame, 10, 4, __then, true), par, fn, thisObj); } ; })(function __$value__1() { return _(null, __this); }); }); } });
  Array.prototype.forEach_.version_ = VERSION;
  delete Array.prototype.map_;
  Object.defineProperty(Array.prototype, "map_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__2(_, options, fn, thisObj) { var par, len, result, i, fun, __this = this; var __frame = { name: "value__2", line: 143 }; return __func(_, this, arguments, value__2, 0, __frame, function __$value__2() {
        if ((typeof options === "function")) { thisObj = fn, fn = options, options = 1; } ;
        par = _parallel(options);
        thisObj = ((thisObj !== undefined) ? thisObj : __this);
        len = __this.length; return (function __$value__2(__then) {
          if (((par === 1) || (len <= 1))) {
            result = new Array(len);
            i = 0; var __4 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__2() { __more = false; if (__4) { i++; } else { __4 = true; } ; var __3 = (i < len); if (__3) { return (function __$value__2(__then) {
                    if (has.call(__this, i)) { return fn.call(thisObj, __cb(_, __frame, 9, 40, function ___(__0, __1) { result[i] = __1; __then(); }, true), __this[i], i); } else { __then(); } ; })(function __$value__2() { while (__more) { __loop(); }; __more = true; }); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } else {
            fun = funnel(par);
            result = __this.map(function(elt, i) {
              return fun(null, function __1(_) { var __frame = { name: "__1", line: 157 }; return __func(_, this, arguments, __1, 0, __frame, function __$__1() {
                  return fn.call(thisObj, __cb(_, __frame, 1, 13, _, true), elt, i); }); }); });
            i = 0; var __7 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__2() { __more = false; if (__7) { i++; } else { __7 = true; } ; var __6 = (i < len); if (__6) { return (function __$value__2(__then) {
                    if (has.call(__this, i)) { return result[i](__cb(_, __frame, 19, 40, function ___(__0, __2) { result[i] = __2; __then(); }, true)); } else { __then(); } ; })(function __$value__2() { while (__more) { __loop(); }; __more = true; }); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } ; })(function __$value__2() {
          return _(null, result); }); }); } });
  delete Array.prototype.filter_;
  Object.defineProperty(Array.prototype, "filter_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__3(_, options, fn, thisObj) { var par, result, len, i, elt, __this = this; var __frame = { name: "value__3", line: 175 }; return __func(_, this, arguments, value__3, 0, __frame, function __$value__3() {
        if ((typeof options === "function")) { thisObj = fn, fn = options, options = 1; } ;
        par = _parallel(options);
        thisObj = ((thisObj !== undefined) ? thisObj : __this);
        result = [];
        len = __this.length; return (function __$value__3(__then) {
          if (((par === 1) || (len <= 1))) {
            i = 0; var __4 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__3() { __more = false; if (__4) { i++; } else { __4 = true; } ; var __3 = (i < len); if (__3) { return (function __$value__3(__then) {
                    if (has.call(__this, i)) {
                      elt = __this[i];
                      return fn.call(thisObj, __cb(_, __frame, 10, 10, function ___(__0, __2) { return (function __$value__3(__then) { if (__2) { result.push(elt); __then(); } else { __then(); } ; })(__then); }, true), elt); } else { __then(); } ; })(function __$value__3() { while (__more) { __loop(); }; __more = true; }); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } else {
            return __this.map_(__cb(_, __frame, 14, 4, __then, true), par, function __1(_, elt) { var __frame = { name: "__1", line: 189 }; return __func(_, this, arguments, __1, 0, __frame, function __$__1() {
                return fn.call(thisObj, __cb(_, __frame, 1, 9, function ___(__0, __1) { return (function __$__1(__then) { if (__1) { result.push(elt); __then(); } else { __then(); } ; })(_); }, true), elt); });
            }, thisObj); } ; })(function __$value__3() {
          return _(null, result); }); }); } });
  delete Array.prototype.every_;
  Object.defineProperty(Array.prototype, "every_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__4(_, options, fn, thisObj) { var par, len, i, fun, futures, __this = this; var __frame = { name: "value__4", line: 203 }; return __func(_, this, arguments, value__4, 0, __frame, function __$value__4() {
        if ((typeof options === "function")) { thisObj = fn, fn = options, options = 1; } ;
        par = _parallel(options);
        thisObj = ((thisObj !== undefined) ? thisObj : __this);
        len = __this.length; return (function __$value__4(__then) {
          if (((par === 1) || (len <= 1))) {
            i = 0; var __6 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__4() { __more = false; if (__6) { i++; } else { __6 = true; } ; var __5 = (i < len); if (__5) { return (function __$value__4(_) {
                    var __1 = has.call(__this, i); if (!__1) { return _(null, __1); } ; return fn.call(thisObj, __cb(_, __frame, 8, 31, function ___(__0, __3) { var __2 = !__3; return _(null, __2); }, true), __this[i]); })(__cb(_, __frame, -202, 17, function ___(__0, __3) { return (function __$value__4(__then) { if (__3) { return _(null, false); } else { __then(); } ; })(function __$value__4() { while (__more) { __loop(); }; __more = true; }); }, true)); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } else {
            fun = funnel(par);
            futures = __this.map(function(elt) {
              return fun(null, function __1(_) { var __frame = { name: "__1", line: 216 }; return __func(_, this, arguments, __1, 0, __frame, function __$__1() {
                  return fn.call(thisObj, __cb(_, __frame, 1, 13, _, true), elt); }); }); });
            i = 0; var __9 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__4() { __more = false; if (__9) { i++; } else { __9 = true; } ; var __8 = (i < len); if (__8) { return (function __$value__4(_) {
                    var __2 = has.call(__this, i); if (!__2) { return _(null, __2); } ; return futures[i](__cb(_, __frame, 18, 31, function ___(__0, __4) { var __3 = !__4; return _(null, __3); }, true)); })(__cb(_, __frame, -202, 17, function ___(__0, __4) { return (function __$value__4(__then) { if (__4) {
                        fun.close();
                        return _(null, false); } else { __then(); } ; })(function __$value__4() { while (__more) { __loop(); }; __more = true; }); }, true)); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } ; })(function __$value__4() {
          return _(null, true); }); }); } });
  delete Array.prototype.some_;
  Object.defineProperty(Array.prototype, "some_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__5(_, options, fn, thisObj) { var par, len, i, fun, futures, __this = this; var __frame = { name: "value__5", line: 237 }; return __func(_, this, arguments, value__5, 0, __frame, function __$value__5() {
        if ((typeof options === "function")) { thisObj = fn, fn = options, options = 1; } ;
        par = _parallel(options);
        thisObj = ((thisObj !== undefined) ? thisObj : __this);
        len = __this.length; return (function __$value__5(__then) {
          if (((par === 1) || (len <= 1))) {
            i = 0; var __6 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__5() { __more = false; if (__6) { i++; } else { __6 = true; } ; var __5 = (i < len); if (__5) { return (function __$value__5(_) {
                    var __1 = has.call(__this, i); if (!__1) { return _(null, __1); } ; return fn.call(thisObj, __cb(_, __frame, 7, 30, _, true), __this[i]); })(__cb(_, __frame, -236, 17, function ___(__0, __3) { return (function __$value__5(__then) { if (__3) { return _(null, true); } else { __then(); } ; })(function __$value__5() { while (__more) { __loop(); }; __more = true; }); }, true)); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } else {
            fun = funnel(par);
            futures = __this.map(function(elt) {
              return fun(null, function __1(_) { var __frame = { name: "__1", line: 249 }; return __func(_, this, arguments, __1, 0, __frame, function __$__1() {
                  return fn.call(thisObj, __cb(_, __frame, 1, 13, _, true), elt); }); }); });
            i = 0; var __9 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__5() { __more = false; if (__9) { i++; } else { __9 = true; } ; var __8 = (i < len); if (__8) { return (function __$value__5(_) {
                    var __2 = has.call(__this, i); if (!__2) { return _(null, __2); } ; return futures[i](__cb(_, __frame, 17, 30, _, true)); })(__cb(_, __frame, -236, 17, function ___(__0, __4) { return (function __$value__5(__then) { if (__4) {
                        fun.close();
                        return _(null, true); } else { __then(); } ; })(function __$value__5() { while (__more) { __loop(); }; __more = true; }); }, true)); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } ; })(function __$value__5() {
          return _(null, false); }); }); } });
  delete Array.prototype.reduce_;
  Object.defineProperty(Array.prototype, "reduce_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__6(_, fn, v, thisObj) { var len, i, __this = this; var __frame = { name: "value__6", line: 270 }; return __func(_, this, arguments, value__6, 0, __frame, function __$value__6() {
        thisObj = ((thisObj !== undefined) ? thisObj : __this);
        len = __this.length;
        i = 0; var __3 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__6() { __more = false; if (__3) { i++; } else { __3 = true; } ; var __2 = (i < len); if (__2) { return (function __$value__6(__then) {
                if (has.call(__this, i)) { return fn.call(thisObj, __cb(_, __frame, 4, 31, function ___(__0, __1) { v = __1; __then(); }, true), v, __this[i], i, __this); } else { __then(); } ; })(function __$value__6() { while (__more) { __loop(); }; __more = true; }); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(function __$value__6() {
          return _(null, v); }); }); } });
  delete Array.prototype.reduceRight_;
  Object.defineProperty(Array.prototype, "reduceRight_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__7(_, fn, v, thisObj) { var len, i, __this = this; var __frame = { name: "value__7", line: 286 }; return __func(_, this, arguments, value__7, 0, __frame, function __$value__7() {
        thisObj = ((thisObj !== undefined) ? thisObj : __this);
        len = __this.length;
        i = (len - 1); var __3 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__7() { __more = false; if (__3) { i--; } else { __3 = true; } ; var __2 = (i >= 0); if (__2) { return (function __$value__7(__then) {
                if (has.call(__this, i)) { return fn.call(thisObj, __cb(_, __frame, 4, 31, function ___(__0, __1) { v = __1; __then(); }, true), v, __this[i], i, __this); } else { __then(); } ; })(function __$value__7() { while (__more) { __loop(); }; __more = true; }); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(function __$value__7() {
          return _(null, v); }); }); } });
  delete Array.prototype.sort_;
  Object.defineProperty(Array.prototype, "sort_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__8(_, compare, beg, end) { var array, __this = this;
      function _qsort(_, beg, end) { var tmp, mid, o, nbeg, nend; var __frame = { name: "_qsort", line: 309 }; return __func(_, this, arguments, _qsort, 0, __frame, function __$_qsort() {
          if ((beg >= end)) { return _(null); } ; return (function __$_qsort(__then) {
            if ((end == (beg + 1))) {
              return compare(__cb(_, __frame, 4, 9, function ___(__0, __2) { var __1 = (__2 > 0); return (function __$_qsort(__then) { if (__1) {
                    tmp = array[beg];
                    array[beg] = array[end];
                    array[end] = tmp; __then(); } else { __then(); } ; })(function __$_qsort() { return _(null); }); }, true), array[beg], array[end]); } else { __then(); } ; })(function __$_qsort() {
            mid = Math.floor((((beg + end)) / 2));
            o = array[mid];
            nbeg = beg;
            nend = end; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$_qsort() { __more = false;
                var __4 = (nbeg <= nend); if (__4) { return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$_qsort() { __more = false; return (function __$_qsort(_) { return (function __$_qsort(_) {
                          var __1 = (nbeg < end); if (!__1) { return _(null, __1); } ; return compare(__cb(_, __frame, 18, 26, function ___(__0, __3) { var __2 = (__3 < 0); return _(null, __2); }, true), array[nbeg], o); })(__cb(_, __frame, -308, 17, _, true)); })(__cb(_, __frame, -308, 17, function ___(__0, __5) { if (__5) { nbeg++; while (__more) { __loop(); }; __more = true; } else { __break(); } ; }, true)); }); do { __loop(); } while (__more); __more = true; })(function __$_qsort() { return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$_qsort() { __more = false; return (function __$_qsort(_) { return (function __$_qsort(_) {
                            var __1 = (beg < nend); if (!__1) { return _(null, __1); } ; return compare(__cb(_, __frame, 19, 26, function ___(__0, __3) { var __2 = (__3 < 0); return _(null, __2); }, true), o, array[nend]); })(__cb(_, __frame, -308, 17, _, true)); })(__cb(_, __frame, -308, 17, function ___(__0, __7) { if (__7) { nend--; while (__more) { __loop(); }; __more = true; } else { __break(); } ; }, true)); }); do { __loop(); } while (__more); __more = true; })(function __$_qsort() {
                      if ((nbeg <= nend)) {
                        tmp = array[nbeg];
                        array[nbeg] = array[nend];
                        array[nend] = tmp;
                        nbeg++;
                        nend--; } ; while (__more) { __loop(); }; __more = true; }); }); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(function __$_qsort() { return (function __$_qsort(__then) {
                if ((nbeg < end)) { return _qsort(__cb(_, __frame, 30, 20, __then, true), nbeg, end); } else { __then(); } ; })(function __$_qsort() { return (function __$_qsort(__then) {
                  if ((beg < nend)) { return _qsort(__cb(_, __frame, 31, 20, __then, true), beg, nend); } else { __then(); } ; })(_); }); }); }); }); }; var __frame = { name: "value__8", line: 304 }; return __func(_, this, arguments, value__8, 0, __frame, function __$value__8() { array = __this; beg = (beg || 0); end = ((end == null) ? (array.length - 1) : end);
        return _qsort(__cb(_, __frame, 38, 3, function __$value__8() {
          return _(null, array); }, true), beg, end); }); } });
  delete Function.prototype.apply_;
  Object.defineProperty(Function.prototype, "apply_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function(callback, thisObj, args, index) {
      args = Array.prototype.slice.call(args, 0);
      args.splice((((index != null) && (index >= 0)) ? index : args.length), 0, callback);
      return this.apply(thisObj, args); } });
})(((typeof exports !== "undefined") ? exports : (Streamline.builtins = (Streamline.builtins || {}))));
return Streamline;
}());
