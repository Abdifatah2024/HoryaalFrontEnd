// import React from "react";
// import { Container, Typography, Button, Box } from "@mui/material";

// const Home: React.FC = () => {
//   return (
//     <Container maxWidth="md">
//       <Box textAlign="center" mt={8}>
//         <Typography variant="h3" component="h1" gutterBottom>
//           Welcome to Our Website
//         </Typography>
//         <Typography variant="h6" color="textSecondary" paragraph>
//           We provide high-quality services to help you succeed. Explore our offerings and get started today.
//         </Typography>
//         <Button variant="contained" color="primary" size="large">
//           Get Started
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default Home;
import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, AppBar, Toolbar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const Home: React.FC = () => {
  return (
    <>
     

      <Container sx={{ mt: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Welcome to Our School
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Manage students, teachers, classes, and events efficiently.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <SchoolIcon fontSize="large" color="primary" />
                <Typography variant="h5">Classes</Typography>
                <Typography>Manage and schedule classes easily.</Typography>
                <Button variant="outlined" sx={{ mt: 2 }}>View More</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <PeopleIcon fontSize="large" color="primary" />
                <Typography variant="h5">Students</Typography>
                <Typography>Enroll and manage student data.</Typography>
                <Button variant="outlined" sx={{ mt: 2 }}>View More</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <MenuBookIcon fontSize="large" color="primary" />
                <Typography variant="h5">Subjects</Typography>
                <Typography>Organize curriculum and subjects.</Typography>
                <Button variant="outlined" sx={{ mt: 2 }}>View More</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <EventIcon fontSize="large" color="primary" />
                <Typography variant="h5">Events</Typography>
                <Typography>Plan school events and activities.</Typography>
                <Button variant="outlined" sx={{ mt: 2 }}>View More</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
