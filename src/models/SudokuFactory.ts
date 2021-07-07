import Sudoku, {SudokuElement} from "./Sudoku";
import CharacterMapping from "./CharacterMapping";


export default class SudokuFactory {
    
    static readFromString(str: string, characterMapping: CharacterMapping|undefined = undefined): Sudoku {
        const cm = characterMapping || new CharacterMapping()
        const data = str.split('\n').map(s => s.split('').map(c => cm.charToValue(c)))
        const base = Math.sqrt(data.length)
        return new Sudoku(base, data)
    }
    
}