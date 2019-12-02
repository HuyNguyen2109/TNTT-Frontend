import React from 'react';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import Copyright from './Copyright';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SnackDialog from './SnackerBar';
import backgroundImage from '../img/background3.jpg';
import FormDialog from './FormDialog';
import CircularProgress from '@material-ui/core/CircularProgress';

import cryptoJS from 'crypto-js';

const useStyles = theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  processing: {
    margin: theme.spacing(1),
  }
});

class Signin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      isHidden: true,
      isNewPasswordHidden: true,
      isConfirmPasswordHidden: true,
      defaultPassword: "1",
      isDefaultPassword: false,
      snackerBarStatus: false,
      snackbarMessage: "",
      snackbarType: "success",
      formDialogStatus: false,
      isRememberMeChecked: false,
      isLoginClicked: false,
      isChangedDefaultPassword: false,
      isUpdateAccountClicked: false,
    };
  }
  componentDidMount = () => {
    if(localStorage.getItem('username')!==null && localStorage.getItem('isRememberMe') === 'true') {
      this.props.history.push('/dashboard/all')
    }
  }

  toggleShow = () => {
    this.setState({isHidden: !this.state.isHidden});
  }

  toggleShowForNewPassword = () => {
    this.setState({isNewPasswordHidden: !this.state.isNewPasswordHidden});
  }

  toggleShowForConfirmPassword = () => {
    this.setState({isConfirmPasswordHidden: !this.state.isConfirmPasswordHidden});
  }

  onChange = (e, type) => {
    e.preventDefault()
    const value = e.target.value;
    const result = {};
    result[type] = value;
    this.setState(result);
    this.setState({isUsernameEmpty: !this.state.isUsernameEmpty});
  }

  checkAccount = (e) => {
    this.setState({
      isLoginClicked: true,
      isChangedDefaultPassword: false
    });
    const loginData = {
      'username': `${this.state.username}`,
      'password': `${cryptoJS.AES.encrypt(this.state.password, this.state.username, {
        mode: cryptoJS.mode.CBC,
        padding: cryptoJS.pad.Pkcs7
      })}`
    };

    axios
      .post('/backend/user/login', loginData)
      .then(result => {
        if(result && this.state.password === this.state.defaultPassword) {
          this.setState({
            oldPassword: this.state.password,
            password: "",
            snackbarType: "info",
            isDefaultPassword: true,
            snackerBarStatus: true,
            snackbarMessage: "Có vẻ như bạn vừa nhận được tài khoản từ ban quản trị, hãy đổi mật khẩu để bảo vệ tài khoản của bạn"
          });
        }
        else {
          axios
            .post('/backend/user/token', loginData)
            .then(result => {
              localStorage.setItem('username', this.state.username);
              localStorage.setItem('isRememberMe', this.state.isRememberMeChecked);
              localStorage.setItem('token', result.data.data.token);
              this.props.history.push('/dashboard/all');
            })
        }
      })
      .catch(err => {
        if(err.response.status === 404) {
          this.setState({
            snackbarType: "error",
            snackerBarStatus: true,
            snackbarMessage: "Mật khẩu không đúng hoặc tài khoản không tồn tại!",
            isLoginClicked: false,
            isChangedDefaultPassword: false
          });
        }
        if (err.response.status === 500) {
          this.setState({
            snackbarType: "error",
            snackerBarStatus: true,
            snackbarMessage: "Đã có lỗi xảy ra. Vui lòng thử lại!",
            isLoginClicked: false
          });
        }
      });
  }

  updateAccount = (e) => {
    e.preventDefault()
    this.setState({isUpdateAccountClicked: true})
    if(this.state.newPassword !== this.state.confirmNewPassword) {
      this.setState({
        snackbarType: "error",
        snackerBarStatus: true,
        snackbarMessage: "Mật khẩu không khớp",
        isUpdateAccountClicked: false
      });
    }
    else {
      const oldLoginData = {
        'username': `${this.state.username}`,
        'password': `${cryptoJS.AES.encrypt(this.state.oldPassword, this.state.username, {
          mode: cryptoJS.mode.CBC,
          padding: cryptoJS.pad.Pkcs7
        })}`
      }
      axios
        .post('/backend/user/login', oldLoginData)
        .then(result => {
          const newLoginData = {
            'username': `${this.state.username}`,
            'content': {
              'password': `${cryptoJS.AES.encrypt(this.state.newPassword, this.state.username, {
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
                  isDefaultPassword: false,
                  password: "",
                  isLoginClicked: false,
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
              isLoginClicked: false,
              isChangedDefaultPassword: false
            });
          }
          if (err.response.status === 500) {
            this.setState({
              snackbarType: "error",
              snackerBarStatus: true,
              snackbarMessage: "Đã có lỗi xảy ra. Vui lòng thử lại!",
              isLoginClicked: false,
              isChangedDefaultPassword: false
            });
          }
        });
    }
  }

  handleFormDialog = () => {
    this.setState({formDialogStatus: true});
  }

  handleRememberMeChanged = (e) => {
    this.setState({isRememberMeChecked: !this.state.isRememberMeChecked})
  }

  callbackSnackerBarHanlder = (callback) => {
    this.setState({snackerBarStatus: callback});
  }

  callbackFormDialogHandler = (callback, snackBarCallback) => {
    this.setState({formDialogStatus: callback});
    if(snackBarCallback !== null) {
      if(snackBarCallback) {
        this.setState({
          snackbarType: "info",
          snackerBarStatus: true,
          snackbarMessage: "Yêu cầu đã được gửi! Xin theo dõi email để nhận lại tài khoản!"
        });
      }
      else {
        this.setState({
          snackbarType: "error",
          snackerBarStatus: true,
          snackbarMessage: "Đã có lỗi xảy ra trong quá trình đăng ký, vui lòng thử lại"
        });
      }
    }
  }

  render = () => {
    const { classes } = this.props;

    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={9} className={classes.image} />
        <Grid item xs={12} sm={8} md={3} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Đăng nhập
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="account"
                label="Tài khoản"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={e => this.onChange(e, 'username')}
                value={this.state.username}
              />
              {
                (this.state.isDefaultPassword)? 
                <React.Fragment>
                  <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="new-password"
                  label="Mật khẩu mới"
                  type={this.state.isNewPasswordHidden ? "password": "text"}
                  id="new-password"
                  autoComplete="current-password"
                  value={this.state.newPassword}
                  onChange={e => this.onChange(e, 'newPassword')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label="toggle password visibility"
                          onClick={this.toggleShowForNewPassword}
                        >
                          {this.state.isNewPasswordHidden ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  />
                  <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="confirm-password"
                  label="Xác nhận lại mật khẩu mới"
                  type={this.state.isConfirmPasswordHidden ? "password": "text"}
                  id="confirm-password"
                  autoComplete="current-password"
                  onChange={e => this.onChange(e, 'confirmNewPassword')}
                  value={this.state.confirmNewPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label="toggle password visibility"
                          onClick={this.toggleShowForConfirmPassword}
                        >
                          {this.state.isConfirmPasswordHidden ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  />
                  <Button
                  // type="submit"
                  disabled={((!this.state.newPassword || !this.state.confirmNewPassword) && !this.state.isUpdateAccountClicked)? true : false}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick = {event => this.updateAccount(event)}
                  >
                    Cập nhật tài khoản
                  </Button>
                </React.Fragment>
                : 
                <React.Fragment>
                  <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type={this.state.isHidden ? "password": "text"}
                  id="password"
                  autoComplete="current-password"
                  onChange={e => this.onChange(e, 'password')}
                  value={this.state.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label="toggle password visibility"
                          onClick={this.toggleShow}
                        >
                          {this.state.isHidden ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  />
                  <Button
                  // type="submit"
                  disabled={(this.state.username !=="" && this.state.password !== "" && !this.state.isLoginClicked)? false : true}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick = {event => this.checkAccount(event)}
                  >
                    Đăng nhập {(this.state.isLoginClicked && this.state.isChangedDefaultPassword)? <CircularProgress className={classes.processing} size={15}></CircularProgress> : null}
                  </Button>
                </React.Fragment>
              }
              <SnackDialog 
                variant={this.state.snackbarType}
                message={this.state.snackbarMessage} 
                className={this.state.snackbarType} 
                callback={this.callbackSnackerBarHanlder} 
                open={this.state.snackerBarStatus}
              />
              <FormControlLabel
                control={<Checkbox checked={this.state.isRememberMeChecked} value="remember" color="primary" onChange={e => this.handleRememberMeChanged(e)}/>}
                label="Lưu tài khoản?"
                
              />
              <Grid container>
                <Grid item xs>
                  <Link href="#">
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={this.handleFormDialog}
                    >Quên mật khẩu?</Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/dang-ki">
                    <Button 
                      size="small" 
                      color="primary"
                      >Chưa có tài khoản? Đăng ký</Button>
                  </Link>
                </Grid>
              </Grid>
              <FormDialog 
                status={this.state.formDialogStatus}
                callback={this.callbackFormDialogHandler}
              />
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(useStyles)(Signin);