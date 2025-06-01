import React, { useState, useEffect } from "react";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";

const StartButtons = (props) => {
    const [signUp, setSignUp] = useState(false);
    const [logIn, setLogIn] = useState(false);
    
    
    return (
        <>
            <button className="btn btn-light" style={{ marginTop: "5px" }} onClick={props.startClick}>
                Start Game
            </button>
            <button
                className="btn btn-light"
                style={{ marginTop: "5px" }}
                onClick={() => setSignUp(true)}
            >
                Sign up
            </button>
            <button
                className="btn btn-light"
                style={{ marginTop: "5px" }}
                onClick={() => setLogIn(true)}
            >
                Log in
            </button>

            {signUp && <SignUpModal onClose={() => setSignUp(false)} />}
            {logIn && <LoginModal onClose={() => setLogIn(false)} />}
        </>
    );
};

export default StartButtons;
