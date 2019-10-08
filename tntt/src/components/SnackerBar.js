import React from 'react';
import clsx from 'clsx';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import { amber, green } from '@material-ui/core/colors'; 

import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
  close: {
    padding: theme.spacing(0.5),
  },
  snackbarIcon: {
    fontSize: 20,
  },
  snackbarIconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  snackbarMargin: {
    margin: theme.spacing(1),
  },
  snackbarMessage: {
    display: 'flex',
    alignItems: 'center',
  }
})

class SnackDialog extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      close: false
    }
  }

  handleCloseSnackBar = () => {
    this.props.callback(false);
  }

  render = () => {
    const {variant, message, className, open} = this.props;
    const { classes } = this.props
    const variantIcon = {
      success: CheckCircleIcon,
      warning: WarningIcon,
      error: ErrorIcon,
      info: InfoIcon,
    };
    const Icon = variantIcon[className];

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={(open) ? true : false}
        autoHideDuration={6000}
        onClose={this.handleCloseSnackBar}
      >
        <SnackbarContent
          className={clsx(classes[variant], classes.snackbarMargin)}
          aria-describedby="message-id"
          message={
            <span id="message-id" className={classes.snackbarMessage}>
              <Icon className={clsx(classes.snackbarIcon, classes.snackbarIconVariant)} />
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              className={classes.close}
              onClick={this.handleCloseSnackBar}
            >
              <CloseIcon className={classes.snackbarIcon} />
            </IconButton>,
          ]}
        />
      </Snackbar>
    )
  }
}

export default withStyles(useStyles)(SnackDialog);