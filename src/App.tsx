import { Button, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

const App = () => {

  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setshortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchShortUrls();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLongUrl(event.target.value);
  };

  const fetchShortUrls = async () => {
    setLoading(true);
    fetch(`http://localhost:8080/api/shorten?longUrl=${longUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        const shortUrlJson = data.shortUrl;
        setLoading(false);
        setshortUrl(shortUrlJson);    
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const redirectToLongUrl = async (shortUrl: string) => {

    fetch(`http://localhost:8080/${shortUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        window.location.href = data.shortUrl;
      })
      .catch(error => {
        console.error('Error:', error);
      });
    
  }

  useEffect(() => {
    const urlString = window.location.href;
    if (urlString.startsWith('http://localhost:3000/') && urlString.length > 'http://localhost:3000/'.length) {
      console.log('String has characters after "http://localhost:3000/"');
      const charactersAfter = urlString.substring('http://localhost:3000/'.length);
      redirectToLongUrl(charactersAfter);
    }
  }, []);

  return (
    <div className="App">
        <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            URL Shortener
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <TextField
            label="URL"
            fullWidth
            value={longUrl}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
            Shorten URL
          </Button>
        </Grid>
        {!loading ? (
          <Grid item xs={12} sm={8} md={6}>
            <Typography variant="body1" align="center">
              Short URL: <a href={shortUrl}>{shortUrl}</a>
            </Typography>
          </Grid>
        ) : 
        (
        <Grid item xs={12} sm={8} md={6}>
          <Typography variant="body1" align="center">
            GENERATING...
          </Typography>
        </Grid>
        )}
      </Grid>

    </div>
  );
}

export default App;
