import React from 'react';
import clsx from 'clsx';
import { AppBar, Toolbar, Hidden, IconButton, Tooltip, Typography, Popover, Badge, Grid } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {
  PowerSettingsNew, Facebook, Notifications, Description, InfoOutlined
} from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import Promise from 'bluebird';

import { messaging } from '../../../../../init-fcm';
import firebaseKey from '../../../../common/firebase.json'
import axios from 'axios';

const useStyles = theme => ({
  root: {
    backgroundColor: `white`,
    position: 'fixed',
    background: 'transparent',
    boxShadow: 'none',
    [theme.breakpoints.up('sm')]: {
      width: `100%`,
      marginLeft: 0,
    },
    [theme.breakpoints.up('md')]: {
      width: `100%`,
      marginLeft: 0,
    },
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - 240px)`,
      marginLeft: '240px',
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
  },
  popoverContent: {
    width: '15em',
    height: '30em',
    padding: theme.spacing(2)
  },
  badge: {
    backgroundColor: 'red'
  },
  centerIconNotification: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerNotificationPayload: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)'
  }
});

class Topbar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notificationsPayload: [],
      title: '',
      isActiveNotificationPanel: null,
    }
    this._isMounted = false;
  }

  componentDidMount = () => {
    this.is_Mounted = true;
    messaging.requestPermission()
      .then(() => {
        return messaging.onTokenRefresh()
      })
      .then(() => {
        return messaging.getToken()
      })
      .then((token) => {
        localStorage.setItem('firebase-token', token)
        return axios.post(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/TNTT`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `key=${firebaseKey.serverKey}`
          }
        }).then(res => { })
      })
      .catch((err) => {
        console.log('Unable to get permission to notify: ', err)
      })
    navigator.serviceWorker.addEventListener('message', (message) => {
      let payload = {
        data: message.data.firebaseMessaging.payload.data,
        timestamp: message.timeStamp
      }
      this.setState({
        notificationsPayload: this.state.notificationsPayload.concat(payload),
      })
    })
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.title !== prevProps.title) {
      this.setState({
        title: this.props.title
      });
    }
  }

  componentWillUnmount = () => {
    this.is_Mounted = false;
  }

  renderIcon = (icon) => {
    switch(icon) {
      case 'Description':
        return (<Description style={{color: 'green'}} fontSize='large' />)
      default:
        return (<InfoOutlined color='primary' fontSize='large' />)
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
          <Typography variant="h6" style={{ color: '#000000' }}>{this.state.title}</Typography>
          <div className={classes.flexGrow} />
          <Tooltip title="Đến trang Facebook Xứ Đoàn">
            <IconButton
              className={classes.icon}
              onClick={() => window.open('https://www.facebook.com/thieunhicaothai/?ref=bookmarks', '_blank')}
            >
              <Facebook />
            </IconButton>
          </Tooltip>
          <Tooltip title="Thông báo">
            <IconButton
              className={classes.icon}
              onClick={(e) => {
                this.setState({
                  isActiveNotificationPanel: e.target,
                })
              }}
            >
              <Badge color="error" badgeContent={this.state.notificationsPayload.length} variant='dot'>
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          <Hidden mdDown>
            <Tooltip title="Đăng xuất">
              <IconButton
                className={classes.icon}
                onClick={event => this.logOut(event)}
              >
                <PowerSettingsNew />
              </IconButton>
            </Tooltip>
          </Hidden>

          <Hidden lgUp>
            <Tooltip title="Đăng xuất">
              <IconButton
                className={classes.icon}
                onClick={event => this.logOut(event)}
              >
                <PowerSettingsNew />
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
        <Popover
          anchorEl={this.state.isActiveNotificationPanel}
          open={Boolean(this.state.isActiveNotificationPanel)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          onClose={() => { this.setState({ isActiveNotificationPanel: null, notificationsPayload: [] }) }}
        >
          <div
            style={{ padding: '1em', width: '17em' }}
          >
            {(this.state.notificationsPayload.length !== 0) ?
              (
                this.state.notificationsPayload.map(notify => (
                  <Grid container spacing={2} style={{ margin: 0, width: '100%' }} key={notify.timestamp}>
                    <Grid item xs={2}>
                      <div className={classes.centerIconNotification}>
                        {this.renderIcon(notify.data.icon)}
                      </div>
                    </Grid>
                    <Grid item xs={10}>
                      <div className={classes.centerNotificationPayload}>
                        <Typography variant='caption'>{notify.data.timestamp}</Typography>
                        <Typography variant='subtitle1' style={{fontWeight: 'bold'}}>{notify.data.title}</Typography>
                        <Typography variant='body2'>{notify.data.body}</Typography>
                      </div>
                    </Grid>
                  </Grid>
                ))
              ) :
              (
                <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
                  <Grid item xs={2}>
                    <div className={classes.centerIconNotification}>
                      <InfoOutlined color='primary' fontSize='large' />
                    </div>
                  </Grid>
                  <Grid item xs={10}>
                    <div className={classes.centerNotificationPayload}>
                      <Typography variant='subtitle1'>Không có thông báo mới</Typography>
                    </div>
                  </Grid>
                </Grid>
              )}
          </div>
        </Popover>
      </AppBar>
    );
  };
};

export default withStyles(useStyles)(Topbar);
