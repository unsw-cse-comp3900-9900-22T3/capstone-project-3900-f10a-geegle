import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';


const PublishedCard = ({
  eventObj, 
  idx
}) => {
  //console.log(eventObj)
  return (
    <Grid container item xs={12} >
      <Card key={idx} style={{display: 'flex', width: '100%', height:'20rem'}} >
        <Box id="card media" width = "40%" >
          <CardMedia
              component="img"
              height="100%"
              image={eventObj.image1}
              alt="event thumbnail"
              style={{overflow:"auto"}}
          />
        </Box>
        <Box id="card contend and action container" style={{display:'flex', flexDirection: 'column', width:'60%'}}>
          <Box id="card content" style={{height:'90%', overflow:'auto'}}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {eventObj.eventName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {eventObj.eventType +' | '+ eventObj.eventVenue+' | '+eventObj.capacity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`Description:  ${eventObj.eventDescription}`}
              </Typography>
              {Array(Math.ceil(eventObj.averageRating))
                .fill(0)
                .map((_, i) => (
                  <svg
                    key={i}
                    height="35"
                    width="35"
                    aria-label="coloured star rating"
                  >
                    <polygon
                      points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78"
                      fill="#ffd800"
                    />
                  </svg>
                ))}
              {Array(5 - Math.ceil(eventObj.averageRating))
                .fill(0)
                .map((_, i) => (
                  <svg
                    key={i}
                    height="35"
                    width="35"
                    aria-label="uncoloured star rating"
                  >
                    <polygon
                      points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78"
                      fill="#7e7e7e"
                      stroke="#7e7e7e"
                      strokeWidth="1"
                    />
                  </svg>
                ))}
              <Typography variant="body2" color="text.secondary">
                Average Rating: {eventObj.averageRating}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reviews: {(eventObj.reviews).length}
              </Typography>
            </CardContent>
          </Box>
          <Box id= "card actions">
            <CardActions>
              <Button 
                component={Link}
                to= {{pathname: `/event/view/${eventObj.eventID}`}}
                state= {eventObj}
                size="small">
                  view
              </Button>
            </CardActions>
          </Box>
        </Box>
      </Card> 
    </Grid>
  )
}
export default PublishedCard;