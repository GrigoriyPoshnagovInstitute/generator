// src/parser/Parser.ts
import Lexer from "../lexer/Lexer";
import Token from "../lexer/token/Token";
import TokenType from "../lexer/token/TokenType";
import LexerError from "../LexerError";
import { isRelOp, isLowPriorityOp, isHighPriorityOp } from "./Operations";

class Parser {
    private lexer: Lexer;
    private error: LexerError = LexerError.NONE;
    private token: Token | null = null;

    constructor(str: string) {
        this.lexer = new Lexer(str);
    }

    parse(): boolean {
        return this.expression() && this.isEmpty();
    }

    getError(): LexerError {
        return this.error;
    }

    getLastToken(): Token | null {
        return this.token;
    }

    private getToken(): Token {
        const token = this.lexer.getToken();
        this.recordToken(token);
        return token;
    }

    private peekToken(): Token {
        const token = this.lexer.peekToken();
        this.recordToken(token);
        return token;
    }

    private recordToken(token: Token): void {
        if (token.type === TokenType.ERROR) {
            this.error = token.error;
        }
        this.token = token;
    }

    private panic(error: LexerError): boolean {
        this.error = error;
        return false;
    }

    private isEmpty(): boolean {
        return this.lexer.isEmpty();
    }

    // Parser rules implementation below

    /**
     * expressionRem -> e | relOp simexp expressionRem
     */
    private expressionRem(): boolean {
        if (this.isEmpty()) {
            return true;
        }

        if (isRelOp(this.peekToken().type)) {
            this.getToken();
            return this.simExp() && this.expressionRem();
        }

        return true;
    }

    /**
     * expression -> simexp expressionRem
     * expressionRem -> e | relOp simexp expressionRem
     */
    private expression(): boolean {
        if (this.isEmpty()) {
            return false;
        }

        return this.simExp() && this.expressionRem();
    }

    /**
     * expListRemainder -> e | , expression expListRemainder
     */
    private expressionListRem(): boolean {
        if (this.isEmpty()) {
            return true;
        }

        if (this.peekToken().type === TokenType.COMMA) {
            this.getToken();
            return this.expression() && this.expressionListRem();
        }

        return true;
    }

    /**
     * expList -> e | expression expListRemainder
     * expListRemainder -> e | , expression expListRemainder
     */
    private expressionList(): boolean {
        return this.expression() && this.expressionListRem();
    }

    /**
     * idRem -> e | [expression] idRem | (expList) idRem | () idRem
     */
    private idRem(): boolean {
        if (this.isEmpty()) {
            return true;
        }

        const nextTokenType = this.peekToken().type;

        if (nextTokenType === TokenType.BRACKET_OPEN) {
            this.getToken();
            return this.expression() && this.getToken().type === TokenType.BRACKET_CLOSE && this.idRem();
        }

        if (nextTokenType === TokenType.PARAN_OPEN) {
            this.getToken();
            if (this.peekToken().type === TokenType.PARAN_CLOSE) {
                this.getToken();
                return this.idRem();
            }
            return this.expressionList() && this.getToken().type === TokenType.PARAN_CLOSE && this.idRem();
        }

        return true;
    }

    private id(): boolean {
        return !this.isEmpty() && this.getToken().type === TokenType.ID;
    }

    /**
     * ident -> id idRem
     * idRem -> e | [expression] idRem | (expList) idRem
     */
    private ident(): boolean {
        return this.id() && this.idRem();
    }

    /**
     * simexpRem -> e | lowPriorityOp simterm simexpRem
     */
    private simExpRem(): boolean {
        if (this.isEmpty()) {
            return true;
        }

        if (isLowPriorityOp(this.peekToken().type)) {
            this.getToken();
            return this.simTerm() && this.simExpRem();
        }

        return true;
    }

    /**
     * simexp -> simterm simexpRem
     * simexpRem -> e | lowPriorityOp simterm simexpRem
     */
    private simExp(): boolean {
        if (this.isEmpty()) {
            return false;
        }

        return this.simTerm() && this.simExpRem();
    }

    /**
     * simtermRem -> e | highPriorityOp term simtermRem
     */
    private simTermRem(): boolean {
        if (this.isEmpty()) {
            return true;
        }

        if (isHighPriorityOp(this.peekToken().type)) {
            this.getToken();
            return this.term() && this.simTermRem();
        }

        return true;
    }

    /**
     * simterm -> term simtermRem
     * simtermRem -> e | highPriorityOp term simtermRem
     */
    private simTerm(): boolean {
        if (this.isEmpty()) {
            return false;
        }

        return this.term() && this.simTermRem();
    }

    /**
     * term -> (expression) | + term | - term | not term | ! term | ident | number | true | false | string
     */
    private term(): boolean {
        if (this.isEmpty()) {
            return false;
        }

        if (this.peekToken().type === TokenType.ID) {
            return this.ident();
        }

        const tokenType = this.getToken().type;

        if (tokenType === TokenType.PARAN_OPEN) {
            return this.expression() && ((!this.isEmpty() && this.getToken().type === TokenType.PARAN_CLOSE) || this.panic(LexerError.PARAN_CLOSE_EXPECTED));
        }

        if (tokenType === TokenType.OP_PLUS
            || tokenType === TokenType.OP_MINUS
            || tokenType === TokenType.OP_NOT
            || tokenType === TokenType.OP_NOT_MARK) {
            return this.term();
        }

        if (tokenType === TokenType.INTEGER
            || tokenType === TokenType.FLOAT
            || tokenType === TokenType.TRUE
            || tokenType === TokenType.FALSE
            || tokenType === TokenType.STRING_LITERAL) {
            return true;
        }

        return this.panic(LexerError.TERM_EXPECTED);
    }
}

export default Parser;