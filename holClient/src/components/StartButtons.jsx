import React, { useState, useEffect } from "react";
import SignUpModal from "./SignUpModal";
import LoginModal from "./LoginModal";
import axios from "axios";

const clearToken = () => {
    axios.defaults.headers.common["Authorization"] = null;
    localStorage.clear();
};

const StartButtons = (props) => {
    const [signUp, setSignUp] = useState(false);
    const [logIn, setLogIn] = useState(false);

    return (
        <>
            <button
                className="btn btn-light"
                style={{ marginTop: "5px" }}
                onClick={props.startClick}
            >
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
            <button
                className="btn btn-light"
                style={{ marginTop: "5px" }}
                onClick={() => clearToken()} //Clears login token
            >
                Log Out
            </button>

            {signUp && <SignUpModal onClose={() => setSignUp(false)} />}
            {logIn && <LoginModal onClose={() => setLogIn(false)} />}
        </>
    );
};

export default StartButtons;
