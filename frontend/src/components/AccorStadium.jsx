import React, { useState, useEffect } from 'react';

/**
 *  Venue Map for Accor stadium
 *  This function is used to display available and unavailable seats, 
 *  when user is buying tickets for this venue
 */
const AccorStadium = ({
  unAvailSeats,
  availSeats,
  currentSelected
}) => {
  const styles = {
    gridContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "50px",
      gap: "100px",
      
    },
    levelOne: {
      display: "grid",
      gridTemplateRows: "repeat(2, 1fr)",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "5px",
      width: "200px",
      height: "100px"
    },
    seat: {
      border: "2px solid black",
      width: "50px",
      height: "50px"
    },
    levelTwo: {
      display: "grid",
      gridTemplateRows: "repeat(2, 1fr)",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "5px",
      width: "100px",
      height: "100px",
    },
    privateSuites: {
      display: "grid",
      gridTemplateRows: "repeat(1, 1fr)",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "5px",
      width: "100px",
      height: "50px",
    }
  }

  useEffect(()=> {
    unAvailSeats.forEach((seat)=> {
      const el = document.getElementById(`${seat.seatid}`);
      el.style.backgroundColor = "#f76f6d";
    })

    availSeats.forEach((seat)=> {
      const el = document.getElementById(`${seat.seatid}`);
      el.style.backgroundColor = "#90EE90";
    })
    if (currentSelected !== '') {
      const el = document.getElementById(`${currentSelected}`);
      el.style.backgroundColor = "#55c1f3";
    }
  },[unAvailSeats,availSeats, currentSelected])
  
  return (
    <div id="grid container" style={styles.gridContainer}>
      <div id="level 1" style={styles.levelOne}>
        <div className="label">Level 1</div>
        <div className="label"></div>
        <div className="label"></div>
        <div className="label"></div>
        <div className="seat" id="1" style={styles.seat}>A1</div>
        <div className="seat" id="2" style={styles.seat}>A2</div>
        <div className="seat" id="3" style={styles.seat}>A3</div>
        <div className="seat" id="4" style={styles.seat}>A4</div>
        <div className="seat" id="5" style={styles.seat}>B1</div>
        <div className="seat" id="6" style={styles.seat}>B2</div>
        <div className="seat" id="7" style={styles.seat}>B3</div>
        <div className="seat" id="8" style={styles.seat}>B4</div>
      </div>
      <div id="level 2" style={styles.levelTwo}>
        <div className="label">Level 2</div>
        <div className="label"></div>
        <div className="seat" id="9" style={styles.seat}>A1</div>
        <div className="seat" id="10" style={styles.seat}>A2</div>
        <div className="seat" id="11" style={styles.seat}>B1</div>
        <div className="seat" id="12" style={styles.seat}>B2</div>
      </div>
      <div id="private suites" style={styles.privateSuites}>
        <div className="label">private suites</div>
        <div className="label"></div>
        <div className="seat" id="13" style={styles.seat}>A1</div>
        <div className="seat" id="14" style={styles.seat}>A2</div>
      </div>
    </div>

  );
};
export default AccorStadium;