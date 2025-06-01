import React, { useState, useEffect } from "react";
import cardBack from "/images/card_back.jpg";
import WinLossModal from "./winLossModal";
import RulesModal from "./RulesModal";
import axios from "axios";

//card object constructor
class card {
    constructor(value, path) {
        this.value = value;
        this.path = path;
    }
}
//holds all cards
const cardList = [];
//populates cardList with card objects
for (let i = 1; i < 53; i++) {
    let value = 0;
    let path = "";

    if (i % 13 == 0) {
        value = 13;
    } else {
        value = i % 13;
    }

    if (i < 14) {
        path = `/images/${value}H.jpg`;
    }
    if (i > 13 && i < 27) {
        path = `/images/${value}D.jpg`;
    }
    if (i > 26 && i < 40) {
        path = `/images/${value}C.jpg`;
    }
    if (i > 39) {
        path = `/images/${value}S.jpg`;
    }

    let currCard = new card(value, path);
    cardList.push(currCard);
}

const Game = () => {
    //cards are ordered alphabetically then numerically ie C>D>H>S># 6D = index 19
    //card named based on relative value starting from 1 ending at 13 2 = 1 A = 13

    //game states
    const [cardsRemaining, setCardsRemaining] = useState(8);
    const [cardHeld, setCardHeld] = useState(Math.floor(Math.random() * 52));
    const [nextCard, setNextCard] = useState(null);
    const [cardsUsed, setCardsUsed] = useState([]);
    const [nextHidden, setNextHidden] = useState(true);
    const [showLoss, setShowLoss] = useState(false);
    const [showWin, setShowWin] = useState(false);
    const [showRules, setShowRules] = useState(false);

    //user states
    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [gamesWon, setGamesWon] = useState(0);

    useEffect(() => {
        setCardsUsed([cardHeld]);
        checkUsed();
        getStats();
    }, []);

    //game functions
    const checkUsed = () => {
        let newNext;

        do {
            newNext = Math.floor(Math.random() * 52);
        } while (cardHeld == newNext || cardsUsed.includes(newNext));

        setNextCard(newNext);
        setCardsUsed((prev) => [...prev, newNext]);
        if (cardsRemaining == 1) {
            setShowWin(true);
        }
    };

    const winSet = () => {
        if (cardsRemaining > 1) {
            setCardHeld(nextCard);
            setNextHidden(true);
            setCardsRemaining(cardsRemaining - 1);
            checkUsed();
        } else {
            // game won
            const newPlayed = gamesPlayed + 1;
            const newWon = gamesWon + 1;
            setGamesPlayed(newPlayed);
            setGamesWon(newWon);
            updateStats(newPlayed, newWon);
            setShowWin(true);
            setNextHidden(true);
            setCardsRemaining(8); // reset
        }
    };

    const voteHigher = () => {
        //checks for success
        if (cardList[cardHeld].value < cardList[nextCard].value) {
            setNextHidden(false);
            winSet();
        } else {
            //set loss
            setShowLoss(true);
            setNextHidden(false);
            const newPlayed = gamesPlayed + 1;
            setGamesPlayed(newPlayed);
            updateStats(newPlayed, gamesWon);
            setCardsRemaining(8);
        }
    };
    const voteLower = () => {
        //checks for success
        if (cardList[cardHeld].value > cardList[nextCard].value) {
            setNextHidden(false);
            winSet();
        } else {
            //set loss
            setShowLoss(true);
            setNextHidden(false);
            const newPlayed = gamesPlayed + 1;
            setGamesPlayed(newPlayed);
            updateStats(newPlayed, gamesWon);
            setCardsRemaining(8);
        }
    };
    const replayGame = () => {
        setCardHeld(Math.floor(Math.random() * 52));
        setNextCard(null);
        setCardsUsed([]);
        setNextHidden(true);
        setShowLoss(false);
        setShowWin(false);
        checkUsed();
    };
    //logs card held and next card values
    //console.log(cardHeld % 13, nextCard % 13);

    //user functions

    const updateStats = async (played, won) => {
        try {
            const stats = await axios.put("http://localhost:5000/api/stats", {
                played,
                won,
            });
            console.log(stats.data);
        } catch (err) {
            console.log(err.message);
        }
    };

    const getStats = async () => {
        try {
            const stats = await axios.get("http://localhost:5000/api/stats");
            setGamesPlayed(stats.data.games_played);
            setGamesWon(stats.data.games_won);
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <>
            <button
                className="btn btn-light"
                style={{ position: "absolute", x: 0, y: 0 }}
                onClick={() => setShowRules(true)}
            >
                rules
            </button>
            {showRules && <RulesModal onClose={() => setShowRules(false)} />}
            {showLoss && (
                <WinLossModal wol="You Lose" replayClick={() => replayGame()} />
            )}
            {showWin && (
                <WinLossModal wol="You Win!" replayClick={() => replayGame()} />
            )}
            <div className="cards">
                <h1 style={{ marginBottom: "30px" }}>
                    Cards Remaining: {cardsRemaining}
                </h1>
                <p>Games played: {gamesPlayed}</p>
                <p>Games won: {gamesWon}</p>
                <img
                    src={cardList[cardHeld].path}
                    style={{ marginRight: "50px" }}
                />
                {nextHidden ? (
                    <img src={cardBack} />
                ) : (
                    <img src={cardList[nextCard].path} />
                )}
            </div>
            <div className="hol-buttons">
                <button
                    className="btn btn-light"
                    onClick={voteHigher}
                    style={{
                        marginRight: "80px",
                        marginTop: "30px",
                        height: "40px",
                        width: "75px",
                    }}
                >
                    Higher
                </button>
                <button
                    className="btn btn-light"
                    onClick={voteLower}
                    style={{ marginTop: "30px", height: "40px", width: "75px" }}
                >
                    Lower
                </button>
            </div>
            <div></div>
        </>
    );
};

export default Game;
