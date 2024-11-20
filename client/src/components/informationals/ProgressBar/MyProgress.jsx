import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#E16F7C',
    },
    secondary: {
      main: '#34113F',
    },
    info: {
      main: '#6665DD',
    },
    warning: {
      main: '#FDCA40',
    },
    success: {
      main: '#272838',
    },
  },
});

export function MyProgressCircularDeterminate({progress}) {
  return (
    <ThemeProvider theme={theme}>
      <CircularProgress variant='determinate' value={progress} color='warning'/>
    </ThemeProvider>
  );
}

export function MyProgressLinearInDeterminate({width}){
  return (
    <Box sx={{width:width, position:'absolute', bottom:0}}>
      <ThemeProvider theme={theme}>
        <LinearProgress color='info'/>
      </ThemeProvider>
    </Box>
  )
}
