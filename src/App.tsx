import { useState } from 'react'
import './App.css'

function App() {

  const [cols,setCols]=useState(8)
  const [rows,setRows]=useState(8)

  return (
    <>
      <div id="playArea">
        <table>
        {function(){
          const col=[]
          let row=[]
            for(let i=0;i<cols;i++){
              row=[]
              for(let i=0;i<rows;i++){
                row.push(
                  <td>
                    <button id="mainSwitch" ></button>
                  </td>
                )
              }
              col.push(
                <tr>
                  {row}
                </tr>
              )
            }
            return col
        }()}
        </table>
        
      </div>
      <div id="menu">
        <p>col count</p>
        <input type="number" value={cols} onChange={(e)=>setCols(Number(e.target.value))}></input>
        <p>row count</p>
        <input type="number" value={rows} onChange={(e)=>setRows(Number(e.target.value))}></input>
      </div>
    </>
  )
}

export default App
