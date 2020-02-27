import React from 'react';
import axios from 'axios';
import {
  Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Dialog, DialogContent, DialogContentText, DialogTitle,
  useMediaQuery, useTheme, MenuItem, CircularProgress, DialogActions, AppBar, Toolbar, colors, FormControlLabel, Checkbox
} from '@material-ui/core';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import Copyright from './Copyright';
import SnackDialog from './SnackerBar';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  lighten
} from '@material-ui/core/styles';
import { Redirect } from 'react-router';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import backgroundImg from '../img/background2.jpg'
import { LockOpenOutlined } from '@material-ui/icons';

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
  background: {
    backgroundImage: `url(${backgroundImg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  appBar: {
    backgroundColor: `${lighten(colors.cyan[50], 0.7)}`,
    height: '6em',
  },
  verticalCenterToolbar: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  container: {
    position: 'relative',
    top: '50%',
    left: '50%', 
    transform: 'translate(-50%, -50%)'
  },
  menu: {
    width: 80,
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    padding: theme.spacing(4)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cancel: {
    margin: theme.spacing(-1, 0, 2),
  },
  processing: {
    margin: theme.spacing(1),
  },
  secondaryButton: {
    '&:hover': {
      backgroundColor: colors.cyan[500],
      color: 'white'
    }
  },
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
      isSignupClicked: false,
      windowHeight: 0,
      windowWidth: 0,
      isAgreePolicies: false,
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this._isMounted = false;
  }

  componentDidMount = () => {
    this._isMounted = true;
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount = () => {
    this._isMounted = false;
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

  handleFormChange = (e, type) => {
    let data;
    if (type === 'email') {
      data = e.target.value.replace(/[^\w\s]/gi, "");
    } else if (type === "selectedDate" || type === "selectedHolyDate") {
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
      <Grid container spacing={0} className={classes.root}>
        <Grid item xs={12} sm={12} md={6} lg={7}>
          <AppBar position='static' elevation={0} className={classes.appBar}>
            <Toolbar className={classes.verticalCenterToolbar}>
              <Avatar
                src='/logo.png'
                style={(this.state.windowWidth < 500) ? { width: '2em', height: '2em', marginRight: '3px' } : { width: '3em', height: '3em', marginRight: '5px' }} />
              <Typography variant={this.state.windowWidth < 500 ? 'subtitle1' : 'h5'} style={{ color: 'black' }}>Xứ đoàn Annê Lê Thị Thành</Typography>
              <div style={{ flex: 1 }} />
              <Link href="/" underline="none">
                <Button
                  size="small"
                  color="primary"
                  variant='outlined'
                  className={classes.secondaryButton}
                >
                  <LockOpenOutlined style={{ marginRight: '4px' }} color='inherit' fontSize='small' />
                  Tôi đã có tài khoản</Button>
              </Link>
            </Toolbar>
          </AppBar>
          <div className={classes.container} style={(this.state.windowWidth <= 840) ? { padding: '1em' } : { padding: '4em' }}>
            <Toolbar disableGutters>
              <div style={{ flex: 1 }} />
              <div align={this.state.windowWidth <= 840 ? 'center' : 'right'}>
                <Avatar
                  className={classes.avatar}
                  style={(this.state.windowWidth < 500) ? { width: '3em', height: '3em', marginLeft: '3px' } : { width: '4em', height: '4em', marginLeft: '5px' }}>
                  <PersonAddOutlinedIcon fontSize='large' style={{ color: 'white' }} />
                </Avatar>
                <Typography variant='h4' style={{ fontWeight: 'bold' }}>Đăng ký tài khoản mới</Typography>
              </div>
            </Toolbar>
            <form className={classes.form}>
              <Grid container spacing={1} style={{ margin: 0, width: '100%' }}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="fname"
                    name="holyName"
                    margin="dense"
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
                    margin="normal"
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
                    required
                    fullWidth
                    id="lastName"
                    margin="normal"
                    label="Tên"
                    name="lastName"
                    autoComplete="lname"
                    value={this.state.lastName}
                    onChange={e => this.handleFormChange(e, "lastName")}
                  />
                </Grid>
                <Grid item xs={12} sm={7}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    margin="normal"
                    name="email"
                    autoComplete="email"
                    value={this.state.email}
                    onChange={e => this.handleFormChange(e, "email")}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    required
                    select
                    fullWidth
                    id="email-provider"
                    margin="normal"
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
                <Grid item xs={12} sm={4}>
                  <TextField

                    required
                    fullWidth
                    id="phone"
                    margin="normal"
                    label="Điện thoại"
                    name="phone"
                    value={this.state.phoneNumber}
                    onChange={e => this.handleFormChange(e, "phoneNumber")}
                  />
                </Grid>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid item xs={12} sm={4}>
                    <KeyboardDatePicker
                      fullWidth
                      format="dd/MM/yyyy"
                      id="birthday"
                      label="Ngày sinh"
                      margin="normal"
                      inputVariant="standard"
                      value={this.state.selectedDate}
                      onChange={e => this.handleFormChange(e, "selectedDate")}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <KeyboardDatePicker
                      fullWidth
                      inputVariant="standard"
                      format="dd/MM/yyyy"
                      id="holy-birthday"
                      margin="normal"
                      label="Bổn mạng"
                      value={this.state.selectedHolyDate}
                      onChange={e => this.handleFormChange(e, "selectedHolyDate")}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }} />
                  </Grid>
                </MuiPickersUtilsProvider>
              </Grid>
            </form>
            <Toolbar>
              <FormControlLabel 
                control={<Checkbox checked={this.state.isAgreePolicies} onClick={() => {this.setState({isAgreePolicies: !this.state.isAgreePolicies})}}/>}
                label={<Typography variant='subtitle2'>
                  Khi tích chọn là bạn đã đồng ý với
                  <Link href='#' style={{marginLeft: '4px', marginRight: '4px'}}>Điều khoản</Link>
                  của Ban điều hành
                </Typography>}
              />
            </Toolbar>
          </div>
        </Grid>
        <Grid item xs={false} sm={false} md={6} lg={5} className={classes.background} />
      </Grid>
      // <Container component="main" maxWidth="xs" className={classes.container}>
      //   <CssBaseline />
      //   <div className={classes.paper}>
      //     <Avatar className={classes.avatar}>
      //       <PersonAddOutlinedIcon />
      //     </Avatar>
      //     <Typography component="h1" variant="h5">
      //       Đăng ký tài khoản
      //   </Typography>
      //     <form className={classes.form} noValidate>
      //       <Grid container spacing={1}>

      //       </Grid>
      //       <Button
      //         disabled={((this.state.holyName !== "" &&
      //           this.state.firstName !== "" &&
      //           this.state.lastName !== "" &&
      //           this.state.email !== "" &&
      //           this.state.phoneNumber !== "" &&
      //           this.state.selectedDate !== this.state.defaultDate &&
      //           this.state.selectedHolyDate !== this.state.defaultDate) && !this.state.isSignupClicked) ? false : true}
      //         fullWidth
      //         variant="contained"
      //         color="primary"
      //         margin="dense"
      //         className={classes.submit}
      //         onClick={e => this.validateAndSend(e)}
      //       >
      //         Đăng ký {(this.state.isSignupClicked) ? <CircularProgress className={classes.processing} size={15}></CircularProgress> : null}
      //       </Button>
      //       <Button
      //         disabled={(this.state.isSignupClicked === false) ? false : true}
      //         fullWidth
      //         variant="outlined"
      //         color="primary"
      //         className={classes.cancel}
      //         onClick={this.clearAllData}
      //       >
      //         Xóa
      //       </Button>
      //       <SnackDialog variant="error" message={this.state.snackbarMessage} className="error" callback={this.callbackSnackerBarHanlder} open={this.state.snackerBarStatus} />
      //       <ResponsiveDialog open={this.state.openDialog} />
      //       <Grid container justify="flex-end">
      //         <Grid item>
      //           <Link href="/" underline="none">
      //             <Button
      //               size="small"
      //               color="primary"
      //             >Bạn đã có tài khoản? Đăng nhập ngay!</Button>
      //           </Link>
      //         </Grid>
      //       </Grid>
      //     </form>
      //   </div>
      //   <Box mt={5}>
      //     <Copyright />
      //   </Box>
      // </Container>
    )
  };
}

export default withStyles(useStyles)(Signup);