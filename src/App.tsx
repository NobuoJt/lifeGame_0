import { useState } from 'react'
import packageJson from "../package.json"
import './App.css'



/**再描画フラグ。ないと無限ループ。*/
let table_mapped=false; 

document.title+=` (${packageJson.version})`
console.log(`version=(${packageJson.version})`)

/** メイン。再描画時に呼ばれる */ 
function App() {

  const [row_length,setRowLength]=useState(20)  //行row数の管理
  const [col_length,setColLength]=useState(20)  //列col数の管理

  const [randomize,setRandomize]=useState(50)  //列col数の管理

  const [tableData,setTableData]=useState([[false]])  //盤面データの管理

  if(table_mapped===false){   //盤面ランダム化
    setTableRandom(0)
  }

  return (  //DOM挿入
    <>
      <div id="playArea"> {/**盤面*/}
        <table><tbody>
        {function(){

          const row_data=[]  //行データ
          let col_data=[]    //列データ

            for(let r=0;r<row_length;r++){//行ごと
              col_data=[]

              for(let c=0;c<col_length;c++){  //列ごと
                if(tableData[r]!==undefined){ //null参照回避
                  col_data.push(              //セルボタン設定
                    <td key={"r"+c}>
                      <button id="mainSwitch" 
                              style={{backgroundColor:tableData[r][c]?'yellow':'midnightblue'}}//tableDataに応じて青赤変化
                              onClick={()=>{setTableData(
                                tableData.map((row,c_ind)=>(  //列で走査
                                  c_ind==r?row.map(           //当該列・行で走査
                                    (col,r_ind)=>r_ind==c     //当該行
                                      ?!col:col               //反転・else非反転
                                  ):row                       //else非反転
                                )))}}
                              >
                      </button>
                    </td>
                  )
                }
              }
              row_data.push(  //行データへ列データ押し込み
                <tr key={"c"+r}>
                  {col_data}
                </tr>
              )
            }
            return row_data   //列行データ
        }()}
        </tbody></table>
        
      </div>
      
      <div id="menu">   {/** 下部設定エリア */}
        <div id="table_cnt">
          <p>row count</p>
          <input type="number" value={row_length} onChange={(e)=>{table_mapped=false;setRowLength(Number(e.target.value))}}></input>
          <p>col count</p>
          <input type="number" value={col_length} onChange={(e)=>{table_mapped=false;setColLength(Number(e.target.value))}}></input>
        </div>
        <button id="next" onClick={()=>{nextPhase()}}>next step</button>

        <button id="reset" onClick={()=>{setTableRandom(0)}}>death fill</button>
        <input type="number" value={randomize} onChange={(e)=>{setRandomize(Number(e.target.value))}}></input>
        <p>% random</p>
        <button id="reset" onClick={()=>{setTableRandom(randomize/100)}}>randomize</button>
      </div>
    </>
  )

/** プログラム領域 */

function setTableRandom(randomize=0){
  const row_data:boolean[][]=[]  //行データ
  let   col_data:boolean[]=[]    //列データ

  for(let c=0;c<row_length;c++){
    col_data=[]
    for(let r=0;r<col_length;r++){    
      col_data.push(Math.random()<randomize) //乱数により生成
    }
    row_data.push(col_data)
  }
  table_mapped=true
  setTableData(row_data)   //盤面更新
}

function nextPhase(){
  const new_table_data=tableData.map((row_data,ri)=>{ //列走査
    return row_data.map((_col_data,ci)=>{              //行走査
      if(tableData[ri][ci]){//当該セル生状態

      /** 隣接セルがいきているか否か */
      let live_count_near=0
      if(getTableDataWithOffset(tableData,ri,ci,-1,-1)){live_count_near++}  //左上
      if(getTableDataWithOffset(tableData,ri,ci,-1, 0)){live_count_near++}  //上
      if(getTableDataWithOffset(tableData,ri,ci,-1, 1)){live_count_near++}  //右上
      if(getTableDataWithOffset(tableData,ri,ci,0, -1)){live_count_near++}  //左
      if(getTableDataWithOffset(tableData,ri,ci,0,  1)){live_count_near++}  //右
      if(getTableDataWithOffset(tableData,ri,ci,1, -1)){live_count_near++}  //右下
      if(getTableDataWithOffset(tableData,ri,ci,1,  0)){live_count_near++}  //下
      if(getTableDataWithOffset(tableData,ri,ci,1,  1)){live_count_near++}  //左下


      if(live_count_near<=1){return false}  //過疎死
      if(live_count_near>=4){return false}  //過密死
      return true //生存

    }else{//当該セル死状態
      /** 隣接セルがいきているか否か */
      let live_count_near=0
      if(getTableDataWithOffset(tableData,ri,ci,-1,-1)){live_count_near++}  //左上
      if(getTableDataWithOffset(tableData,ri,ci,-1, 0)){live_count_near++}  //上
      if(getTableDataWithOffset(tableData,ri,ci,-1, 1)){live_count_near++}  //右上
      if(getTableDataWithOffset(tableData,ri,ci,0, -1)){live_count_near++}  //左
      if(getTableDataWithOffset(tableData,ri,ci,0,  1)){live_count_near++}  //右
      if(getTableDataWithOffset(tableData,ri,ci,1, -1)){live_count_near++}  //右下
      if(getTableDataWithOffset(tableData,ri,ci,1,  0)){live_count_near++}  //下
      if(getTableDataWithOffset(tableData,ri,ci,1,  1)){live_count_near++}  //左下
      if(live_count_near==3){return true} //誕生
      return false    //死亡状態継続
    }
      
    })
  })
  setTableData(new_table_data)
  return null
}

/** tableのセル取得関数(指定indexループ) */
function getTableDataWithOffset(
  table: boolean[][],
  rowIndex: number,
  colIndex: number,
  rowOffset: number,
  colOffset: number
): boolean {
  const rowLength = table.length;
  const colLength = table[0].length;

  // 負の数にも対応した mod 計算
  const wrap = (i: number, length: number): number =>
    ((i % length) + length) % length;

  const row = wrap(rowIndex + rowOffset, rowLength);
  const col = wrap(colIndex + colOffset, colLength);

  return table[row][col];
}



}

export default App


