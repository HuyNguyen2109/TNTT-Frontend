import React from 'react';
import clsx from 'clsx';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import { withStyles } from '@material-ui/styles';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';
import CustomHeader from '../../../../../Dashboard/components/CustomHeader/CustomHeader';

const useStyles = (theme) => ({
  root: {
  },
  customInput: {
    '& label.Mui-focused': { color: '#795548' },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#795548',
      },
    },
  },
});

class AccountDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      holyname: '',
      fullname: '',
      birthday: moment("1990-01-01").format(),
      holyBirthday: moment("1990-01-01").format(),
      phoneNumber: '',
      class: '',
      email: '',
      //for Theme Color
      themeColor: 'linear-gradient(to right bottom, #a1887f, #795548)',
      outlinedThemeColor: '#795548'
    };
  }


  componentDidMount = () => {
    this._isMounted = true;
    if(this._isMounted === true) {
      this.props.userdata.then(result => {
        this.setState({
          username: result.data.data.username,
          fullname: result.data.data.fullname,
          holyname: result.data.data.holyname,
          birthday: moment(result.data.data.birthday).format(),
          holyBirthday: moment(result.data.data.holy_birthday).format(),
          phoneNumber: result.data.data.phone_number,
          class: result.data.data.class,
          email: result.data.data.email,
        })
      })
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  handleChange = (e, type) => {
    let data;
    if(type === 'birthday' || type === 'holyBirthday') {
      data = e
    }
    else {
      data = e.target.value
    }
    const result = {};
    result[type] = data;
    this.setState(result);
  }

  updateAccount = () => {
    const updateData = {
      'username':`${localStorage.getItem('username')}`,
      'content': {
        'fullname': `${this.state.fullname}`,
        'holyname': `${this.state.holyname}`,
        'email': `${this.state.email}`,
        'phoneNumber': `${this.state.phoneNumber}`,
        'birthday': `${this.state.birthday}`,
        'holyBirthday': `${this.state.holyBirthday}`
      }
    };

    axios
      .post('/backend/user/update', updateData)
      .then(result => {
        window.location.reload()
      })
      .catch(err => {
        console.log(err)
      })
  }

  cancelUpdate = () => {
    this.props.userdata.then(result => {
      this.setState({
        username: result.data.data.username,
        fullname: result.data.data.fullname,
        holyname: result.data.data.holyname,
        birthday: result.data.data.birthday,
        holyBirthday: result.data.data.holy_birthday,
        phoneNumber: result.data.data.phone_number,
        class: result.data.data.class,
        email: result.data.data.email,
      })
    })
  }

  render = () => {
    const { classes, userdata, className, ...rest } = this.props;

    return (
      <div className={clsx(classes.root, className)}>
        <CustomHeader style={{
          background: this.state.themeColor,
        }} title="Thông tin cá nhân" 
          subtitle="Chỉnh sửa những thông tin cần thiết"/>
      <Card
        {...rest}
        elevation={5}
      >
        <form
          autoComplete="off"
          noValidate
          style={{marginTop: '3em'}}
        >
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={12}
                xs={12}
              >
                <TextField
                  className={classes.customInput}
                  disabled={true}
                  fullWidth
                  label="Tên tài khoản"
                  margin="dense"
                  name="username"
                  required
                  value={this.state.username}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  className={classes.customInput}
                  fullWidth
                  label="Tên thánh"
                  margin="dense"
                  name="holyName"
                  onChange={e=>this.handleChange(e, "holyname")}
                  required
                  value={this.state.holyname}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  className={classes.customInput}
                  fullWidth
                  label="Email"
                  margin="dense"
                  name="email"
                  onChange={e=>this.handleChange(e, "email")}
                  required
                  value={this.state.email}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  className={classes.customInput}
                  fullWidth
                  label="Số điện thoại"
                  margin="dense"
                  name="phone"
                  required
                  onChange={e=>this.handleChange(e, "phoneNumber")}
                  value={this.state.phoneNumber}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    fullWidth
                    className={classes.customInput}
                    label="Sinh Nhật"
                    format="dd/MM/yyyy"
                    margin="dense"
                    name="birthday"
                    onChange={e=>this.handleChange(e, "birthday")}
                    required
                    value={this.state.birthday}
                    inputVariant="outlined"
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    fullWidth
                    className={classes.customInput}
                    label="Bổn mạng"
                    format="dd/MM/yyyy"
                    margin="dense"
                    name="holyBirthday"
                    onChange={e=>this.handleChange(e, "holyBirthday")}
                    required
                    value={this.state.holyBirthday}
                    inputVariant="outlined"
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  className={classes.customInput}
                  disabled={true}
                  fullWidth
                  label="Lớp"
                  margin="dense"
                  name="class"
                  required
                  value={this.state.class}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              variant="contained"
              onClick={this.updateAccount}
              style={{background: this.state.themeColor}}
            >
              Cập nhật tài khoản
            </Button>
            <Button
              color="primary"
              variant="outlined"
              onClick={this.cancelUpdate}
              style={{color: this.state.outlinedThemeColor, borderColor: this.state.outlinedThemeColor}}
            >
              Hủy
            </Button>
          </CardActions>
        </form>
      </Card>
      </div>
    );
  };
};

export default withStyles(useStyles)(AccountDetails);
