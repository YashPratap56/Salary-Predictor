import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Card, CardContent, Typography, Button, 
  Grid, MenuItem, TextField, Box, CircularProgress, Paper 
} from '@mui/material';
import { Analytics, AttachMoney, Work, Business } from '@mui/icons-material';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    experience_level: '',
    employment_type: '',
    job_title: '',
    company_size: ''
  });
  const [options, setOptions] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(' https://salary-api-d8mr.onrender.com/options')
      .then(res => setOptions(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null); // Reset previous prediction
    try {
      const res = await axios.post(' https://salary-api-d8mr.onrender.com/options', formData);
      setPrediction(res.data.salary);
    } catch (error) {
      console.error("Error predicting:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!options) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );

  return (
    <div className="app-background">
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={6} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          {/* Header Section */}
          <Box sx={{ bgcolor: '#1976d2', p: 4, textAlign: 'center', color: 'white' }}>
            <Analytics sx={{ fontSize: 60, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              Salary Predictor AI
            </Typography>
            <Typography variant="subtitle1">
              Based on Global Data Science Trends
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                
                {/* Job Title */}
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Job Role"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    required
                    InputProps={{ startAdornment: <Work sx={{ color: 'action.active', mr: 1, my: 0.5 }} /> }}
                  >
                    {options.job_titles.map((job) => (
                      <MenuItem key={job} value={job}>
                        {job.toUpperCase().replace(/_/g, ' ')}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Experience Level */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Experience Level"
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    required
                  >
                    {options.experience_levels.map((lvl) => (
                      <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Employment Type */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Employment Type"
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleChange}
                    required
                  >
                    {options.employment_types.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Company Size */}
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Company Size"
                    name="company_size"
                    value={formData.company_size}
                    onChange={handleChange}
                    required
                    InputProps={{ startAdornment: <Business sx={{ color: 'action.active', mr: 1, my: 0.5 }} /> }}
                  >
                    {options.company_sizes.map((size) => (
                      <MenuItem key={size} value={size}>{size}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large" 
                    fullWidth 
                    disabled={loading}
                    sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
                  >
                    {loading ? "Calculating..." : "Predict Salary"}
                  </Button>
                </Grid>
              </Grid>
            </form>

            {/* Result Section */}
            {prediction && (
              <Box mt={4} p={3} bgcolor="#e3f2fd" borderRadius={2} textAlign="center">
                <Typography variant="h6" color="textSecondary">
                  Estimated Annual Salary
                </Typography>
                <Typography variant="h3" color="primary" fontWeight="bold" sx={{ mt: 1 }}>
                  ${prediction.toLocaleString()}
                </Typography>
                <Box display="flex" justifyContent="center" mt={1}>
                  <AttachMoney color="success" /> 
                  <Typography variant="body2" color="success.main">
                    High Confidence Prediction
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Paper>
      </Container>
    </div>
  );
}

export default App;