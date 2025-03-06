import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Footer from './Footer';

function Contact() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/send-email`,
        formData
      );
      alert(response.data.message);
    } catch (error) {
      alert("Failed to send message. Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
          py: 4,
          textAlign: 'center',
          color: 'common.white',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom>
            Get In Touch With Us
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            For more information about our products & services, drop us an email!
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ my: 4 }}>
        <Paper
          elevation={6}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid
              container
              spacing={2}
              sx={{
                // Force .MuiGrid-item to be maxWidth:100% on small screens
                '& .MuiGrid-item': {
                  [theme.breakpoints.down('sm')]: {
                    maxWidth: '100% !important',
                  },
                },
              }}
            >
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  variant="outlined"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  name="description"
                  variant="outlined"
                  multiline
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  sx={{
                    py: 1.5,
                  }}
                >
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      <Footer />
    </>
  );
}

export default Contact;
