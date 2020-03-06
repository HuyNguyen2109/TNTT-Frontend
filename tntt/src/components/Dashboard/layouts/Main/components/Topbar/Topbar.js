import React from 'react';
import clsx from 'clsx';
import { AppBar, Toolbar, Hidden, IconButton, Tooltip, Typography, Popover, Badge, Grid, Divider, colors } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {
  PowerSettingsNew, Facebook, Notifications, Description, InfoOutlined, Backspace, Edit, Delete, Class, EventAvailable, AttachMoney, Face
} from '@material-ui/icons';
import { withStyles, lighten } from '@material-ui/core/styles';
import Promise from 'bluebird';

import { messaging } from '../../../../../init-fcm';
import firebaseKey from '../../../../common/firebase.json'
import axios from 'axios';
import _ from 'lodash';

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
      title: '',
      isActiveNotificationPanel: null,
      isBadgeActive: 0,
      oldNotifications: [],
      newNotifications: [],
    }
    this._isMounted = false;
  }

  componentDidMount = () => {
    let payload;
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
      payload = {
        data: message.data.firebaseMessaging.payload.data,
        timestamp: message.timeStamp
      }

      this.setState({
        newNotifications: this.state.newNotifications.concat(payload),
        isBadgeActive: 1
      })

      return axios.get('/backend/user/all')
        .then(results => {
          let users = results.data.data.filter(user => user.username !== localStorage.getItem('username'));
          let requests = [];
          users.forEach(user => {
            requests.push(axios.post(`/backend/user/notification/by-user/${user.username}`, payload))
          })

          return axios.all(requests)
        })
        .then((responses) => { })
        .catch(err => {
          console.log(err)
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
    switch (icon) {
      case 'Description':
        return (<Description style={{ color: `${colors.pink[300]}` }} fontSize='large' />)
      case 'Class':
        return (<Class style={{ color: `${colors.blue[300]}`}} fontSize='large' />)
      case 'Event':
        return (<EventAvailable style={{ color: `${colors.purple[300]}`}} fontSize='large' />)
      case 'Fund':
        return (<AttachMoney style={{ color: `${colors.green[300]}`}} fontSize='large' />)
      case 'InternalFund':
        return (<AttachMoney style={{ color: `${colors.orange[300]}`}} fontSize='large' />)
      case 'Children':
        return (<Face style={{ color: `${colors.purple[300]}` }} fontSize='large' />)
      case 'Edit':
        return (<Edit style={{ color: `${colors.cyan[300]}` }} fontSize='large' />)
      case 'Delete':
        return (<Delete style={{ color: `${colors.red[300]}` }} fontSize='large' />)
      default:
        return (<InfoOutlined color='primary' fontSize='large' />)
    }
  }

  getNotification = (username) => {
    return axios.get(`/backend/user/notification/by-user/${username}`)
      .then(results => {
        if (results.data.data.length > 0) {
          let notis = results.data.data;
          notis = _.orderBy(notis, (el) => { return el.data.timestamp }, ['desc'])
          notis = _.uniqBy(notis, 'data.timestamp')
          notis = notis.filter(el => !this.state.newNotifications.some(ell => el.data.timestamp === ell.data.timestamp))
          this.setState({
            oldNotifications: notis
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  logOut = (event) => {
    return Promise.resolve()
      .then(() => {
        localStorage.clear()
        window.location.href = '/'
      })
  }

  clearNotification = () => {
    if (this.state.newNotifications.length > 0) {
      this.setState({
        newNotifications: []
      })
    }
    return axios.delete(`/backend/user/notification/by-user/${localStorage.getItem('username')}`)
      .then((res) => {
        if (res.data.code === 'I001') {
          this.setState({
            isActiveNotificationPanel: null,
            oldNotifications: [],
            isBadgeActive: 0,
          })
        }
      })
      .catch(err => {
        console.log(err)
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
                this.getNotification(localStorage.getItem('username'))
              }}
            >
              <Badge color="error" badgeContent={this.state.isBadgeActive} variant='dot'>
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
          onClose={() => {
            this.setState({
              isActiveNotificationPanel: null,
              isBadgeActive: 0
            })

            if (this.state.newNotifications.length > 0) {
              let requests = []
              this.state.newNotifications.forEach(notify => {
                requests.push(axios.post(`/backend/user/notification/by-user/${localStorage.getItem('username')}`, notify))
              })
              return axios.all(requests)
                .then(res => { if (res) this.setState({ newNotifications: [] }) })
                .catch(err => console.log(err))
            }
          }}
        >
          <div
            style={{ width: '17em' }}
          >
            <Toolbar disableGutters>
              <Typography variant='subtitle1' style={{ fontWeight: 'bold', marginLeft: '1em' }}>Thông báo</Typography>
              <div style={{ flex: 1 }} />
              <Tooltip title="Xóa toàn bộ thông báo">
                <IconButton
                  component='div'
                  onClick={this.clearNotification}
                  disabled={this.state.oldNotifications.length > 0 ? false : true}>
                  <Backspace fontSize='small' />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </div>
          <Divider />
          <div
            style={{ padding: '1em', width: '17em', overflowX: 'auto', maxHeight: '25em' }}
          >
            {this.state.newNotifications.map(notify => (
              <Grid container spacing={2} style={{ margin: 0, width: '100%', backgroundColor: `${lighten(colors.cyan[500], 0.8)}` }} key={notify.timestamp}>
                <Grid item xs={2}>
                  <div className={classes.centerIconNotification}>
                    {this.renderIcon(notify.data.icon)}
                  </div>
                </Grid>
                <Grid item xs={10}>
                  <div className={classes.centerNotificationPayload}>
                    <Typography variant='caption'>{notify.data.timestamp}</Typography>
                    <Typography variant='subtitle1' style={{ fontWeight: 'bold' }}>{notify.data.title}</Typography>
                    <Typography variant='body2'>{notify.data.body}</Typography>
                  </div>
                </Grid>
              </Grid>
            ))}
            {(this.state.oldNotifications.length !== 0) ?
              (
                this.state.oldNotifications.map(notify => (
                  <Grid container spacing={2} style={{ margin: 0, width: '100%' }} key={notify.timestamp}>
                    <Grid item xs={2}>
                      <div className={classes.centerIconNotification}>
                        {this.renderIcon(notify.data.icon)}
                      </div>
                    </Grid>
                    <Grid item xs={10}>
                      <div className={classes.centerNotificationPayload}>
                        <Typography variant='caption'>{notify.data.timestamp}</Typography>
                        <Typography variant='subtitle1' style={{ fontWeight: 'bold' }}>{notify.data.title}</Typography>
                        <Typography variant='body2'>{notify.data.body}</Typography>
                      </div>
                    </Grid>
                  </Grid>
                ))
              ) : null}
            {(this.state.newNotifications.length === 0 && this.state.oldNotifications.length === 0) ?
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
              ) : null}
          </div>
        </Popover>
      </AppBar>
    );
  };
};

export default withStyles(useStyles)(Topbar);
