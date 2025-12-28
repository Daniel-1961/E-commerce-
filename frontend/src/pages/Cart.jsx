import { useState,useEffect } from "react";
export default function Cart(){
    const [todos, setTodos]=useState([
    {
        id:1,
        text:"data science project",
        completed:false
    },

    {
        id:2, 
        text:"web dev't project", 
        completed:true
    }

]);
useEffect(()=>{
    console.log("initital todos:", todos),
    [todos]
})

const addTodo=(text)=>{
    const newTodo={id:Date.now(), text, completed:false};
    setTodos(prevTodos=>[...prevTodos,newTodo]);//save all the old and add the value;
};
return(
    <div>
        <h1>List of Todos</h1>
     <button
        onClick={()=>addTodo("c++ Project")}
        >
         Add Project
        </button>
        <ul>
            {todos.map((items)=>(
                <li key={items.id}>
                   {items.text} - {items.completed ? "✅" : "❌"}

                </li>

           ) )}
            
        </ul>
    </div>
);
}
