import React, {useState} from 'react';
import axios from 'axios';

const button = 'border-solid border-2 border-blue-200 bg-slate-100 mb-2 py-1 px-2'; // tailwind class for button

function Task({completed, el, handleClick}){
    return (
      <li key={el.id} onClick={(event) => handleClick(event, el.id)} className="list-none">
        {el.task}
      </li>
    );
}
export default function App(){
  let [list, setList] = useState([]);
  let [focus, setFocus] = useState();
  let [focusId, setFocusId] = useState(-1);

  // handlers
  const handleAdd = () => {
    const input = document.getElementById('input');
    if(input.value === ''){
      alert("nothing in text box!");
      return;
    }
    let newList = list.slice();
    newList.push({
      task: input.value,
      completed: false,
    });
    updateList(newList, setList);
    setList(newList);
    input.value = '';
  }
  const handleDelete = () => {
    if(!focus){
      handleNullFocus();
      return; // returns if user hasn't selected anything
    }

    let newList = [...list.slice(0,focusId), ...list.slice(focusId+1)]
    updateList(newList, setList);
    unHighlight(focus);
    setFocus(null); // resets the focus and waits for user to click
    console.log(newList);
  }
  const handleMark = () => {
    if(!focus){
      handleNullFocus();
      return; // returns if user hasn't selected anything
    }

    let newList = list.slice();
    newList[focusId].completed = true;
    updateList(newList, setList);
    unHighlight(focus);
    setFocus(null);
  }
  const handleUnmark = () =>{
    if(!focus){
      handleNullFocus();
      return; // returns if user hasn't selected anything
    }

    let newList = list.slice();
    newList[focusId].completed = false;
    updateList(newList, setList);
    unHighlight(focus);
    setFocus(null);
  }
  const handleLoad = _ => {
    axios
      .get('http://localhost:5500')
      .then(res =>{
        console.log(list);
        console.log(res.data.data[0].list);
        setList(res.data.data[0].list);
      }).catch(err => console.log(err.message));
  }
  const handleSave = _ => {
    if(list.length < 1) return alert("You need to have items inside the list before you can add things");

    // convert list to storable format
    let convertedList = {list: []};
    list.forEach((el, index) => {
      convertedList.list.push(el);
    });

    axios
      .put('http://localhost:5500', convertedList)
      .then(res => console.log(res.data))
      .catch(err => console.log(err.message));
  }
  const handleTaskClick = (event, id) =>{
    setFocusId(id); // correlates task element to element in list  correlates task element to element in list
    const target = event.target;
    if(!focus){ // nothing has been selected
      highlight(target);
      setFocus(target);
    }
    else if (target === focus){ // same element selected
      unHighlight(focus);
      setFocus(null);
    }
    else{ // something new selected
      unHighlight(focus);
      highlight(target);
      setFocus(target);
    }
  }

  // renders
  const tasks = list.filter(el=>el.completed === false).map(el =>{
    return <Task el={el} handleClick={handleTaskClick}/>
  })
  const completed = list.filter(el=>el.completed === true).map(el =>{
    return <Task class="line-through" el={el} handleClick={handleTaskClick}/>
  })

  return(
    <div className='flex flex-col text-center justify-center mx-auto w-5/6'>
      <div className='flex flex-row space-x-2 justify-end'>
        <button className={button} onClick={handleSave}>Save</button>
        <button className={button} onClick={handleLoad}>Load</button>
      </div>
      <div className='border-solid border-4 border-green-200 mb-2.5'>
        <div  id='tasks'>
          <h1 className='mb-1 font-bold'>Tasks</h1>
          {tasks}
        </div>
        <div id='completed'>
          <h1 className='mb-1 font-bold'>Completed</h1>
          {completed}
        </div>
      </div>
      <input id='input' type='text' className='my-2'/>
      <div className='flex flex-col text-center'>
        <button className={button} onClick={handleAdd}>Add</button>
        <button className={button} onClick={handleDelete}>Delete</button>
        <button className={button} onClick={handleMark}>Mark Complete</button>
        <button className={button} onClick={handleUnmark}>Undo Complete</button>
      </div>
    </div>
  )
}

function highlight(element){
  element.classList.add("bg-lime-400");
  element.classList.add("font-bold");
}

function unHighlight(element){
  element.classList.remove("bg-lime-400");
  element.classList.remove("font-bold");
}

function handleNullFocus(){
  alert("Nothing has been chosen. Please select a task, completed or not, first.");
}

function updateList(newList, setList){
  newList.map((el, index)=>{
    el.id = index;
  })

  setList(newList);
}
