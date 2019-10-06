import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
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
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cancel: {
    margin: theme.spacing(-1, 0, 2),
  },
})

const ResponsiveDialog = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [redirect, setRedirect] = React.useState(false);

  const handleClose = () => {
    setRedirect(true);
  };

  if(redirect){
    return(
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
      selectedDate: "1990-01-01",
      selectedHolyDate: "1990-01-01",
      defaultDate: "1990-01-01",
      snackerBarStatus: false,
      snackbarMessage: "",
    }
  }

  handleFormChange = (e, type) => {
    const data = e.target.value;
    const result = {};
    result[type] = data;
    this.setState(result);
  }

  validateAndSend = (e) => {
    // eslint-disable-next-line
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // eslint-disable-next-line
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    if(!phoneRegex.test(this.state.phoneNumber) && !emailRegex.test(this.state.email)) {
      this.setState({snackerBarStatus: true})
      this.setState({snackbarMessage: "Số điện thoại và email của bạn không hợp lệ"})
    }
    else {
      if(!emailRegex.test(this.state.email)) {
        this.setState({snackerBarStatus: true})
        this.setState({snackbarMessage: "Email của bạn không hợp lệ!"})
      }
      else {
        if(!phoneRegex.test(this.state.phoneNumber)) {
          this.setState({snackerBarStatus: true})
          this.setState({snackbarMessage: "Số điện thoại của bạn không hợp lệ"})
        }
        else {
          fetch("http://localhost:6000/backend/email/send", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              holyName: this.state.holyName,
              firstname: this.state.firstName,
              lastname: this.state.lastName,
              email: this.state.email,
              text: `Chi tiết tài khoản
                Họ và tên: ${this.state.holyName} ${this.state.firstName} ${this.state.lastName}
                Số điện thoại: ${this.state.phoneNumber},
                Email: ${this.state.email},
                Sinh nhật: ${this.state.selectedDate},
                Bổn mạng: ${this.state.selectedHolyDate}`
            })
          })
          .then((result) => {
            console.log(result);
            this.setState({openDialog: !this.state.openDialog});
          })
          .catch((err) => {
            console.log(err);
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
    this.setState({snackerBarStatus: callback})
  }

  render = () => {
    const { classes } = this.props

    return (
      <Container component="main" maxWidth="xs" className={classes.container}>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
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
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  type="date"
                  id="birthday"
                  label="Ngày sinh"
                  name="birthday"
                  value={this.state.selectedDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={e => this.handleFormChange(e, "selectedDate")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  type="date"
                  id="holy-birthday"
                  label="Bổn mạng"
                  name="holy-birthday"
                  value={this.state.selectedHolyDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={e => this.handleFormChange(e, "selectedHolyDate")}
                />
              </Grid>
            </Grid>
            <Button
              disabled={(this.state.holyName !== "" && 
              this.state.firstName !== "" && 
              this.state.lastName !== "" && 
              this.state.email !== "" && 
              this.state.phoneNumber !== "" && 
              this.state.selectedDate !== this.state.defaultDate && 
              this.state.selectedHolyDate !== this.state.defaultDate) ? false : true}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={e => this.validateAndSend(e)}
              >
                Đăng ký
            </Button>
            <Button
            fullWidth
            variant="contained"
            color="secondary"
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