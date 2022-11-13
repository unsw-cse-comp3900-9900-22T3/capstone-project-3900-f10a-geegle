import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { Link } from 'react-router-dom';


const FilteredListings = ({filteredListings}) => {

  return (
    <>
    {filteredListings.map((obj, idx) => {
      return (
        <Card key={idx} sx={{ maxWidth: '100%' ,display: 'grid', gridTemplateColumns: '3fr 6fr'}}>
          <CardMedia
              component="img"
              height="100%"
              image={obj.image1}
              alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
            {obj.eventName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            {obj.eventType +' | '+ obj.eventVenue+' | '+obj.capacity}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            {"Description: "+ obj.eventDescription}
            </Typography>
            {/* {Array(Math.ceil(obj.eachEvent.ratingRatio * 5))
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
            {Array(5 - Math.ceil(obj.eachEvent.ratingRatio * 5))
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
              Average Rating: {obj.eachEvent.averageRating}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reviews: {obj.eachEvent.reviews.length}
            </Typography> */}

          </CardContent>
          <CardActions>
            <Button 
              component={Link}
              to= {{pathname: `/event/view/${obj.eventID}`}}
              //state= {{state: obj.eachEvent}}
              state= {obj}
              size="small">
                view
            </Button>
          </CardActions>
        </Card> 
      )})
    }
    </>
  );
};
export default FilteredListings;