import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: 'none'
  },
  image: {
    width: '3em',
    height: '3em'
  }
}));

const Topbar = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      color="primary"
      position="fixed"
    >
      <Toolbar>
        <RouterLink to="/" style={{flexGrow: 1}}>
          <img
            alt="Logo"
            src="./logo.png"
            className={classes.image}
          />
        </RouterLink>
        <Typography variant="subtitle1">Xứ đoàn Anê Lê Thị Thành</Typography>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string
};

export default Topbar;
