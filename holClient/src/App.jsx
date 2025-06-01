import React, { useState, useEffect } from "react";
import "./App.css";
import StartButtons from "./components/StartButtons";
import Game from "./components/Game";
import axios from "axios";

function App() {
    const [mainMenu, setMainMenu] = useState(true);
    const [playGame, setPlayGame] = useState(false);

    //sets user token on refresh
    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    }, []);

    return (
        <>
            <div className="page">
                {/* display main menu */}
                {mainMenu && (
                    <div className="container">
                        <h1 className="title">Higher or Lower</h1>
                        <StartButtons
                            startClick={() => {
                                setMainMenu(false), setPlayGame(true);
                            }}
                        />
                    </div>
                )}
                {/* swaps back to main menu */}
                {playGame && (
                    <button
                        style={{ position: "absolute", x: 0, y: 0 }}
                        onClick={() => {
                            setMainMenu(true), setPlayGame(false);
                        }}
                    >
                        Main Menu
                    </button>
                )}
                {/* display game */}
                {playGame && (
                    <div className="container">
                        <Game />
                    </div>
                )}
                
                
            </div>
        </>
    );
}

export default App;
