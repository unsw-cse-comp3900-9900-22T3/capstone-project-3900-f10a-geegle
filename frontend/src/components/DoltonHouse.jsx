import React, { useState, useEffect } from 'react';

const DoltonHouse = ({
  unAvailSeats,
  availSeats,
  currentSelected
}) => {
  const styles = {
    gridContainer: {
      border: "3px solid black",
      display: "grid",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      gridTemplateRows: "repeat(2, 1fr)",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "100px",

    },
    tableOne: {
      display: "grid",
      gridTemplateRows: "repeat(1, 1fr)",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "5px",
      width: "200px",
      height: "100px",
      border: "2px solid black",
      padding: "5px"
    },
    seat: {
      border: "2px solid black",
      width: "50px",
      height: "50px"
    },
    tableTwo: {
      display: "grid",
      gridTemplateRows: "repeat(1, 1fr)",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "5px",
      width: "200px",
      height: "100px",
      border: "2px solid black",
      padding: "5px"
    },
    tableThree: {
      display: "grid",
      gridTemplateRows: "repeat(1, 1fr)",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "5px",
      width: "200px",
      height: "100px",
      border: "2px solid black",
      padding: "5px"
    }, 
    tableFour: {
      display: "grid",
      gridTemplateRows: "repeat(2, 1fr)",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "5px",
      width: "210px",
      height: "150px",
      border: "2px solid black",
      padding: "5px"
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
      <div id="table 1" style={styles.tableOne}>
        <div className="label">Tabel 1</div>
        <div className="label"></div>
        <div className="label"></div>
        <div className="seat" id="15" style={styles.seat}>1</div>
        <div className="seat" id="16" style={styles.seat}>2</div>
        <div className="seat" id="17" style={styles.seat}>3</div>
      </div>
      <div id="table 2" style={styles.tableTwo}>
        <div className="label">Tabel 2</div>
        <div className="label"></div>
        <div className="label"></div>
        <div className="seat" id="18" style={styles.seat}>1</div>
        <div className="seat" id="19" style={styles.seat}>2</div>
        <div className="seat" id="20" style={styles.seat}>3</div>
      </div>
      <div id="table 3" style={styles.tableThree}>
        <div className="label">Tabel 3</div>
        <div className="label"></div>
        <div className="label"></div>
        <div className="seat" id="21" style={styles.seat}>1</div>
        <div className="seat" id="22" style={styles.seat}>2</div>
        <div className="seat" id="23" style={styles.seat}>3</div>
      </div>
      <div id="table 4" style={styles.tableFour}>
        <div className="label">Tabel 4</div>
        <div className="label"></div>
        <div className="label"></div>
        <div className="seat" id="24" style={styles.seat}>1</div>
        <div className="seat" id="25" style={styles.seat}>2</div>
        <div className="seat" id="26" style={styles.seat}>3</div>
        <div className="seat" id="27" style={styles.seat}>4</div>
        <div className="seat" id="28" style={styles.seat}>5</div>
      </div>
    </div>

  );
};
export default DoltonHouse;