import { useState } from 'react'
import packageJson from "../package.json"
import './App.css'



/**再描画フラグ。ないと無限ループ。*/
let table_mapped=false; 

/** リセットからの世代カウント */
let phase_counter=0


/** stepごとの蓄積データ */
let stat_log:{phase_counter:number,row_length:number,col_length:number,live_count:number,barth_count:number,death_count:number}[]=[]

/** auto stepのタイマー情報 */
let interval_ids:NodeJS.Timeout[]=[]

/** リセット時のデータ */
let dataAtReset:string=""

/** バージョン情報の表示 */
if(!document.title.match(packageJson.version)){
  document.title+=` (${packageJson.version})`
  console.log(`version=(${packageJson.version})`)
}


/** メイン。再描画時に呼ばれる */ 
function App() {

  /** 表示用ステート管理 */

  const [row_length,setRowLength]=useState(20)  //行row数の管理
  const [col_length,setColLength]=useState(20)  //列col数の管理

  const [randomize,setRandomize]=useState(50)  //ランダム生成%
  const [interval_time,setIntervalTime]=useState(500)  //自動ステップインターバル時間
  
  const [tableData,setTableData]=useState([[false]])  //盤面データの管理
  const [live_count,setLiveCount]=useState(0)  //盤面生存数の管理
  const [barth_count,setBarthCount]=useState(0)  //盤面誕生数の管理
  const [death_count,setDeathCount]=useState(0)  //盤面死亡数の管理

  const [type2ShowPlayArea,setType2ShowPlayArea]=useState("button")  //メイン画面表示方法

  const [hasLoop,setLoop]=useState(true)  //画面端を逆側にループさせるか

  const [stringed_json,setStringedJson]=useState("")   //インポート・エクスポート用の文字列データ


  let mainContent=<></> //メインコンテンツ用のJSX

  if(table_mapped===false){   //盤面ランダム化
    setTableRandom(0)
  }

  /** 描画関連 */

  /** コンテンツ：オプション */

  if(type2ShowPlayArea=="option"){
    mainContent=<div id="option_area">
      <h1>Option</h1>
      <p>Version: {packageJson?.version}</p>
      <p>Author: {packageJson?.author}</p>
      <p>License: {packageJson?.license}</p>
      <p>Repository: {packageJson?.repository?.url}</p>
      <p>Copyright: {packageJson?.copyright}</p>
    </div>
  }

  /** コンテンツ：インポート・エクスポート */
  if(type2ShowPlayArea=="ExportImport"){
    mainContent=<div id="export_import_area">
      <button id="export" title="JSON形式で現状のデータを出力" onClick={exportJson}>Export JSON</button>
      <button id="import" title="JSON形式で入力したデータを適用" onClick={importJson}>Import JSON</button>
      <button id="export_at_reset" title="JSON形式で初期化時ののデータを出力" onClick={exportJsonAtReset}>Export JSON at Reset</button>
      <button id="export_table_csv" title="CSV形式で盤面を出力" onClick={exportTableCsv}>Export Table CSV</button>
      <button id="import_table_csv" title="CSV形式で入力した盤面を適用" onClick={importTableCsv}>Import Table CSV</button>
      <button id="show_stat_log" onClick={showStatLog}>Show Stat Log</button>

      <textarea id="export" title="入出力エリア" onChange={(e)=>{setStringedJson(e.target.value)}} value={stringed_json}></textarea>
      </div>
  }

  /** コンテンツ；盤面出力 */
  if(type2ShowPlayArea=="button"||type2ShowPlayArea=="none"||type2ShowPlayArea=="tile"){/*メインコンテンツ=盤面*/
    mainContent=        
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
                          onClick={()=>{phase_counter=0;setDataAtReset()
                            setTableData(
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
  }



//** ベースJSX ここでコンテンツをあわせる */
  return (  //DOM挿入
    <>
      <div id="playArea"> {/**盤面*/}
        {mainContent/*メインコンテンツ*/}
        
      </div>
      
      <div id="menu">   {/** 下部設定エリア */}

      <div id="button_show" title="上部画面の表示モード選択" >
          <p>Mode</p>
          <select id="show_as" title="上部画面の表示モード選択" onChange={()=>{handleShowAsButton()}}>
            <option value="button" title="クリック可能な盤面">Button</option>
            <option value="none" title="無表示">None</option>
            <option value="tile" title="クリック不可能な盤面(全体表示)">Tile</option>
            <option value="ExportImport" title="データの入出力">Ex/Import</option>
            <option value="option" title="設定">Option</option>
            <option value="graph" title="グラフ出力">Graph</option>
          </select>
        </div>

        <div id="phase" >
          <button id="next" title="ステップ進行ボタン"  onClick={()=>{nextPhase()}}>Next<br></br>step</button>
          <p title="ステップカウント" > Step: {phase_counter}</p>
          <div title="盤面の両端をループさせるか否か">
            <p>Opposite loop</p>
            <input type="checkbox" id="hasLoop" checked={hasLoop} onChange={()=>{setLoop(!hasLoop)}}></input>
          </div>
        </div>

        <div id="auto_step" title="自動ステップの設定">
          <p> Step time(ms) </p>
          <input type="number" id="step_time" title="自動ステップ時間" value={interval_time} onChange={(e)=>{setIntervalTime(Number(e.target.value))}}></input>
          <p> AutoStep<br></br>run</p>
          <input type="checkbox" id="hasAuto" title="自動ステップ有効化" onChange={()=>{handleInterval()}}></input>
        </div>

        <div id="reset">
          <button id="reset" title="盤面全削除" onClick={()=>{setTableRandom(0)}}>Kill ALL</button>
          <div id='random' title="ランダム化">
            <input type="number" title="ランダム率" value={randomize} onChange={(e)=>{setRandomize(Number(e.target.value))}}></input>
            <p>% </p>
            <button id="Random" title="ランダム化実行" onClick={()=>{setTableRandom(randomize/100)}}>randomize</button>
          </div>
        </div>

        <div id="stat" title="統計情報">
          <p id="lives" title="今ステップ生存数">Live:<br></br>{live_count}</p>
          <p id="barthes" title="今ステップ誕生数">Barth:<br></br>{barth_count}</p>
          <p id="deaths" title="今ステップ死亡数">Death:<br></br>{death_count}</p>
        </div>

        <div id="table_cnt_out" title="盤面サイズ変更">
          <p> Count<br></br>Set </p>
          <div id="table_cnt_in">
            <p>Row</p>
            <input type="number" title="行数(盤面リセット)" value={row_length} onChange={(e)=>{table_mapped=false;setRowLength(Number(e.target.value))}}></input>
            <p>Col</p>
            <input type="number" title="列数(盤面リセット)" value={col_length} onChange={(e)=>{table_mapped=false;setColLength(Number(e.target.value))}}></input>
          </div>
          <button title="拡張(盤面維持)" onClick={extend}>Extend</button>
        </div>
      </div>
    </>
  )




/** プログラム領域 */

/** 自動ステップの実行 */
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

/** メイン画面の表示モード変更 */
function handleShowAsButton(){
  const elem=document.getElementById("show_as") as HTMLInputElement
  setType2ShowPlayArea(elem.value)
}

/** 盤面のリセット・ランダム化 */
function setTableRandom(randomize=0){
  phase_counter=0
  setDataAtReset()
  stat_log=[]
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

/** ステップ実行 */
function nextPhase(){
  let new_table_data:boolean[][]
  let ch_flag=false//変更あり?
  let live_count_local=0
  let barth_count_local=0
  let death_count_local=0
  const loop=hasLoop

  let prev_table_data:boolean[][]=[[]]
  setTableData(p=>{ //prevStateを使うためにアロー関数
    prev_table_data=p
    
    if(!loop){//拡張判断
      const needExtend=prev_table_data.some((_er,_ir)=>{
        return _er.some((_ec,_ic)=>{
          if(_ir==0 || _ir==prev_table_data.length-1 || _ic ==0 || _ic==_er.length-1){
            return _ec
          }
        })
      })
      if(needExtend){
        extend()
      }
    }

    if(ch_flag==true){
      return new_table_data
    }
  
    new_table_data=prev_table_data.map((row_data,ri)=>{ //列走査
      return row_data.map((_col_data,ci)=>{              //行走査
        if(prev_table_data[ri][ci]){//当該セル生状態
        /** 隣接セルがいきているか否か */
        let live_count_near=0
        if(getTableDataWithOffset(prev_table_data,ri,ci,-1,-1,loop)){live_count_near++}  //左上
        if(getTableDataWithOffset(prev_table_data,ri,ci,-1, 0,loop)){live_count_near++}  //上
        if(getTableDataWithOffset(prev_table_data,ri,ci,-1, 1,loop)){live_count_near++}  //右上
        if(getTableDataWithOffset(prev_table_data,ri,ci,0, -1,loop)){live_count_near++}  //左
        if(getTableDataWithOffset(prev_table_data,ri,ci,0,  1,loop)){live_count_near++}  //右
        if(getTableDataWithOffset(prev_table_data,ri,ci,1, -1,loop)){live_count_near++}  //右下
        if(getTableDataWithOffset(prev_table_data,ri,ci,1,  0,loop)){live_count_near++}  //下
        if(getTableDataWithOffset(prev_table_data,ri,ci,1,  1,loop)){live_count_near++}  //左下


        if(live_count_near<=1){ch_flag=true;death_count_local++;return false}  //過疎死
        if(live_count_near>=4){ch_flag=true;death_count_local++;return false}  //過密死
        live_count_local++
        return true //生存

      }else{//当該セル死状態
        /** 隣接セルがいきているか否か */
        let live_count_near=0
        if(getTableDataWithOffset(prev_table_data,ri,ci,-1,-1,loop)){live_count_near++}  //左上
        if(getTableDataWithOffset(prev_table_data,ri,ci,-1, 0,loop)){live_count_near++}  //上
        if(getTableDataWithOffset(prev_table_data,ri,ci,-1, 1,loop)){live_count_near++}  //右上
        if(getTableDataWithOffset(prev_table_data,ri,ci,0, -1,loop)){live_count_near++}  //左
        if(getTableDataWithOffset(prev_table_data,ri,ci,0,  1,loop)){live_count_near++}  //右
        if(getTableDataWithOffset(prev_table_data,ri,ci,1, -1,loop)){live_count_near++}  //右下
        if(getTableDataWithOffset(prev_table_data,ri,ci,1,  0,loop)){live_count_near++}  //下
        if(getTableDataWithOffset(prev_table_data,ri,ci,1,  1,loop)){live_count_near++}  //左下
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
      stat_log.push({phase_counter:phase_counter,row_length:row_length,col_length:col_length,live_count:live_count_local,barth_count:barth_count_local,death_count:death_count_local})
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
  colOffset: number,
  loop=true
): boolean {
  const rowLength = table.length;
  const colLength = table[0].length;

  // 負の数にも対応した mod 計算
  const wrap = (i: number, length: number): number =>
    ((i % length) + length) % length;

  let row = wrap(rowIndex + rowOffset, rowLength);
  let col = wrap(colIndex + colOffset, colLength);

  if(!loop){
    row = rowIndex + rowOffset
    col = colIndex + colOffset
    if (row<0 ||col<0||row>=rowLength||col>=colLength){
      return false
    }
  }
  let output=false;
  try{output = table[row][col]}catch(err){if(err){console.error(err)}}
  return output;
}

/** 盤面の拡張 */
function extend(){

  const row_data:boolean[][]=[]  //行データ
  let   col_data:boolean[]=[]    //列データ
  setColLength(col_length+2)
  setRowLength(row_length+2)
  for(let c=0;c<row_length+2;c++){
    col_data=[]
    for(let r=0;r<col_length+2;r++){    
      if(c>0&&r> 0&& c<tableData.length+1&&r<tableData[c-1].length+1){
        col_data.push(tableData[c-1][r-1])
      }else{
        col_data.push(false)
      }
    }
    row_data.push(col_data)
  }
  table_mapped=true
  setTableData(row_data)   //盤面更新

}

/** JSON形式での情報出力 */
function exportJson(){
  setStringedJson(JSON.stringify(
    {
      row_length:row_length,
      col_length:col_length,
      phase_counter:phase_counter,
      hasLoop:hasLoop,
      interval_time:interval_time,
      interval_ids:interval_ids,
      randomize:randomize,
      tableData:tableData
    }
  ))
  return 
}

/** JSON形式での情報入力 */
function importJson(){
  try {
    JSON.parse(stringed_json);
  } catch (err: unknown) {
    if (err instanceof Error && err.name !== "SyntaxError") {
      console.error(err);
    }
    return;
  }

  const j=JSON.parse(stringed_json)
  setRowLength(j?.row_length)
  setColLength(j?.col_length)
  phase_counter=j?.phase_counter
  setLoop(j?.hasLoop)
  setIntervalTime(j?.interval_time)
  interval_ids=j?.interval_ids
  setRandomize(j?.randomize)
  setTableData(j?.tableData)

}

/** CSV形式での盤面出力 */
function exportTableCsv(){
  const csv:string=tableData.join("\n")
  setStringedJson(csv)
  return 
}

/** CSV形式での盤面入力 */
function importTableCsv(){
  try {
    const j=stringed_json.split("\n").map((e)=>e.split(",").map((f)=>f=="true"?true:false))
    console.log(j)
    setTableData(j)
  } catch (err: unknown) {
    if (err instanceof Error && err.name !== "SyntaxError") {
      console.error(err);
    }
    return;
  }


  return 
}

/** CSV形式での統計情報出力 */
function showStatLog(){
  const csv:string=stat_log.map((e)=>[e?.phase_counter,e?.row_length,e?.col_length,e?.live_count,e?.barth_count,e?.death_count]).join("\n")
  setStringedJson(csv)
  return 
}

/** JSON形式での初期化時の情報出力 */
function exportJsonAtReset(){
  setStringedJson(dataAtReset)
}

/** 初期化時の情報を登録 */
function setDataAtReset(){
  dataAtReset=JSON.stringify(
    {
      row_length:row_length,
      col_length:col_length,
      phase_counter:phase_counter,
      hasLoop:hasLoop,
      interval_time:interval_time,
      interval_ids:interval_ids,
      randomize:randomize,
      tableData:tableData
    }
  )
  return
}


}

/** Appコンポーネントのエクスポート =実行 */
export default App


