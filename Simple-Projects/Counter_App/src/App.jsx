import React,{useState} from 'react';
import './App.css';

const App = () => {
  const [count, setCount] = useState(0);
  return(
    <div>
      <h1>Counter App</h1>
      <div className='Count'>Count: {count}</div>
      <div className='buttonGroup'>
        <button onClick={()=>setCount(count+1)}>Increase</button>
        <button onClick={()=>setCount(count>0?count-1:0)}>Decrease</button>
        <button onClick={()=>setCount(0)}>Reset</button>
      </div>
    </div>
  )
}

export default App;