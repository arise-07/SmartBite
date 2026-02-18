import { useState } from "react";





function Random() {
    const [number, setnumber] = useState("");

    function handlegenerate() {
        setnumber(Math.floor(Math.random() * 100));
    }




    return (
        <div>
            <h1>Random Number: {number}</h1>
            <button onClick={handlegenerate}>Generate</button>

        </div>
    )
}
export default Random;