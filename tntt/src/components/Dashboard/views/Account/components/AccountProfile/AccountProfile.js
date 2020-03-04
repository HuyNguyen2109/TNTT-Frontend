import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import {
  Paper,
  Avatar,
  Typography,
  Divider,
  Fab,
  Toolbar,
  colors,
} from '@material-ui/core';
import SnackDialog from '../../../../../SnackerBar';
import { AccountCircle, Delete } from '@material-ui/icons';

const useStyles = theme => ({
  root: {
    paddingTop: '7em',
  },
  avatar: {
    width: 130,
    height: 130,
    margin: theme.spacing(1),
    marginBottom: '-3em',
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxShadow: '0 16px 38px -12px rgba(0,0,0,0.56), 0 4px 25px 0px rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.2)'
  },
  content: {
    textAlign: 'center',
    paddingBottom: '2em'
  },
  uploadButton: {
    margin: theme.spacing(1),
    color: theme.palette.white,
  }
});

class AccountProfile extends React.Component {
  constructor() {
    super();

    this.state = {
      holyname: '',
      fullname: '',
      birthday: '1990-01-01',
      holyBirthday: '1990-01-01',
      email: '',
      phoneNumber: '',
      type: '',
      currentTime: '',
      //set default color
      themeColor: 'linear-gradient(to right bottom, #a1887f, #795548)',
      secondaryColor: `linear-gradient(to right bottom, ${colors.red[300]}, ${colors.red[500]})`,

      snackerBarStatus: false,
      snackbarType: 'success',
      snackbarMessage: '',
      avatarURL: '',
    };

  };

  formatUserType = (type) => {
    switch (type) {
      case 'root':
        return 'Lâp trình viên';
      case 'Admin':
        return 'Ban điều hành';
      case 'Leader':
        return 'Trưởng ngành';
      case 'Member':
        return 'Thành viên';
      default:
        return 'Khách';
    }
  }

  componentDidMount = () => {
    this._isMounted = true;
    if (this._isMounted === true) {
      this.displayTime();
      this.props.userdata.then(result => {
        this.setState({
          //for display on website
          fullname: result.data.data.fullname,
          holyname: result.data.data.holyname,
          //for calculating the progress
          birthday: result.data.data.birthday,
          holyBirthday: result.data.data.holy_birthday,
          phoneNumber: result.data.data.phone_number,
          email: result.data.data.email,
          type: result.data.data.type
        })
      })
    }
    this.getUserAvatar();
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  }

  displayTime = () => {
    if (this._isMounted === true) {
      this.setState({
        currentTime: moment().format('hh:mm:ss A')
      })
      setTimeout(this.displayTime, 1000);
    }
  }

  getUserAvatar = () => {
    return axios.get(`/backend/user/avatar/by-name/${localStorage.getItem('username')}`, {
      responseType: 'blob'
    })
      .then(res => {
        let data = new Blob([res.data], { type: `${res.headers['content-type']}` })
        let avatarUrl = window.URL.createObjectURL(data) || window.webkitURL.createObjectURL(data);
        if (this._isMounted) {
          this.setState({
            avatarURL: avatarUrl
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  uploadAvatar = (e) => {
    let data = new FormData()
    data.append('file', e.target.files[0])

    return axios.post(`/backend/user/avatar/by-name/${localStorage.getItem('username')}`, data)
      .then(res => {
        if (res.data.code === "I001") {
          this.setState({
            snackerBarStatus: true,
            snackbarType: 'success',
            snackbarMessage: 'Tải lên thành công',
          })
          setTimeout(window.location.reload(), 2000)
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({
          snackerBarStatus: true,
          snackbarType: 'error',
          snackbarMessage: 'Đã có lỗi từ máy chủ',
          isButtonDisabled: false,
          isLoading: false,
        })
      })
  }

  deleteAvatar = () => {
    return axios.delete(`/backend/user/avatar/by-name/${localStorage.getItem('username')}`)
    .then(res => {
      if (res.data.code === "I001") {
        this.setState({
          snackerBarStatus: true,
          snackbarType: 'success',
          snackbarMessage: 'Xóa ảnh đại diện thành công',
        })
        setTimeout(window.location.reload(), 1000)
      }
    })
    .catch(err => {
      console.log(err)
      this.setState({
        snackerBarStatus: true,
        snackbarType: 'error',
        snackbarMessage: 'Đã có lỗi từ máy chủ',
        isButtonDisabled: false,
        isLoading: false,
      })
    })
  }

  callbackSnackerBarHanlder = (callback) => {
    this.setState({ snackerBarStatus: callback });
  }

  render = () => {
    const { classes, className, ...rest } = this.props;

    return (
      <div align="center" style={{ marginTop: '-40px' }}>
        <Avatar id={localStorage.getItem('username')} className={classes.avatar} src={this.state.avatarURL} />
        <Paper
          {...rest}
          className={clsx(classes.root, className)}
          elevation={5}
        >
          <Typography
            className={classes.locationText}
            color="textSecondary"
            variant="body1"
            style={{ paddingBottom: '1em' }}
          >
            {this.formatUserType(this.state.type)}
          </Typography>
          <Typography
            variant="h6"
          >
            {`${this.state.holyname} ${this.state.fullname}`}
          </Typography>
          <Typography
            className={classes.dateText}
            color="textSecondary"
            variant="subtitle1"
            style={{ paddingBottom: '1em' }}
          >
            {this.state.currentTime} (+7)
          </Typography>
          <Divider />
          <Toolbar disableGutters>
            <Fab
              className={classes.uploadButton}
              style={{ background: this.state.themeColor }}
              onClick={() => { document.getElementById('filePicker').click() }}
              variant="extended"
            >
              <AccountCircle style={{ marginRight: '5px' }} />
              Cập nhật ảnh đại diện
            </Fab>
            <div style={{flex:1}} />
            <Fab
              className={classes.uploadButton}
              style={{ background: this.state.secondaryColor }}
              onClick={this.deleteAvatar}
              variant="extended"
            >
              <Delete style={{marginRight: '5px'}}/>
              Xóa ảnh đại diện
            </Fab>
          </Toolbar>
        </Paper>
        <SnackDialog
          variant={this.state.snackbarType}
          message={this.state.snackbarMessage}
          className={this.state.snackbarType}
          callback={this.callbackSnackerBarHanlder}
          open={this.state.snackerBarStatus}
        />
        <input id="filePicker" type="file" onChange={e => this.uploadAvatar(e)} accept="image/*" style={{ 'display': 'none' }} />
      </div>
    )
  }
};

AccountProfile.propTypes = {
  className: PropTypes.string,
  mount: PropTypes.bool
};

export default withStyles(useStyles)(AccountProfile);
