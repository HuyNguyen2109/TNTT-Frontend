import React from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  withStyles
} from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
  Grid, Button, TextField, InputAdornment, MenuItem, Collapse, Paper, Typography
} from '@material-ui/core'
import {
  AccountCircle, Update, Check, Backspace, Cancel
} from '@material-ui/icons';

const useStyles = theme => ({
  root: {},
  iconInButton: {
    margin: theme.spacing(1)
  },
  formButton: {
    marginTop: theme.spacing(2),
  },
})

class UserForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      //for Remote Data
      username: '',
      holyName: '',
      fullname: '',
      phone: '',
      enail: '',
      birthday: moment('1990-01-01').format(),
      holyBirthday: moment('1990-01-01').format(),
      class: '',
      type: '',
      // for text field list
      classes: [],
      types: [
        {
          type: 'Admin'
        },
        {
          type: 'Guest'
        }
      ],
    };
  }

  getClass = () => {
    return axios
      .get('/backend/class/all')
      .then(result => {
        let classes = result.data.data;
        classes = classes.filter(el => el.Value !== "Chung");
        this.setState({
          classes: classes
        })
      })
  }

  componentDidMount = () => {
    return this.getClass();
  }

  createNewUser = () => {
    const newUser = {
      'username': this.state.username,
      'email': this.state.email,
      'holyname': this.state.holyName,
      'fullname': this.state.fullname,
      'phone_number': this.state.phone,
      'birthday': this.state.birthday,
      'holy_birthday': this.state.holyBirthday,
      'type': this.state.type,
      'class': this.state.class
    };

    return axios.post('/backend/user/register', newUser)
      .then(res => {
        if (res.data.code === 'I001') {
          this.reloadData();

        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  handleFormChange = (e, type) => {
    const result = {};
    let data;
    if (type === "birthday" || type === "holyBirthday") {
      data = e;
    }
    else {
      data = e.target.value;
    }
    result[type] = data;
    this.setState(result);
  }

  handleCloseFloatingForm = () => {
    this.setState({
      username: '',
      holyName: '',
      fullname: '',
      phone: '',
      enail: '',
      birthday: moment('1990-01-01').format(),
      holyBirthday: moment('1990-01-01').format(),
      class: '',
      type: '',
    })
    this.props.callback(false);
  }

  render = () => {
    const { classes, open } = this.props;

    return (
      <Collapse in={open}>
        <Typography variant="h6">
          Thông tin tài khoản
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              value={this.state.username}
              label="Tên tài khoản"
              onChange={e => this.handleChange(e, 'username')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AccountCircle />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              value={this.state.holyName}
              label="Tên thánh"
              onChange={e => this.handleChange(e, 'holyName')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AccountCircle />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              value={this.state.fullname}
              label="Họ và tên"
              onChange={e => this.handleChange(e, 'fullname')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AccountCircle />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              value={this.state.email}
              label="Email"
              onChange={e => this.handleChange(e, 'email')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AccountCircle />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              value={this.state.phone}
              label="Số điện thoại"
              onChange={e => this.handleChange(e, 'phone')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AccountCircle />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item xs={12} sm={3}>
              <KeyboardDatePicker
                fullWidth
                format="dd/MM/yyyy"
                label="Ngày sinh"
                value={this.state.birthday}
                onChange={e => this.handleFormChange(e, "birthday")}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <KeyboardDatePicker
                fullWidth
                format="dd/MM/yyyy"
                label="Bổn mạng"
                value={this.state.holyBirthday}
                onChange={e => this.handleFormChange(e, "holyBirthday")}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }} />
            </Grid>
          </MuiPickersUtilsProvider>
          <Grid item xs={12} sm={3}>
            <TextField
              required
              select
              label="Chức vụ"
              value={this.state.type}
              onChange={e => this.handleFormChange(e, "type")}
              fullWidth
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
            >
              {this.state.types.map(typeEl => (
                <MenuItem key={typeEl.type} value={typeEl.type}>
                  {typeEl.type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              required
              select
              label="Lớp"
              value={this.state.class}
              onChange={e => this.handleFormChange(e, "class")}
              fullWidth
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
            >
              {this.state.classes.map(classEl => (
                <MenuItem key={classEl.ID} value={classEl.ID}>
                  {classEl.Value}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Grid container alignItems="flex-start" justify="flex-end" direction="row" spacing={2}>
          {(this.props.type === "edit") ?
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.formButton}
              style={{ marginRight: '1em' }}
              onClick={this.updateData}
            ><Update className={classes.iconInButton} fontSize="small" />Cập nhật</Button>
            :
            <div>
              <Button
                variant="contained"
                disabled={(this.state.newName === '' || this.state.newFatherName === '' || this.state.newMotherName === '') ? true : false}
                color="primary"
                size="small"
                className={classes.formButton}
                style={{ marginRight: '1em' }}
                onClick={this.createNewUser}
              ><Check className={classes.iconInButton} fontSize="small" />Xác nhận</Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                className={classes.formButton}
                style={{ marginRight: '1em' }}
                onClick={this.handleResetForm}
              ><Backspace className={classes.iconInButton} fontSize="small" />Xóa</Button>
            </div>
          }
          <Button
            variant="outlined"
            color="primary"
            size="small"
            className={classes.formButton}
            onClick={this.handleCloseFloatingForm}>
            <Cancel className={classes.iconInButton} fontSize="small" />Hủy bỏ</Button>
        </Grid>
      </Collapse>
    )
  };
}

export default withStyles(useStyles)(UserForm);
