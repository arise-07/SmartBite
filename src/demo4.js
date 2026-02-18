import { useState } from "react";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        if (email === "" || password === "") {
            alert("Please fill in all fields");
        }
        else if (email === "arisefromtheshadows@gmail.com" && password === "arise007") {
            alert("Login successful!");
        }
        else {
            alert("Invalid credentials");
        }
    }
    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }   

    return (
        <>
        <h1>Sign-UP     </h1>
        <label>Email:</label>
        <input type="email" placeholder="Enter your email" onChange={handleEmailChange} />
        <br />
        <label>Password:</label>
        <input type="password" placeholder="Enter your password" onChange={handlePasswordChange} />
        <br />
        <button onClick={handleSubmit}>Submit</button>  
        </>
            
    );
}

export default Signup;
