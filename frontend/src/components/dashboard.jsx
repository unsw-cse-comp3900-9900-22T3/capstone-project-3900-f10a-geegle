import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Navigate, useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CanvasJSReact from '../canvasjs.react';
import AddIcon from '@mui/icons-material/Add';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import { SettingsBackupRestoreRounded } from '@mui/icons-material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Tooltip from '@mui/material/Tooltip';
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
  height: '10vh',
  fontSize: '5vh',
  overflow: 'scroll'
}));

const stepperTheme = createTheme({
  components: {
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-active':{
            color: "purple",
          }
        },
      },
    },
  },
});

const buttonStyle= {
  display: "inline-block",
  backgroundColor: "white",
  color: "purple",
  borderRadius: "25px",
  border: "2px solid purple",
};

const conversionText = `
Conversion rate is the number of people purchased a 
ticket divided by the total number of visitors for 
the event page!!
`;

const revenueText = `
Revenue is the total amount earned from selling tickets!!
`;
const ticketsSoldText = `
The total number of tickets sold for this event
`;
const addTaskText = `
click this button to start adding tasks to your to-do list!!
`;
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
  const [steps, setSteps] = React.useState(['No Milestones Reached']);
  const [conversionRate, setConversionRate] = React.useState('0');
  const [revenue, setRevenue] = React.useState('0');
  const [ticketSold, setTicketSold] = React.useState('0');
  const [showTextInput, setShowTextInput] = React.useState(false);
  const [taskName, setTaskName] = React.useState('');
  const [tasks, setTasks] = React.useState([]);
  const [taskErr, setTaskErr] = React.useState(false);
  const [reRender, setReRender] = React.useState([""]);
  const navigate = useNavigate();

  const handleChange = (event, newAlignment) => {
    setToggleState(newAlignment);
    console.log(event);
    console.log(newAlignment);
  };
  
  const fetchPageViewPlot = async (data) => {
    const updatedDate = data.map(({ pageViews, date }) => ({
      ["y"]:pageViews,
      ["x"]:new Date(date)
    }))

    console.log(data);
    setPageViewPlot({
      animationEnabled: true,
      exportEnabled: true,
      theme: "light2", // "light1", "dark1", "dark2"
      title:{
        text: "Page views"
      },
      axisY: {
        title: "Page Views/Day",
      },
      axisX: {
        title: "per day",
        //interval: 1
      },
      data: [{
        type: "line",
        // xValueType: "dateTime",
        toolTipContent: "Week {date}: {pageViews}%",
        dataPoints: updatedDate
      }]})
    }

    const fetchTicketPurchasePlot = async(data) => {
          // pass a function to map
      // const newData = data.map(dp =>{ 
      //   delete data.x;
      // });

      console.log('here');
      console.log(data);
      const updatedDate = data.map(({ ticketPurchases, date }) => ({
        ["y"]:ticketPurchases,
        ["x"]:new Date(date)
      }));

      console.log("here");
      setTicketPurchasePlot({
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        title:{
          text: "Ticket Purchases"
        },
        axisY: {
          title: "Amount of ticket purchase",
        },
        axisX: {
          title: "Per Day",
        },
        data: [{
          type: "line",
          toolTipContent: "Week {date}: {ticketPurchases}%",
          dataPoints: updatedDate
        }]
      })
    }

    
    const fetchRevenuePlot = async(data) => {

      console.log('here');
      const updatedDate = data.map(({ ticketRevenue, date }) => ({
        ["y"]:ticketRevenue,
        ["x"]:new Date(date)
      }));

      
      setRevenuePlot({
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        title:{
          text: "Revenue"
        },
        axisY: {
          title: "Revenue",
        },
        axisX: {
          title: "Per Day",
        },
        data: [{
          type: "line",
          toolTipContent: "Week {date}: {revenue}%",
          dataPoints: updatedDate
        }]
      })
    }
    

  
  // const handleOpen = () => setOpen(true);
  const handleClose = async() => {
    console.log('here');
    await updateTasks(tasks);
    setOpen(false);
    navigate(`/events/host`);
  } 

  const updateTasks = async(task) => {
    for (const t of task) {
      const response = await fetch(`http://localhost:3000/events/${t.eventID}/todo/${t.taskID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          taskCompleted: t.taskCompleted 
        }),
      })
      const json = await response.json();
      console.log(json);
    }

  }

  const addInput = () => {
    if(showTextInput) {
      setShowTextInput(false);
    } else {
      setShowTextInput(true);
    }
  }
  const fetchDashboardData = async() => {
    const response = await fetch(`http://localhost:3000/events/dashboard/${eventId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      // body: JSON.stringify({userID:userID }),
    })
      if (response.ok) {
        const json = await response.json();
        console.log('json', json);
        const mileStone = [];
        await fetchPageViewPlot(json.stats.pageViewChart);
        await fetchTicketPurchasePlot(json.stats.ticketPurchaseChart);
        await fetchRevenuePlot(json.stats.ticketRevenueChart);
        await setConversionRate(json.stats.conversionRate);
        await setRevenue(json.stats.revenue);
        await setTicketSold(json.stats.ticketsSold);
        for (const ms of json.stats.milestones) {
          if (ms.achieved) {
            mileStone.push(ms.goal);
          }
        }
        if(mileStone.length !== 0) {
          setSteps(mileStone)
        }
      } else if (response.status === 404) {
        console.log('invalid id');
      } else if (response.status === 403) {
        console.log('you are not allowed to access this event');
      }
  }

  const fetchTasks = async() => {
    const response = await fetch(`http://localhost:3000/events/${eventId}/todo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      // body: JSON.stringify({userID:userID }),
    })

    if (response.ok) {
      const json = await response.json();
      console.log(json.todo, 'fetch Now')
      setTasks(json.todo);
      setTaskErr(false);
      console.log(reRender);
      // const currChange = [...reRender];
      
    } 
  }

  const addTasks = async(task) => {
    console.log(task);
    const response = await fetch(`http://localhost:3000/events/${eventId}/todo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        taskDescription: task,
        taskCompleted: false
      }),
    })

    // const json = await response.json();
    // console.log(json);
    if (response.ok) {
      const json = await response.json();
      //const allTask = [...tasks];
      setTasks([...tasks, json.todo]);
      setTaskErr(false);
      setReRender([...reRender,'']);
    } else if (response.status === 400) {
      setTaskErr(true);
    }
  }

  const deleteTasks = async(t) => {
    console.log(t);
    const response = await fetch(`http://localhost:3000/events/${t.eventID}/todo/${t.taskID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    })

    if (response.ok) {
      const json = await response.json();
      setTaskErr(false);
      setReRender([...reRender,'']);
    }
  }

  const editTasks = async(idx,e) => {
    const allTask = tasks;
    allTask[idx].taskCompleted = e;
    setTasks(allTask);
  }

  React.useEffect(()=> {
    fetchDashboardData();
    fetchTasks();
  }, [reRender])

  return (
    <ThemeProvider theme={stepperTheme}>
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
              <Tooltip title={conversionText}>
                <Grid item xs={4}>
                  <Typography gutterBottom variant="body1" component="div" color="text.primary" align='center'>
                    Conversion Rate
                  </Typography>
                  <Item>{parseFloat(conversionRate).toFixed(2)}</Item>
                </Grid>
              </Tooltip>
              <Tooltip title={revenueText}>
                <Grid item xs={4}>
                  <Typography gutterBottom variant="body1" component="div" color="text.primary" align='center'>
                    Total Revenue
                  </Typography>
                  <Item>${revenue}</Item>
                </Grid>
              </Tooltip>
              <Tooltip title={ticketsSoldText}>
                <Grid item xs={4}>
                  <Typography gutterBottom variant="body1" component="div" color="text.primary" align='center'>
                    Tickets Sold
                  </Typography>
                  <Item>{ticketSold}</Item>
                </Grid>
              </Tooltip>
              <Grid item xs={6}>
                <Typography gutterBottom variant="body1" component="div" color="text.primary" align='center'>
                  To-Do {<Tooltip title={addTaskText}><button style={buttonStyle} onClick={()=>addInput()}>+</button></Tooltip>}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                {showTextInput && <>
                  <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '20vw' , height: '5vh'}}>
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Add a task ...."
                      inputProps={{ 'aria-label': 'Add tasks to your to do list' }}
                      onChange={(e) => setTaskName(e.target.value)}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="addTaskButton" onClick={()=>addTasks(taskName)}>
                      <AddIcon />
                    </IconButton>
                  </Paper >
                </>}
              </Grid>
              <Grid item xs={12}>
                <Item sx={{minHeight: '20vh', display: "flex", flexDirection: "column"}}> 
                  {(tasks.length !== 0) && tasks.map((t,idx)=> {
                    return (
                    <ListItem
                      key={t.taskDesciption}
                      secondaryAction={
                        <IconButton edge="end" aria-label="comments" onClick={()=>deleteTasks(t)}>
                          <RemoveCircleOutlineIcon/>
                        </IconButton>
                      }
                      disablePadding
                      >
                      <ListItemButton role={undefined} dense>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            onChange={(e)=>editTasks(idx,e.target.checked)}
                            checked={t.taskCompleted}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': idx}}
                          />
                        </ListItemIcon>
                        <ListItemText id={idx} primary={`${t.taskDescription}`} />
                      </ListItemButton>
                    </ListItem>
                    );
                  })}
                </Item>
                {taskErr && <Typography gutterBottom variant="body1" component="div" color="red" align='center'>
                  Maximum task reach, please remove 1 or more
                </Typography>}
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom variant="h6" component="div" color="purple">
                  Milestones Reached 
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Stepper nonLinear>
                  {steps.map((label, index) => (
                    <Step key={label} active = {true}>
                      <StepButton expanded={true}>
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
                {toggleState === "ticketPurchase" && <div>
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
    </ThemeProvider>
  );
    
}