import React from 'react';
import clsx from 'clsx';
import { AppBar, Toolbar, Badge, Hidden, IconButton, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import { withStyles } from '@material-ui/styles';
import Promise from 'bluebird';

const useStyles = theme => ({
  root: {
    backgroundColor: theme.palette.default,
    position: 'absolute',
    background: 'transparent',
    boxShadow: 'none',
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - 240px)`,
      marginLeft: 240,
    },
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1),
    color: theme.palette.icon
  },
  icon: {
    color: theme.palette.icon,
    fontSize: 'small'
  },
  title: {
    color: "black"
  }
});

class Topbar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notifications: [],
      title: ''
    }
  }
  componentDidMount = () => {
    console.log(this.props)
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
          <div className={classes.flexGrow} />
          <Hidden mdDown>
            <IconButton className={classes.icon}>
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
              onClick={event => this.logOut(event)}
            >
              <InputIcon />
            </IconButton>
          </Hidden>
          <Hidden lgUp>
            <IconButton
              onClick={onSidebarOpen}
              className={classes.icon}
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
