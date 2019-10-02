import React from 'react';
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
import backgroundImage from './img/background.JPG';

import CryptoJS from 'crypto-js';

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
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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
    };
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
    e.preventDefault()
    if(this.state.password === this.state.defaultPassword) {
      this.setState({oldPassword: this.state.password});
      this.setState({password: ""});
      this.setState({snackbarType: "info"});
      this.setState({isDefaultPassword: true});
      this.setState({snackerBarStatus: true});
      this.setState({snackbarMessage: "Có vẻ như bạn vừa nhận được tài khoản từ ban quản trị, hãy đổi mật khẩu để bảo vệ tài khoản của bạn"})
    }
    // const plainTextToken = this.state.username + '/' + this.state.password;
    // let encryptedToken = CryptoJS.AES.encrypt(plainTextToken, this.state.username);
    // console.log("Token: ",encryptedToken.toString());

    // let bytes = CryptoJS.AES.decrypt(encryptedToken.toString(),this.state.username);
    // console.log("Plain text: ",bytes.toString(CryptoJS.enc.Utf8));
  }

  updateAccount = (e) => {
    e.preventDefault()
    if(this.state.newPassword !== this.state.confirmNewPassword) {
      this.setState({snackbarType: "error"});
      this.setState({snackerBarStatus: true});
      this.setState({snackbarMessage: "Mật khẩu không khớp"})
    }
    else {
      this.setState({snackbarType: "success"});
      this.setState({snackerBarStatus: true});
      this.setState({snackbarMessage: "Cập nhật tài khoản thành công"})
      this.setState({isDefaultPassword: false});
      this.setState({password: ""});
    }
  }

  callbackSnackerBarHanlder = (callback) => {
    this.setState({snackerBarStatus: callback})
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
                  disabled={(!this.state.newPassword || !this.state.confirmNewPassword)? true : false}
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
                  disabled={(!this.state.username || !this.state.password)? true : false}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick = {event => this.checkAccount(event)}
                  >
                    Đăng nhập
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
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              
              <Grid container>
                <Grid item xs>
                  <Link href="#">
                    Quên mật khẩu?
                  </Link>
                </Grid>
                <Grid item>
                    <Link href="/dang-ki">
                      {"Chưa có tài khoản? Đăng ký"}
                    </Link>
                </Grid>
              </Grid>
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