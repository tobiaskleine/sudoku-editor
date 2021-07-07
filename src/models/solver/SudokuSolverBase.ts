import Sudoku from "../Sudoku";
import {SudokuFieldId} from "../SudokuAny";

export type SolverError = {
    error: string,
    details?: string,
    conflicts?: SudokuFieldId[]
}

export interface SudokuSolverBase {
    solve(sd: Sudoku): Sudoku;
}
