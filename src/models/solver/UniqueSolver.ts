import {SudokuSolverBase} from "./SudokuSolverBase";
import Sudoku, {SudokuElement, SudokuNumber} from "../Sudoku";
import SudokuAny from "../SudokuAny";

function getPossibilities(v: SudokuElement, i: number, j: number, sd0: SudokuAny<SudokuElement>): SudokuElement[] {
    if (v === 'error') return [v]
    if (v !== null) return [v]
    // @ts-ignore
    const sd: Sudoku = sd0
    const rowV = sd.getRow(i)
    const colV = sd.getColumn(j)
    const boxV = sd.getBox(sd.getBoxId({i, j}))
    return sd.valuesRange().filter(v =>
        rowV.indexOf(v) === -1 &&
        colV.indexOf(v) === -1 &&
        boxV.indexOf(v) === -1
    )
}

function findUniqueSinglePossibility(v: SudokuNumber, possibilities: SudokuElement[][]): SudokuNumber {
    let found = -1;
    let uniqueAndSingle = true;
    if (!possibilities) debugger;
    possibilities.forEach((poss, j) => {
        const inx = poss.indexOf(v)
        if (inx >= 0) {
            uniqueAndSingle = uniqueAndSingle && (poss.length > 1) && (found === -1)
            found = j
            if (!uniqueAndSingle) {
                return false
            }
        }
    })
    if (!uniqueAndSingle) {
        return -1
    }
    return found
}

// solve all fields where a value fits only to one field in a row/column/box 
export default class UniqueSolver implements SudokuSolverBase {
    solve(sd: Sudoku): Sudoku {
        const sdPoss: SudokuAny<SudokuElement[]> = sd.mapSudoku(getPossibilities)
        console.log('sdPoss', sdPoss);
        let solved = sd.copy()
        const rows = sd.fieldRange()
        const cols = sd.fieldRange()
        const boxes = sd.boxesRange()
        const vals = sd.valuesRange()
        // rows
        rows.forEach(i => {
            // const unsolvedPoss = getUnsolvedByRow(sd, i)
            const rowPoss = sdPoss.getRow(i)
            vals.forEach(v => {
                const inx = findUniqueSinglePossibility(v, rowPoss)
                if (inx >= 0) {
                    // new solution
                    // console.log('rowPoss', rowPoss)
                    //console.log('found unique row solution', i, inx, valueToChar(v))
                    // printSudoku(solved)
                    solved = solved.copySetElement(i, inx, v)
                    sdPoss.copySetElement(i, inx, [v])
                }
            })
        })
        // cols
        cols.forEach(j => {
            // const unsolvedPoss = getUnsolvedByRow(sd, i)
            vals.forEach(v => {
                const rowPoss = sdPoss.getColumn(j)
                const inx = findUniqueSinglePossibility(v, rowPoss)
                if (inx >= 0) {
                    // new solution
                    // console.log('rowPoss', rowPoss)
                    //console.log('found unique column solution', inx, j, valueToChar(v))
                    // printSudoku(solved)
                    solved = solved.copySetElement(inx, j, v)
                    sdPoss.copySetElement(inx, j, [v])
                }
            })
        })
        // cols
        const boxFieldsFlatRange = solved.boxFieldsFlatRange()
        boxes.forEach(boxId => {
            // const unsolvedPoss = getUnsolvedByRow(sd, i)
            vals.forEach(v => {
                const boxPoss = sdPoss.getBox(boxId)
                const inx = findUniqueSinglePossibility(v, boxPoss)
                if (inx >= 0) {
                    // new solution
                    //console.log('boxPoss', boxPoss)
                    //console.log('found unique box solution', boxId, inx, valueToChar(v))
                    //printSudoku(solved)
                    //console.log('boxField', boxFields[inx])
                    const f = sdPoss.getFieldCoordsByBoxIds(boxId, boxFieldsFlatRange[inx])
                    solved = solved.copySetElement(f.i, f.j, v)
                }
            })
        })
        return solved
    }
}