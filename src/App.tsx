import { useState } from 'react'
import packageJson from "../package.json"
import './App.css'



/**再描画フラグ。ないと無限ループ。*/
let table_mapped=false; 

/** リセットからの世代カウント */
let phase_counter=0

/** auto stepのタイマー情報 */
let interval_ids:NodeJS.Timeout[]=[]

if(!document.title.match(packageJson.version)){
  document.title+=` (${packageJson.version})`
  console.log(`version=(${packageJson.version})`)
}
/** メイン。再描画時に呼ばれる */ 
function App() {

  const [row_length,setRowLength]=useState(20)  //行row数の管理
  const [col_length,setColLength]=useState(20)  //列col数の管理

  const [randomize,setRandomize]=useState(50)  //ランダム生成%
  const [interval_time,setIntervalTime]=useState(500)  //自動ステップインターバル時間
  

  const [tableData,setTableData]=useState([[false]])  //盤面データの管理
  const [live_count,setLiveCount]=useState(0)  //盤面生存数の管理
  const [barth_count,setBarthCount]=useState(0)  //盤面誕生数の管理
  const [death_count,setDeathCount]=useState(0)  //盤面死亡数の管理

  const [type2ShowPlayArea,setType2ShowPlayArea]=useState("button")  //メイン画面表示方法

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
                      {function(){
                        if(type2ShowPlayArea=="button"){
                        return <button id="mainSwitch" 
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
                        }
                        if(type2ShowPlayArea=="tile"){
                          return <div style={{backgroundColor:tableData[r][c]?'yellow':'midnightblue'}}></div>
                        }
                        if(type2ShowPlayArea=="none"){return <div></div>}
                        return <div></div>
                      }()}
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
        <div id="table_cnt_out">
          <p> Count<br></br>Set </p>
          <div id="table_cnt_in">
            <p>Row</p>
            <input type="number" value={row_length} onChange={(e)=>{table_mapped=false;setRowLength(Number(e.target.value))}}></input>
            <p>Col</p>
            <input type="number" value={col_length} onChange={(e)=>{table_mapped=false;setColLength(Number(e.target.value))}}></input>
          </div>
        </div>

        <div id="phase">
          <button id="next" onClick={()=>{nextPhase()}}>Next<br></br>step</button>
          <p> Step: {phase_counter}</p>
        </div>

        <div id="auto_step">
          <p> Step time(ms) </p>
          <input type="number" id="step_time" value={interval_time} onChange={(e)=>{setIntervalTime(Number(e.target.value))}}></input>
          <p> AutoStep<br></br>run</p>
          <input type="checkbox" id="hasAuto" onChange={()=>{handleInterval()}}></input>
        </div>

        <div id="reset">
          <button id="reset" onClick={()=>{setTableRandom(0)}}>Kill ALL</button>
          <div id='random'>
            <input type="number" value={randomize} onChange={(e)=>{setRandomize(Number(e.target.value))}}></input>
            <p>% </p>
            <button id="Random" onClick={()=>{setTableRandom(randomize/100)}}>randomize</button>
          </div>
        </div>

        <div id="stat">
          <p id="lives">Live:<br></br>{live_count}</p>
          <p id="barthes">Barth:<br></br>{barth_count}</p>
          <p id="deaths">Death:<br></br>{death_count}</p>
        </div>
        <div id="button_show">
          <p>ShowAs</p>
          <select id="show_as" onChange={()=>{handleShowAsButton()}}>
            <option value="button">Button</option>
            <option value="none">None</option>
            <option value="tile">Tile</option>
            <option value="stat">Stat</option>
            <option value="option">Option</option>
            <option value="graph">Graph</option>
          </select>
        </div>
      </div>
    </>
  )

/** プログラム領域 */

function handleInterval(){
  const has_auto_elem=document.getElementById("hasAuto") as HTMLInputElement
  if(has_auto_elem.checked){
    interval_ids.push(
        setInterval(() => {
        nextPhase()
      }, interval_time)
    )
    /*nextPhase()
    setTimeout(handleInterval,interval_time)*/
  }else{
    interval_ids.forEach((id)=>{
      
      clearInterval(id)
    })
    interval_ids=[]
  }
}

function handleShowAsButton(){
  const elem=document.getElementById("show_as") as HTMLInputElement
  setType2ShowPlayArea(elem.value)
}

function setTableRandom(randomize=0){
  phase_counter=0
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
  let new_table_data:boolean[][]
  let ch_flag=false//変更あり?
  let live_count_local=0
  let barth_count_local=0
  let death_count_local=0

  let prev_table_data:boolean[][]=[[]]
  setTableData(p=>{ //prevStateを使うためにアロー関数
    prev_table_data=p
    

    if(ch_flag==true){
      return new_table_data
    }
  
    new_table_data=prev_table_data.map((row_data,ri)=>{ //列走査
      return row_data.map((_col_data,ci)=>{              //行走査
        if(prev_table_data[ri][ci]){//当該セル生状態
        /** 隣接セルがいきているか否か */
        let live_count_near=0
        if(getTableDataWithOffset(prev_table_data,ri,ci,-1,-1)){live_count_near++}  //左上
        if(getTableDataWithOffset(prev_table_data,ri,ci,-1, 0)){live_count_near++}  //上
        if(getTableDataWithOffset(prev_table_data,ri,ci,-1, 1)){live_count_near++}  //右上
        if(getTableDataWithOffset(prev_table_data,ri,ci,0, -1)){live_count_near++}  //左
        if(getTableDataWithOffset(prev_table_data,ri,ci,0,  1)){live_count_near++}  //右
        if(getTableDataWithOffset(prev_table_data,ri,ci,1, -1)){live_count_near++}  //右下
        if(getTableDataWithOffset(prev_table_data,ri,ci,1,  0)){live_count_near++}  //下
        if(getTableDataWithOffset(prev_table_data,ri,ci,1,  1)){live_count_near++}  //左下


        if(live_count_near<=1){ch_flag=true;death_count_local++;return false}  //過疎死
        if(live_count_near>=4){ch_flag=true;death_count_local++;return false}  //過密死
        live_count_local++
        return true //生存

      }else{//当該セル死状態
        /** 隣接セルがいきているか否か */
        let live_count_near=0
        if(getTableDataWithOffset(prev_table_data,ri,ci,-1,-1)){live_count_near++}  //左上
        if(getTableDataWithOffset(prev_table_data,ri,ci,-1, 0)){live_count_near++}  //上
        if(getTableDataWithOffset(prev_table_data,ri,ci,-1, 1)){live_count_near++}  //右上
        if(getTableDataWithOffset(prev_table_data,ri,ci,0, -1)){live_count_near++}  //左
        if(getTableDataWithOffset(prev_table_data,ri,ci,0,  1)){live_count_near++}  //右
        if(getTableDataWithOffset(prev_table_data,ri,ci,1, -1)){live_count_near++}  //右下
        if(getTableDataWithOffset(prev_table_data,ri,ci,1,  0)){live_count_near++}  //下
        if(getTableDataWithOffset(prev_table_data,ri,ci,1,  1)){live_count_near++}  //左下
        if(live_count_near==3){ch_flag=true;live_count_local++;barth_count_local++;return true} //誕生
        return false    //死亡状態継続
      }
        
      })
    })

    setLiveCount(()=>live_count_local)
    setBarthCount(()=>barth_count_local)
    setDeathCount(()=>death_count_local)

    if(ch_flag){
      phase_counter++;
      return(new_table_data)
    }else{
      return(prev_table_data)
    }
  })

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


