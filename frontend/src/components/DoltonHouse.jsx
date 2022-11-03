import React, { useState, useEffect } from 'react';

const DoltonHouse = () => {
  const styles = {
    gridContainer: {
      border: "3px solid black",
      display: "grid",
      justifyContent: "center",
      alignItems: "center",
      padding: "50px",
      gridTemplateRows: "repeat(3, 1fr)",
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
  return (
    <div id="grid container" style={styles.gridContainer}>
      <div id="table 1" style={styles.tableOne}>
        <div className="seat" id="T1_1" style={styles.seat}>1</div>
        <div className="seat" id="T1_2" style={styles.seat}>2</div>
        <div className="seat" id="T1_3" style={styles.seat}>3</div>
      </div>
      <div id="table 2" style={styles.tableTwo}>
        <div className="seat" id="T2_1" style={styles.seat}>1</div>
        <div className="seat" id="T2_2" style={styles.seat}>2</div>
        <div className="seat" id="T2_3" style={styles.seat}>3</div>
      </div>
      <div id="table 3" style={styles.tableThree}>
        <div className="seat" id="T3_1" style={styles.seat}>1</div>
        <div className="seat" id="T3_2" style={styles.seat}>2</div>
        <div className="seat" id="T3_3" style={styles.seat}>3</div>
      </div>
      <div id="table 3" style={styles.tableThree}>
        <div className="seat" id="T3_1" style={styles.seat}>1</div>
        <div className="seat" id="T3_2" style={styles.seat}>2</div>
        <div className="seat" id="T3_3" style={styles.seat}>3</div>
      </div>
      <div id="table 4" style={styles.tableFour}>
        <div className="seat" id="T3_1" style={styles.seat}>1</div>
        <div className="seat" id="T3_2" style={styles.seat}>2</div>
        <div className="seat" id="T3_3" style={styles.seat}>3</div>
        <div className="seat" id="T3_4" style={styles.seat}>4</div>
        <div className="seat" id="T3_5" style={styles.seat}>5</div>
      </div>
    </div>

  );
};
export default DoltonHouse;