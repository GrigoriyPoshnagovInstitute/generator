type NonTerminal = {
    name: string
    type: 'nonTerminal'
}

type Terminal = {
    name: string
    type: 'terminal'
}

type Symbol = (NonTerminal | Terminal)

type Rule = {
    nonTerminal: NonTerminal
    result: Symbol[][]
}

type ParsedElement = NonTerminal | Terminal

type TableRow = {
    index: number,
    symbol: string,
    directingSymbols: string[]
    shift: boolean,
    error: boolean,
    pointer: number | null,
    putInStack: boolean,
    endOfParsing: boolean,
}

type Table = TableRow[]

export {
    type NonTerminal,
    type Terminal,
    type Rule,
    type ParsedElement,
    type Symbol,
    type TableRow,
    type Table,
}
