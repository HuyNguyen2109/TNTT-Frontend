import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {
  colors
} from '@material-ui/core';

class Copyright extends React.Component {
  render = () => {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {' © '}
        <Link style={{color: `${colors.cyan[500]}`}} href="#">
          Xứ đoàn Annê Lê Thị Thành
        </Link>{' - '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  };
};

export default Copyright;