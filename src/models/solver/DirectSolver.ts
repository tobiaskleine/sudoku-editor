import {SudokuSolverBase} from "./SudokuSolverBase";
import Sudoku, {SudokuElement} from "../Sudoku";


function getPossibilities(v: SudokuElement, i: number, j: number, sd: Sudoku): SudokuElement[] {
    if (v === 'error') return [v]
    if (v !== null) return [v]
    const rowV = sd.getRow(i)
    const colV = sd.getColumn(j)
    const boxV = sd.getBox(sd.getBoxId({i, j}))
    return sd.valuesRange().filter(v =>
        rowV.indexOf(v) === -1 &&
        colV.indexOf(v) === -1 &&
        boxV.indexOf(v) === -1
    )
}

// solve all fields where only one possibility is left
export default class DirectSolver implements SudokuSolverBase {
    solve(sd: Sudoku): Sudoku {
        let solved = sd.copy()
        sd.forEachField((v, i, j, sd) => {
            let poss = getPossibilities(v, i, j, solved)
            if (poss.length === 1) {
                solved = solved.copySetElement(i, j, poss[0])
            } else if (poss.length === 0) {
                solved = solved.copySetElement(i, j, 'error')
            } else {
                solved = solved.copySetElement(i, j, null)
            }
        })
        return solved
    }
}