import React from 'react';
import styles from './SudokuGrid.module.scss'
import Sudoku from "../../models/Sudoku";
import CharacterMapping from "../../models/CharacterMapping";
import SudokuAny from "../../models/SudokuAny";

export type ShowHint = {
    isNew: boolean
}

type Props = {
    sudoku: Sudoku,
    showHints?: SudokuAny<ShowHint>
    characterMapping?: CharacterMapping
}

function SudokuGrid(props: Props) {
    const sd = props.sudoku.data
    const cm = props.characterMapping || new CharacterMapping()
    const showHints = props.showHints
    return <div>
        <table className={styles.table}>
            {sd.map((r, i) => <tr key={'sdrow'+i}>
                {r.map((v, j) => 
                    <td key={'sdrow'+i+'col'+j} className={(showHints && showHints.getValue(i,j).isNew) ? styles.isNew : ''}>{cm.valueToChar(v)}</td>
                )}
            </tr>)}
        </table>
    </div>
}

export default SudokuGrid;