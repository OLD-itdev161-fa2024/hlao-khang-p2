import React, { useState } from 'react'

function ButtonClicker() {
  let [count, setCount] = useState(0);

  const incrementCount = _ =>{
    setCount(count + 1);
  }

  return(
    <div>
      <h1>Button Clicker</h1>
      <h1>{count}</h1>
      <button onClick={incrementCount}>Increment count</button>
    </div>
  )
}
function InputAdder(){
  let [words, setWords] = useState('');
  const buttonHandler = _ => {
    const input = document.getElementById("input");
    setWords(input.value);
    console.log(input.value);
  }
  return(
    <div>
      <h1>{words}</h1>
      <input id='input' type='text'/>
      <button onClick={buttonHandler}>Insert</button>
    </div>
  )
}

function ListAdder(){
  let [list, setList] = useState([]);
  const handleAdd = _ =>{
    const input = document.getElementById('input');
    const newList = list.slice();
    newList.push(input.value)
    console.log(newList);
    setList(newList);
  }

  const stuff = list.map(el=>{
    return <li key={el}>{el}</li>
  })
  return (
    <>
      <ol>{stuff}</ol>
      <input id='input' type='text'/>
      <button onClick={handleAdd}>Click to add input</button>
    </>
  )
}

function App(){
  return(
    <>
      {/* <ButtonClicker/> */}
      {/* <InputAdder/> */}
      <ListAdder/>
    </>
  )
}

export default App
