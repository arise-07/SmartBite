import { useState } from "react";
function Change(){
    const [color,setColor]=useState("red");

    function changeColor(){
       setColor("blue");
       setColor("green");
       
    }
    return(
    <>
        <div style={{backgroundColor:color,width:"250px",height:"250px"}}></div>
        <button onClick={changeColor}>Click me</button>
    </>
    
    )
    
}

export default Change;