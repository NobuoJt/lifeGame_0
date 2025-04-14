import { useState } from 'react'
import packageJson from "../package.json"
import './App.css'



/**再描画フラグ。ないと無限ループ。*/
let table_mapped=false; 

document.title+=` (${packageJson.version})`
console.log(`version=(${packageJson.version})`)

/** メイン。再描画時に呼ばれる */ 
function App() {

  const [col_length,setColLength]=useState(20)  //列col数の管理
  const [row_length,setRowLength]=useState(35)  //行row数の管理

  const [tableData,setTableData]=useState([[false]])  //盤面データの管理

  if(table_mapped===false){   //盤面ランダム化

    const col_data:boolean[][]=[]  //列データ
    let   row_data:boolean[]=[]    //行データ

    for(let c=0;c<col_length;c++){
      row_data=[]
      for(let r=0;r<row_length;r++){    
        row_data.push(Math.random()>0.5) //乱数により生成
      }
      col_data.push(row_data)
    }
    table_mapped=true
    setTableData(col_data)   //盤面更新
}

  return (  //DOM挿入
    <>
      <div id="playArea"> {/**盤面*/}
        <table><tbody>
        {function(){

          const col_data=[]  //列データ
          let row_data=[]    //行データ

            for(let c=0;c<col_length;c++){//列ごと
              row_data=[]

              for(let r=0;r<row_length;r++){  //行ごと
                if(tableData[c]!==undefined){ //null参照回避
                  row_data.push(              //セルボタン設定
                    <td key={"r"+r}>
                      <button id="mainSwitch" 
                              style={{backgroundColor:tableData[c][r]?'blue':'red'}}//tableDataに応じて青赤変化
                              onClick={()=>{setTableData(
                                tableData.map((col,c_ind)=>(  //行で走査
                                  c_ind==c?col.map(           //当該行・列で走査
                                    (row,r_ind)=>r_ind==r     //当該列
                                      ?!row:row               //反転・else非反転
                                  ):col                       //else非反転
                                )))}}
                              >
                      </button>
                    </td>
                  )
                }
              }
              col_data.push(  //列データへ行データ押し込み
                <tr key={"c"+c}>
                  {row_data}
                </tr>
              )
            }
            return col_data   //行列データ
        }()}
        </tbody></table>
        
      </div>
      
      <div id="menu">   {/** 下部設定エリア */}
        <p>col count</p>
        <input type="number" value={col_length} onChange={(e)=>{table_mapped=false;setColLength(Number(e.target.value))}}></input>
        <p>row count</p>
        <input type="number" value={row_length} onChange={(e)=>{table_mapped=false;setRowLength(Number(e.target.value))}}></input>
        <p>phase change</p>
        <button onClick={()=>{nextPhase()}}>next phase</button>
      </div>
    </>
  )
}

export default App


/** プログラム領域 */

function nextPhase(){
  return
}