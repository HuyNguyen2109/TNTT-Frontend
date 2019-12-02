import React from 'react';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Copyright from './Copyright';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import SnackDialog from './SnackerBar';

import { Redirect } from 'react-router';
import { MenuItem } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';

const useStyles = theme => ({
  '@global': {
    body: {
      backgroundImage: 'url(https://source.unsplash.com/random)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
  },
  container: {
    backgroundColor: theme.palette.common.white,
  },
  menu: {
    width: 80,
  },
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cancel: {
    margin: theme.spacing(-1, 0, 2),
  },
  processing: {
    margin: theme.spacing(1),
  }
})

const ResponsiveDialog = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [redirect, setRedirect] = React.useState(false);

  const handleClose = () => {
    setRedirect(true);
  };

  if (redirect) {
    return (
      <Redirect push to="/" />
    )
  }

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Yêu cầu đăng ký thành công!"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Cám ơn bạn đã đăng ký tài khoản, Ban Quản Trị Xứ đoàn sẽ xem xét và gửi
            đến bạn thông tin đăng nhập qua email bạn đã đăng ký. Hãy chắc rằng bạn luôn kiểm tra
            email để không bỏ lỡ tài khoản đăng nhập của mình
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

class Signup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      openDialog: false,
      holyName: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      selectedDate: moment("1990-01-01").format(),
      selectedHolyDate: moment("1990-01-01").format(),
      defaultDate: moment("1990-01-01").format(),
      snackerBarStatus: false,
      snackbarMessage: "",
      selectedEmailProvider: "@gmail.com",
      isSignupClicked: false
    }
  }

  handleFormChange = (e, type) => {
    let data;
    if (type === 'email') {
      data = e.target.value.replace(/[^\w\s]/gi, "");
    } else if (type === "selectedDate" || type === "selectedHolyDate"){
      data = e
    } else {
      data = e.target.value
    }
    const result = {};
    result[type] = data;
    this.setState(result);
  }

  validateAndSend = (e) => {
    // eslint-disable-next-line
    const emailRegex = /^[^A-Za-z0-9]$/;
    // eslint-disable-next-line
    const fullEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // eslint-disable-next-line
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    const fullEmail = this.state.email + this.state.selectedEmailProvider;
    this.setState({ isSignupClicked: true });
    if (!phoneRegex.test(this.state.phoneNumber) && !emailRegex.test(this.state.email)) {
      this.setState({ snackerBarStatus: true })
      this.setState({ snackbarMessage: "Số điện thoại và email của bạn không hợp lệ" })
      this.setState({ isSignupClicked: false })
    }
    else {
      if (!fullEmailRegex.test(fullEmail)) {
        this.setState({ snackerBarStatus: true })
        this.setState({ snackbarMessage: "Email của bạn không hợp lệ!" })
        this.setState({ isSignupClicked: false })
      }
      else {
        if (!phoneRegex.test(this.state.phoneNumber)) {
          this.setState({ snackerBarStatus: true })
          this.setState({ snackbarMessage: "Số điện thoại của bạn không hợp lệ" })
          this.setState({ isSignupClicked: false })
        }
        else {
          const signUpData = {
            subject: `Yêu cầu mở tài khoản cho anh/chị GLV / Quý sơ/thầy ${this.state.holyName} ${this.state.firstName} ${this.state.lastName}`,
            email: fullEmail,
            text: `Chi tiết tài khoản
              Họ và tên: ${this.state.holyName} ${this.state.firstName} ${this.state.lastName}
              Số điện thoại: ${this.state.phoneNumber},
              Email: ${fullEmail},
              Sinh nhật: ${moment(this.state.selectedDate).format("DD/MM/YYYY")},
              Bổn mạng: ${moment(this.state.selectedHolyDate).format("DD/MM/YYYY")}`
          };

          axios
            .post('/backend/email/send', signUpData)
            .then((result) => {
              this.setState({ openDialog: !this.state.openDialog });
            })
            .catch((error) => {
              this.setState({ isSignupClicked: false })
              this.setState({ snackerBarStatus: true })
              this.setState({ snackbarMessage: "Đã có lỗi xảy ra trong quá trình đăng ký, vui lòng thử lại" })
            })
        }
      }
    }
  }

  clearAllData = () => {
    this.setState({
      holyName: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      selectedDate: "1990-01-01",
      selectedHolyDate: "1990-01-01",
      defaultDate: "1990-01-01"
    })
  }

  callbackSnackerBarHanlder = (callback) => {
    this.setState({ snackerBarStatus: callback })
  }

  render = () => {
    const { classes } = this.props;
    const emailProviders = [
      {
        value: '@gmail.com'
      },
      {
        value: '@yahoo.com'
      },
      {
        value: '@outlook.com'
      }
    ];

    return (
      <Container component="main" maxWidth="xs" className={classes.container}>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <PersonAddOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng ký tài khoản
        </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="fname"
                  name="holyName"
                  variant="outlined"
                  required
                  fullWidth
                  id="holyName"
                  label="Tên Thánh"
                  autoFocus
                  value={this.state.holyName}
                  onChange={e => this.handleFormChange(e, "holyName")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="Họ"
                  value={this.state.firstName}
                  onChange={e => this.handleFormChange(e, "firstName")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Tên"
                  name="lastName"
                  autoComplete="lname"
                  value={this.state.lastName}
                  onChange={e => this.handleFormChange(e, "lastName")}
                />
              </Grid>
              <Grid item xs={12} sm={7}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={this.state.email}
                  onChange={e => this.handleFormChange(e, "email")}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  variant="outlined"
                  required
                  select
                  fullWidth
                  id="email-provider"
                  label="Nhà cung cấp email"
                  name="email-provider"
                  autoComplete="email"
                  value={this.state.selectedEmailProvider}
                  onChange={e => this.handleFormChange(e, "selectedEmailProvider")}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                >
                  {emailProviders.map(emailProvider => (
                    <MenuItem key={emailProvider.value} value={emailProvider.value}>
                      {emailProvider.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="phone"
                  label="Điện thoại"
                  name="phone"
                  value={this.state.phoneNumber}
                  onChange={e => this.handleFormChange(e, "phoneNumber")}
                />
              </Grid>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid item xs={12}>
                  <KeyboardDatePicker
                    fullWidth
                    format="dd/MM/yyyy"
                    id="birthday"
                    label="Ngày sinh"
                    inputVariant="outlined"
                    value={this.state.selectedDate}
                    onChange={e => this.handleFormChange(e, "selectedDate")}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }} />
                </Grid>
                <Grid item xs={12}>
                  <KeyboardDatePicker
                    fullWidth
                    inputVariant="outlined"
                    format="dd/MM/yyyy"
                    id="holy-birthday"
                    label="Bổn mạng"
                    value={this.state.selectedHolyDate}
                    onChange={e => this.handleFormChange(e, "selectedHolyDate")}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }} />
                </Grid>
              </MuiPickersUtilsProvider>
            </Grid>
            <Button
              disabled={((this.state.holyName !== "" &&
                this.state.firstName !== "" &&
                this.state.lastName !== "" &&
                this.state.email !== "" &&
                this.state.phoneNumber !== "" &&
                this.state.selectedDate !== this.state.defaultDate &&
                this.state.selectedHolyDate !== this.state.defaultDate) && !this.state.isSignupClicked) ? false : true}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={e => this.validateAndSend(e)}
            >
              Đăng ký {(this.state.isSignupClicked) ? <CircularProgress className={classes.processing} size={15}></CircularProgress> : null}
            </Button>
            <Button
              disabled={(this.state.isSignupClicked === false) ? false : true}
              fullWidth
              variant="outlined"
              color="primary"
              className={classes.cancel}
              onClick={this.clearAllData}
            >
              Xóa
            </Button>
            <SnackDialog variant="error" message={this.state.snackbarMessage} className="error" callback={this.callbackSnackerBarHanlder} open={this.state.snackerBarStatus} />
            <ResponsiveDialog open={this.state.openDialog} />
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/" underline="none">
                  <Button
                    size="small"
                    color="primary"
                  >Bạn đã có tài khoản? Đăng nhập ngay!</Button>
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    )
  };
}

export default withStyles(useStyles)(Signup);