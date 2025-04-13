import { useState } from 'react'
import './App.css'

/**再描画フラグ。ないと無限ループ。*/
let table_mapped=false; 

/** メイン。再描画時に呼ばれる */ 
function App() {

  const [cols,setCols]=useState(20)  //列col数の管理
  const [rows,setRows]=useState(35)  //行row数の管理

  const [tableData,setTableData]=useState([[false]])  //盤面データの管理

  if(table_mapped===false){   //盤面ランダム化

    const colData:boolean[][]=[]  //列データ
    let rowData:boolean[]=[]      //行データ
    for(let c=0;c<cols;c++){
      rowData=[]
      for(let r=0;r<rows;r++){    
        rowData.push(Math.random()>0.5) //乱数により生成
      }
      colData.push(rowData)
    }
    table_mapped=true
    setTableData(colData)   //盤面更新
}

  return (  //DOM挿入
    <>
      <div id="playArea"> {/**盤面*/}
        <table>
        {function(){

          const col=[]  //列データ
          let row=[]    //行データ

            for(let c=0;c<cols;c++){//列ごと
              row=[]

              for(let r=0;r<rows;r++){ //行ごと
                if(tableData[c]!==undefined){//null参照回避
                  row.push(//セルボタン設定
                    <td>
                      <button id="mainSwitch" 
                              style={{backgroundColor:tableData[c][r]?'blue':'red'}}
                              onClick={()=>{setTableData(
                                tableData.map((col,c_ind)=>(
                                  c_ind==c?col.map(
                                    (row,r_ind)=>r_ind==r?!row:row
                                  ):col
                                )))}}
                              >

                      </button>
                    </td>
                  )
                }
              }
              col.push(//列データへ行データ押し込み
                <tr>
                  {row}
                </tr>
              )
            }
            return col
        }()}
        </table>
        
      </div>
      
      <div id="menu">   {/** 下部設定エリア */}
        <p>col count</p>
        <input type="number" value={cols} onChange={(e)=>{table_mapped=false;setCols(Number(e.target.value))}}></input>
        <p>row count</p>
        <input type="number" value={rows} onChange={(e)=>{table_mapped=false;setRows(Number(e.target.value))}}></input>
      </div>
    </>
  )
}

export default App
