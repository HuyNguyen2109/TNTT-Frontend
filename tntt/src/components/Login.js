import React from 'react';
import axios from 'axios';
import {
  Avatar, Button, TextField, FormControlLabel, Checkbox,
  Grid, Link, IconButton, InputAdornment, CircularProgress, Typography, Toolbar
} from '@material-ui/core'
import { LockOutlined, Visibility, VisibilityOff, PersonOutlineOutlined, LockOpenOutlined } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles';
import SnackDialog from './SnackerBar';
import backgroundImage from '../img/background3.jpg';
import FormDialog from './FormDialog';

import cryptoJS from 'crypto-js';

const useStyles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.white
    }
  },
  root: {
    height: '100%',
    margin: 0,
    width: '100%',
  },
  image: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  avatar: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue
    padding: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  processing: {
    margin: theme.spacing(1),
  },
  quotes: {
    position: 'absolute',
    bottom: '1em',
    left: '1em',
    color: 'white',
    fontStyle: 'italic',
    width: '40%'
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
      windowHeight: 0,
      windowWidth: 0,
    };
    this._isMounted = false;
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  componentDidMount = () => {
    this._isMounted = true;
    this.updateWindowDimensions();
    if (localStorage.getItem('username') !== null && localStorage.getItem('isRememberMe') === 'true') {
      this.props.history.push('/general')
    }
    window.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        document.getElementById('loginButton').click();
      }
    })
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount = () => {
    this._isMounted = false;
    window.removeEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        document.getElementById('loginButton').click();
      }
    })
    window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions() {
    if (this._isMounted) {
      this.setState({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });
    }
  }

  toggleShow = () => {
    this.setState({ isHidden: !this.state.isHidden });
  }

  toggleShowForNewPassword = () => {
    this.setState({ isNewPasswordHidden: !this.state.isNewPasswordHidden });
  }

  toggleShowForConfirmPassword = () => {
    this.setState({ isConfirmPasswordHidden: !this.state.isConfirmPasswordHidden });
  }

  onChange = (e, type) => {
    e.preventDefault()
    const value = e.target.value;
    const result = {};
    result[type] = value;
    this.setState(result);
    this.setState({ isUsernameEmpty: !this.state.isUsernameEmpty });
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
        if (result && this.state.password === this.state.defaultPassword) {
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
              this.props.history.push('/general');
            })
        }
      })
      .catch(err => {
        if (err.response.status === 404) {
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
    this.setState({ isUpdateAccountClicked: true })
    if (this.state.newPassword !== this.state.confirmNewPassword) {
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
              if (result) {
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
          if (err.response.status === 404) {
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
    this.setState({ formDialogStatus: true });
  }

  handleRememberMeChanged = (e) => {
    this.setState({ isRememberMeChecked: !this.state.isRememberMeChecked })
  }

  callbackSnackerBarHanlder = (callback) => {
    this.setState({ snackerBarStatus: callback });
  }

  callbackFormDialogHandler = (callback, snackBarCallback) => {
    this.setState({ formDialogStatus: callback });
    if (snackBarCallback !== null) {
      if (snackBarCallback) {
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
      <Grid container className={classes.root}>
        <Grid item xs={false} sm={false} md={6} lg={5} className={classes.image}>
          <div className={classes.quotes}>
            <Typography variant="body1">
              Nếu Ðức Ki-tô đã không chỗi dậy, thì lời rao giảng của chúng tôi trống rỗng, và cả đức tin của anh em cũng trống rỗng. - 1Cor 15:14
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={7}>
          <div className={classes.paper} style={(this.state.windowWidth < 500) ? { padding: '1em' } : { padding: '6em' }}>
            <Toolbar disableGutters>
              <Avatar className={classes.avatar} src='/logo.png' style={(this.state.windowWidth < 500) ? { width: '2em', height: '2em' } : { width: '5em', height: '5em' }} />
              <Typography variant={this.state.windowWidth < 500 ? "h5" : "h2"}>Xứ đoàn Annê Lê Thị Thành</Typography>
            </Toolbar>
            <Typography variant={this.state.windowWidth < 500 ? "subtitle1" : "h6"} style={{ paddingTop: '2em' }}>Chào mừng quay trở lại, đăng nhập để tiếp tục</Typography>
            <form className={classes.form} noValidate style={{ paddingTop: '1em' }}>
              <Grid container spacing={1} alignItems='flex-end'>
                <Grid item>
                  <PersonOutlineOutlined color='primary' fontSize='large' />
                </Grid>
                <Grid item xs>
                  <TextField
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
                </Grid>
              </Grid>
              {
                (this.state.isDefaultPassword) ?
                  <React.Fragment>
                    <Grid container spacing={1} alignItems='flex-end'>
                      <Grid item>
                        <LockOutlined color='primary' fontSize='large' />
                      </Grid>
                      <Grid item xs>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="new-password"
                          label="Mật khẩu mới"
                          type={this.state.isNewPasswordHidden ? "password" : "text"}
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
                      </Grid>
                    </Grid>
                    <Grid container spacing={1} alignItems='flex-end'>
                      <Grid item>
                        <LockOutlined color='primary' fontSize='large' />
                      </Grid>
                      <Grid item xs>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="confirm-password"
                          label="Xác nhận lại mật khẩu mới"
                          type={this.state.isConfirmPasswordHidden ? "password" : "text"}
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
                      </Grid>
                    </Grid>
                    <Button
                      // type="submit"
                      disabled={((!this.state.newPassword || !this.state.confirmNewPassword) && !this.state.isUpdateAccountClicked) ? true : false}
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={event => this.updateAccount(event)}
                    >
                      Cập nhật tài khoản
                  </Button>
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <Grid container spacing={1} alignItems='flex-end'>
                      <Grid item>
                        <LockOpenOutlined color='primary' fontSize='large' />
                      </Grid>
                      <Grid item xs>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          label="Mật khẩu"
                          type={this.state.isHidden ? "password" : "text"}
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
                      </Grid>
                    </Grid>
                  </React.Fragment>
              }
              <Toolbar disableGutters>
                <FormControlLabel
                  control={<Checkbox checked={this.state.isRememberMeChecked} value="remember" color="primary" onChange={e => this.handleRememberMeChanged(e)} />}
                  label="Lưu tài khoản?"
                  style={{width: '100%', marginTop: '-3em'}}
                />
                <div style={{ flex: 1 }} />
                <Grid container spacing={0} align='right'>
                  <Grid item xs={12} style={{marginBottom: '1em', marginTop: '1em'}}>
                    <Typography variant='subtitle2'>
                      <Link href="#" onClick={this.handleFormDialog}>Quên mật khẩu?</Link>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{marginBottom: '1em'}}>
                    {(this.state.isDefaultPassword) ?
                      (null) :
                      (<Button
                        // type="submit"
                        id="loginButton"
                        disabled={(this.state.username !== "" && this.state.password !== "" && !this.state.isLoginClicked) ? false : true}
                        variant="contained"
                        color="primary"
                        onClick={event => this.checkAccount(event)}
                      >
                        Đăng nhập {(this.state.isLoginClicked && this.state.isChangedDefaultPassword) ? <CircularProgress className={classes.processing} size={15}></CircularProgress> : null}
                      </Button>)}
                  </Grid>
                  <Grid item xs={12} style={{marginBottom: '1em'}}>
                    <Typography variant='subtitle2'>
                      Chưa có tài khoản?
                    <Link href="/dang-ki" style={{ marginLeft: '3px' }}>
                        Đăng ký
                    </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Toolbar>
            </form>
          </div>
        </Grid>
        <FormDialog
          status={this.state.formDialogStatus}
          callback={this.callbackFormDialogHandler}
        />
        <SnackDialog
          variant={this.state.snackbarType}
          message={this.state.snackbarMessage}
          className={this.state.snackbarType}
          callback={this.callbackSnackerBarHanlder}
          open={this.state.snackerBarStatus}
        />
      </Grid>
    );
  }
}

export default withStyles(useStyles)(Signin);