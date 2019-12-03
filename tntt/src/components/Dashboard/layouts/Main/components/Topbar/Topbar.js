import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { AppBar, Toolbar, Badge, Hidden, IconButton, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import logo from './logo.png'
import { withStyles } from '@material-ui/styles';
import Promise from 'bluebird';

const useStyles = theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
});

class Topbar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notifications: []
    }
  }

  logOut = (event) => {
    return Promise.resolve()
      .then(() => {
        localStorage.clear()
        window.location.href = '/'
      })
  }

  render = () => {
    const { classes, className, onSidebarOpen, ...rest } = this.props;

    return (
      <AppBar
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Toolbar>
          <RouterLink to="/dashboard/all">
            <img
              alt="Logo"
              src={logo}
              width="40px"
            />
          </RouterLink>
          <Typography variant="h6" style={{marginLeft: '1em'}}>Xứ đoàn Annê Lê Thị Thành</Typography>
          <div className={classes.flexGrow} />
          <Hidden mdDown>
            <IconButton color="inherit">
              <Badge
                badgeContent={this.state.notifications.length}
                color="primary"
                variant="dot"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              className={classes.signOutButton}
              color="inherit"
              onClick={event => this.logOut(event)}
            >
              <InputIcon />
            </IconButton>
          </Hidden>
          <Hidden lgUp>
            <IconButton
              color="inherit"
              onClick={onSidebarOpen}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  };
};

export default withStyles(useStyles)(Topbar);
