import React from 'react';
import clsx from 'clsx';
import { AppBar, Toolbar, Badge, Hidden, IconButton, Tooltip, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
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
  icon: {
    color: theme.palette.dark,
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

  componentDidUpdate = (prevProps) => {
    if(this.props.title !== prevProps.title) {
      this.setState({
        title: this.props.title
      });
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
          <Typography variant="h6" style={{color: '#000000'}}>{this.state.title}</Typography>
          <div className={classes.flexGrow} />
          <Hidden mdDown>
            <Tooltip title="Thông báo">
              <IconButton className={classes.icon} >
                <Badge
                  badgeContent={this.state.notifications.length}
                  color="primary"
                  variant="dot"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Đăng xuất">
              <IconButton
                className={classes.icon}
                onClick={event => this.logOut(event)}
              >
                <PowerSettingsNewIcon />
              </IconButton>
            </Tooltip>
          </Hidden>
          <Hidden lgUp>
            <Tooltip title="Đăng xuất">
              <IconButton
                className={classes.icon}
                onClick={event => this.logOut(event)}
              >
                <PowerSettingsNewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Menu">
              <IconButton
                onClick={onSidebarOpen}
                className={classes.icon}
              >
                <MenuIcon />
            </IconButton>
            </Tooltip>
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  };
};

export default withStyles(useStyles)(Topbar);
