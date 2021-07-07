import range from "../util/range";

export type SudokuFieldId = { i: number, j: number }
export type SudokuBoxId = { ib: number, jb: number }
export type SudokuBoxFieldId = { ix: number, jx: number }


export default class SudokuAny<AType> {
    constructor(readonly base: number, readonly data: AType[][]) {
    }

    length(): number {
        return this.base * this.base
    }

    baseRange(): number[] {
        return range(0, this.base-1);
    }

    fieldRange(): number[] {
        return range(0, this.length()-1);
    }
    
    boxesRange(): SudokuBoxId[] {
        const baseArray = this.baseRange()
        return baseArray.flatMap(ib => baseArray.map(jb => ({ib, jb})))
    }
    
    boxFieldsFlatRange(): SudokuBoxFieldId[] {
        const baseArray = this.baseRange()
        return baseArray.flatMap(ix => baseArray.map(jx => ({ix, jx})))
    }

    copy(): SudokuAny<AType> {
        const d = this.data.map(r => r.map(v => v))
        // @ts-ignore
        return new SudokuAny<AType>(this.base, d)
    }
    
    copySetElement(i_n: number, j_n: number, v_n: AType): SudokuAny<AType> {
        const d = this.data.map((r, i) => r.map((v, j) => {
            if (i_n === i && j_n === j) {
                return v_n
            } else {
                return v
            }
        }))
        // @ts-ignore
        return new SudokuAny<AType>(this.base, d)
    }

    getValue(i: number, j: number): AType {
        return this.data[i][j]
    }

    getRow(i: number): Array<AType> {
        return this.data[i]
    }

    getColumn(j: number): Array<AType> {
        return this.data.map(r => r[j])
    }

    getBox(boxId: SudokuBoxId): AType[] {
        const ib = boxId.ib;
        const jb = boxId.jb;
        let result: AType[] = []
        for (let ix = 0; ix < this.base; ix++) {
            for (let jx = 0; jx < this.base; jx++) {
                result.push(this.data[ib * this.base + ix][jb * this.base + jx])
            }
        }
        return result
    }

    getBoxId(field: SudokuFieldId) {
        return {ib: Math.floor(field.i / this.base), jb: Math.floor(field.j / this.base)}
    }

    getFieldCoordsByBoxIds(boxId: SudokuBoxId, fieldId: SudokuBoxFieldId): SudokuFieldId {
        return {i: boxId.ib * this.base + fieldId.ix, j: boxId.jb * this.base + fieldId.jx}
    }

    mapSudoku<A>(fn: (v: AType, i: number, j: number, sd: SudokuAny<AType>) => A): SudokuAny<A> {
        let result = []
        for (let i = 0; i < this.length(); i++) {
            let col = []
            for (let j = 0; j < this.length(); j++) {
                col.push(fn(this.data[i][j], i, j, this))
            }
            result.push(col)
        }
        return new SudokuAny<A>(this.base, result)
    }

    forEachField(fn: (v: AType, i: number, j: number, sd: SudokuAny<AType>) => boolean|void) {
        for (let i = 0; i < this.length(); i++) {
            for (let j = 0; j < this.length(); j++) {
                if (fn(this.data[i][j], i, j, this) === false) {
                    return;
                }
            }
        }
    }

    reduceSudoku<A>(fn: (v: AType, i: number, j: number, sd: SudokuAny<AType>, agg: A) => A, aggInit: A): A {
        let agg = aggInit
        for (let i = 0; i < this.length(); i++) {
            for (let j = 0; j < this.length(); j++) {
                agg = fn(this.data[i][j], i, j, this, agg);
            }
        }
        return agg;
    }
}