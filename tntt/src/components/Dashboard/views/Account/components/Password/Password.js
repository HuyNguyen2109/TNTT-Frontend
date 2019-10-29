import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import cryptoJS from 'crypto-js';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField,
  Grid
} from '@material-ui/core';
import SnackDialog from '../../../../../SnackerBar';

const useStyles = () => ({
  root: {}
});

class Password extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',

      snackerBarStatus: false,
      snackbarMessage: "",
      snackbarType: "success",
    }
  }
  callbackSnackerBarHanlder = (callback) => {
    this.setState({snackerBarStatus: callback});
  }

  updatePassword = (e) => {
    e.preventDefault();
    if(this.state.newPassword !== this.state.confirmPassword) {
      this.setState({
        snackbarType: "error",
        snackerBarStatus: true,
        snackbarMessage: "Mật khẩu không khớp",
      });
    }
    else {
      const oldLoginData = {
        'username': `${localStorage.getItem('username')}`,
        'password': `${cryptoJS.AES.encrypt(this.state.currentPassword, localStorage.getItem('username'), {
          mode: cryptoJS.mode.CBC,
          padding: cryptoJS.pad.Pkcs7
        })}`
      }
      axios
        .post('/backend/user/login', oldLoginData)
        .then(result => {
          const newLoginData = {
            'username': `${localStorage.getItem('username')}`,
            'content': {
              'password': `${cryptoJS.AES.encrypt(this.state.newPassword, localStorage.getItem('username'), {
                mode: cryptoJS.mode.CBC,
                padding: cryptoJS.pad.Pkcs7
              })}`
            }
          }
          axios
            .post('/backend/user/update', newLoginData)
            .then(result => {
              if(result) {
                this.setState({
                  snackbarType: "success",
                  snackerBarStatus: true,
                  snackbarMessage: "Cập nhật tài khoản thành công",
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: ""
                });
              }
            });
        })
        .catch(err => {
          if(err.response.status === 404) {
            this.setState({
              snackbarType: "error",
              snackerBarStatus: true,
              snackbarMessage: "Mật khẩu không đúng hoặc tài khoản không tồn tại!",
            });
          }
          if (err.response.status === 500) {
            this.setState({
              snackbarType: "error",
              snackerBarStatus: true,
              snackbarMessage: "Đã có lỗi xảy ra. Vui lòng thử lại!",
            });
          }
        });
    }
  };

  handleChange = (e, type) => {
    let data;
    data = e.target.value
    const result = {};
    result[type] = data;
    this.setState(result);
  };

  render = () => {
    const { classes, className, ...rest } = this.props;

    return (
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form>
          <CardHeader
            subheader="Thay đổi mật khẩu"
            title="Mật khẩu"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={12} xs={12}>
                <TextField
                  fullWidth
                  label="Mật khẩu hiện tại"
                  name="currentPassword"
                  onChange={e => this.handleChange(e, "currentPassword")}
                  type="password"
                  value={this.state.currentPassword}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField
                  fullWidth
                  label="Mật khẩu mới"
                  name="newPassword"
                  onChange={e => this.handleChange(e, "newPassword")}
                  type="password"
                  value={this.state.newPassword}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField
                  fullWidth
                  label="Xác nhận lại mật khẩu mới "
                  name="confirmPassword"
                  onChange={e => this.handleChange(e, "confirmPassword")}
                  type="password"
                  value={this.state.confirmPassword}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              variant="outlined"
              onClick={event => this.updatePassword(event)}
            >
              Thay đổi mật khẩu
          </Button>
          </CardActions>
        </form>
        <SnackDialog 
                variant={this.state.snackbarType}
                message={this.state.snackbarMessage} 
                className={this.state.snackbarType} 
                callback={this.callbackSnackerBarHanlder} 
                open={this.state.snackerBarStatus}
              />
      </Card>
    );
  }
}

Password.propTypes = {
  className: PropTypes.string
};

export default withStyles(useStyles)(Password);
