import SudokuAny from "./SudokuAny";

export type SudokuNumber = number
export type SudokuElement = (SudokuNumber | "error" | null)

export default class Sudoku extends SudokuAny<SudokuElement>{
    valuesRange(): SudokuNumber[] {
        let ans = [];
        for (let i = 1; i <= this.length(); i++) {
            ans.push(i);
        }
        return ans;
    }


    copy(): Sudoku {
        const d = this.data.map(r => r.map(v => v))
        // @ts-ignore
        return new Sudoku(this.base, d)
    }

    copySetElement(i_n: number, j_n: number, v_n: SudokuElement): Sudoku {
        const d = this.data.map((r, i) => r.map((v, j) => {
            if (i_n === i && j_n === j) {
                return v_n
            } else {
                return v
            }
        }))
        // @ts-ignore
        return new Sudoku(this.base, d)
    }
}