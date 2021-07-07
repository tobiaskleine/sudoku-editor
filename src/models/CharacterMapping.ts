import {SudokuElement} from "./Sudoku";


export default class CharacterMapping {
    charToValue(c: string): SudokuElement {
        if (c === '0') return null
        if (c === ' ') return null
        if (c >= '1' && c <= '9') return parseInt(c)
        if (c >= 'A' && c <= 'Z') return c.charCodeAt(0)-65+10;
        return 'error';
    }

    valueToChar(v: SudokuElement): string {
        if (v === null) return ' '
        if (v === 'error') return '!'
        if (v < 10) return '' + v
        return String.fromCharCode(65 + v - 10);
    }
}