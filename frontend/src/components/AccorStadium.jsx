import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { FormControl } from '@mui/material';
import { Navigate, useNavigate, Link, useParams } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Grid } from '@mui/material';

const AccorStadium = () => {
  const styles = {
    gridContainer: {
      border: "3px solid black",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "50px",
      gap: "100px"
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
  return (
    <div id="grid container" style={styles.gridContainer}>
      <div id="level 1" style={styles.levelOne}>
        <div className="seat" id="l1A1" style={styles.seat}>A1</div>
        <div className="seat" id="l1A2" style={styles.seat}>A2</div>
        <div className="seat" id="l1A3" style={styles.seat}>A3</div>
        <div className="seat" id="l1A4" style={styles.seat}>A4</div>
        <div className="seat" id="l1B1" style={styles.seat}>B1</div>
        <div className="seat" id="l1B2" style={styles.seat}>B2</div>
        <div className="seat" id="l1B3" style={styles.seat}>B3</div>
        <div className="seat" id="l1B4" style={styles.seat}>B4</div>
      </div>
      <div id="level 2" style={styles.levelTwo}>
        <div className="seat" id="l2A1" style={styles.seat}>A1</div>
        <div className="seat" id="l2A2" style={styles.seat}>A2</div>
        <div className="seat" id="l2B1" style={styles.seat}>B1</div>
        <div className="seat" id="l2B2" style={styles.seat}>B2</div>
      </div>
      <div id="private suites" style={styles.privateSuites}>
        <div className="seat" id="PA1" style={styles.seat}>A1</div>
        <div className="seat" id="PA2" style={styles.seat}>A2</div>
      </div>
    </div>

  );
};
export default AccorStadium;