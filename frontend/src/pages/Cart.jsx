import React, { useEffect, useState } from "react";

export default function Cart(){
const[todos, setTodos]=useState([
    {
    id:1, text:"FrontEnd", done:false
},
{
    id:2,text:"Backend", done:true
}
]);
console.log(todos);
const filteractiveTodos=()=>{
    const activeTodos=todos.filter((items)=>!todos.done);
    setTodos(activeTodos);

    console.log(todos);
}
return(console.log("hello"))
}
