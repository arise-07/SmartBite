import { useState } from "react";   

function Demo1() {
    const [shoplist,setShoplist]=useState(["Milk","Bread","Eggs","Butter"]);
    const [item,setItem]=useState("");

    const handleChange=(e)=>{
        setItem(e.target.value);
    }

    const handleAdd=()=>{
       setShoplist([...shoplist,item]);
       setItem(" ");
    }

    return (
        <div>
            
                <input type="text" placeholder="Enter yout List" onChange={handleChange}></input>
                <button onClick={handleAdd}>ADD</button>
                <ul>
                    <li>
                        {shoplist.map(function(item){
                            return <li>{item}</li>

                        })}
                    </li>
                </ul>
        </div>
    )
}

export default Demo1;