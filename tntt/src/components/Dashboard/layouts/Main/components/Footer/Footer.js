import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography, Link, Grid } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {
    marginRight: '2em'
  }
}));

const Footer = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid container justify="flex-end" direction="row" spacing={2}>
        <Typography variant="body1">
        &copy;{' '}
          <Link
            component="a"
            href="#"
            target="_blank"
          >
            Xứ đoàn Annê Lê Thị Thành
          </Link>
          {" - " + moment().year()}
        </Typography>
      </Grid>
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string
};

export default Footer;
