import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Navigate, useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CanvasJSReact from '../canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50vw',
  height: '75vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'scroll'
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  // color: theme.palette.text.secondary,
  color: 'purple',
  height: '20vh',
  fontSize: '5vh',
}));

export default function Dashboard() {
  const { eventId} = useParams();
  const [open, setOpen] = React.useState(true);
  const state = useLocation();
  const eventObj = state.state;
  const [toDoList, setToDoList] = React.useState([]);
  const [alignment, setAlignment] = React.useState('pageView');
  const [toggleState, setToggleState] = React.useState('');
  const [pageViewPlot, setPageViewPlot] = React.useState({});
  const [ticketPurchasePlot, setTicketPurchasePlot] = React.useState({});
  const [revenuePlot, setRevenuePlot] = React.useState({});

  const handleChange = (event, newAlignment) => {
    setToggleState(newAlignment);
    console.log(event);
    console.log(newAlignment);
    if (newAlignment ===  'pageView') {
      console.log('here');
      fetchPageViewPlot();
    }
    if (newAlignment ===  'ticketPurchase') {
      console.log('here');
      fetchTicketPurchasePlot();
    }
    if (newAlignment ===  'revenue') {
      console.log('here');
      fetchRevenuePlot();
    }
  };

  const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];
  
  const fetchPageViewPlot = () => {
    setPageViewPlot({
      animationEnabled: true,
      exportEnabled: true,
      theme: "light2", // "light1", "dark1", "dark2"
      title:{
        text: "Bounce Rate by Week of Year"
      },
      axisY: {
        title: "Bounce Rate",
        suffix: "%"
      },
      axisX: {
        title: "Week of Year",
        prefix: "W",
        interval: 2
      },
      data: [{
        type: "line",
        toolTipContent: "Week {x}: {y}%",
        dataPoints: [
          { x: 1, y: 64 },
          { x: 2, y: 61 },
          { x: 3, y: 64 },
          { x: 4, y: 62 },
          { x: 5, y: 64 },
          { x: 6, y: 60 },
          { x: 7, y: 58 },
          { x: 8, y: 59 },
          { x: 9, y: 53 },
          { x: 10, y: 54 },
          { x: 11, y: 61 },
          { x: 12, y: 60 },
          { x: 13, y: 55 },
          { x: 14, y: 60 },
          { x: 15, y: 56 },
          { x: 16, y: 60 },
          { x: 17, y: 59.5 },
          { x: 18, y: 63 },
          { x: 19, y: 58 },
          { x: 20, y: 54 },
          { x: 21, y: 59 },
          { x: 22, y: 64 },
          { x: 23, y: 59 }
        ]
      }]})
    }

    const fetchTicketPurchasePlot = () => {
      setTicketPurchasePlot({
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        title:{
          text: "Bounce Rate by Week of Year"
        },
        axisY: {
          title: "Bounce Rate",
          suffix: "%"
        },
        axisX: {
          title: "Week of Year",
          prefix: "W",
          interval: 2
        },
        data: [{
          type: "line",
          toolTipContent: "Week {x}: {y}%",
          dataPoints: [
            { x: 1, y: 64 },
            { x: 2, y: 61 },
            { x: 3, y: 64 },
            { x: 4, y: 62 },
            { x: 5, y: 64 },
            { x: 6, y: 60 },
            { x: 7, y: 58 },
            { x: 8, y: 59 },
            { x: 9, y: 53 },
            { x: 10, y: 54 },
            { x: 11, y: 61 },
            { x: 12, y: 60 },
            { x: 13, y: 55 },
            { x: 14, y: 60 },
            { x: 15, y: 56 },
            { x: 16, y: 60 },
            { x: 17, y: 59.5 },
            { x: 18, y: 63 },
            { x: 19, y: 58 },
            { x: 20, y: 54 },
            { x: 21, y: 59 },
            { x: 22, y: 64 },
            { x: 23, y: 59 }
          ]
        }]})
    }

    
    const fetchRevenuePlot = () => {
      setRevenuePlot({
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        title:{
          text: "Bounce Rate by Week of Year"
        },
        axisY: {
          title: "Bounce Rate",
          suffix: "%"
        },
        axisX: {
          title: "Week of Year",
          prefix: "W",
          interval: 2
        },
        data: [{
          type: "line",
          toolTipContent: "Week {x}: {y}%",
          dataPoints: [
            { x: 1, y: 64 },
            { x: 2, y: 61 },
            { x: 3, y: 64 },
            { x: 4, y: 62 },
            { x: 5, y: 64 },
            { x: 6, y: 60 },
            { x: 7, y: 58 },
            { x: 8, y: 59 },
            { x: 9, y: 53 },
            { x: 10, y: 54 },
            { x: 11, y: 61 },
            { x: 12, y: 60 },
            { x: 13, y: 55 },
            { x: 14, y: 60 },
            { x: 15, y: 56 },
            { x: 16, y: 60 },
            { x: 17, y: 59.5 },
            { x: 18, y: 63 },
            { x: 19, y: 58 },
            { x: 20, y: 54 },
            { x: 21, y: 59 },
            { x: 22, y: 64 },
            { x: 23, y: 59 }
          ]
        }]})
      }

  const navigate = useNavigate();
  // const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    navigate(`/events/host`);
  } 



  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={()=>handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography gutterBottom variant="h5" component="div">
            Dashboard For {eventObj.eventName}
          </Typography>
          <Typography gutterBottom variant="h6" component="div" color="purple">
            Metrics: 
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography gutterBottom variant="body1" component="div" color="text.primary" align='center'>
                Conversion Rate
              </Typography>
              <Item>xs=8</Item>
            </Grid>
            <Grid item xs={4}>
              <Typography gutterBottom variant="body1" component="div" color="text.primary" align='center'>
                Total Revenue
              </Typography>
              <Item>xs=8</Item>
            </Grid>
            <Grid item xs={4}>
              <Typography gutterBottom variant="body1" component="div" color="text.primary" align='center'>
                To-Do <button style={{display:'inline-block'}}>+</button>
              </Typography>
              <Item>xs=8</Item>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant="h6" component="div" color="purple">
                Milestones Reached 
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Stepper nonLinear>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepButton color="inherit">
                      {label}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom variant="h6" component="div" color="purple">
                Live Plots
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ToggleButtonGroup
                color="primary"
                value={toggleState}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
              >
                <ToggleButton value="pageView">Page Views</ToggleButton>
                <ToggleButton value="ticketPurchase">Ticket Purchases</ToggleButton>
                <ToggleButton value="revenue">Revenue</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12}>
              {toggleState === "pageView" && <div>
                <CanvasJSChart options = {pageViewPlot}/>
              </div>}
              {toggleState === "ricketPurchase" && <div>
                <CanvasJSChart options = {ticketPurchasePlot}/>
              </div>}
              {toggleState === "revenue" && <div>
                <CanvasJSChart options = {revenuePlot}/>
              </div>}
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}