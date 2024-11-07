import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

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

export function MyProgressCircular({progress}) {
  return (
    <ThemeProvider theme={theme}>
      <CircularProgress variant='determinate' value={progress} color='warning'/>
    </ThemeProvider>
  );
}
