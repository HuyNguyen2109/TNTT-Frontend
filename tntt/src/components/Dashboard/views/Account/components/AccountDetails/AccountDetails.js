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
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';

const useStyles = (theme) => ({
  root: {}
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
    };
  }


  componentDidMount = () => {
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
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form
          autoComplete="off"
          noValidate
        >
          <CardHeader
            subheader="Chỉnh sửa những thông tin cần thiết"
            title="Thông tin cá nhân"
          />
          <Divider />
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
            >
              Cập nhật tài khoản
            </Button>
            <Button
              color="primary"
              variant="outlined"
              onClick={this.cancelUpdate}
            >
              Hủy
            </Button>
          </CardActions>
        </form>
      </Card>
    );
  };
};

export default withStyles(useStyles)(AccountDetails);
