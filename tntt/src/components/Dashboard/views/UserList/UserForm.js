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
  Grid, Button, TextField, InputAdornment, MenuItem, Collapse, Typography
} from '@material-ui/core'
import {
  AccountCircle
} from '@material-ui/icons';

const useStyles = theme => ({
  root: {},
  primaryButton: {
    marginTop: theme.spacing(2),
    marginRight: '1em',
    color: '#FFFFFF',
    backgroundColor: '#009688',
  },
  secondaryButton: {
    marginTop: theme.spacing(2),
    marginRight: '1em',
    color: '#009688',
    backgroundColor: '#FFFFFF',
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
      email: '',
      birthday: moment('1990-01-01').format(),
      holyBirthday: moment('1990-01-01').format(),
      class: '',
      type: '',
      defaultDate: moment('1990-01-01').format(),
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

  removeVietnameseLetter = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
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

  componentDidUpdate = (prevProps) => {
    if(this.props.type === 'edit' && prevProps.selectedData !== this.props.selectedData && this.props.selectedData.username !== undefined) {
      const username = this.props.selectedData.username;

      return axios
        .get(`/backend/user/get-user/${username}`)
        .then(result => {
          const data = result.data.data;
          this.setState({
            username: data.username,
            holyName: data.holyname,
            fullname: data.fullname,
            phone: data.phone_number,
            email: data.email,
            birthday: (data.birthday === '') ? this.state.birthday : moment(data.birthday).format(),
            holyBirthday: (data.holy_birthday === '') ? this.state.holyBirthday : moment(data.holy_birthday).format(),
            class: data.class,
            type: data.type,
          });
        })
        .catch(err => {
          console.log(err)
        });
    }
  }

  createNewUser = () => {
    let arr = this.state.fullname.split(' ');
    let first = this.removeVietnameseLetter(arr[arr.length -1].toLowerCase());
    let last = '';
    for(let i = 0; i < arr.length - 1; i++) {
      last += arr[i].charAt(0).toLowerCase();
    }
    let birthday = moment(this.state.birthday).format('YYYY-MM-DD');
    const newUser = {
      'username': first+last+birthday.split('-')[2]+birthday.split('-')[1]+birthday.split('-')[0],
      'email': this.state.email,
      'holyname': this.state.holyName,
      'fullname': this.state.fullname,
      'phone_number': this.state.phone,
      'birthday': (this.state.birthday !== this.state.defaultDate)? moment(this.state.birthday).format('YYYY-MM-DD') : '',
      'holy_birthday': (this.state.holyBirthday !== this.state.defaultDate)? moment(this.state.holyBirthday).format('YYYY-MM-DD') : '',
      'type': this.state.type,
      'class': this.state.class
    };

    return axios.post('/backend/user/register', newUser)
      .then(res => {
        if (res.data.code === 'I001') {
          this.props.status('successfully')
        }
        this.handleCloseFloatingForm();
      })
      .catch(err => {
        this.props.status('failed')
      })
  }

  updateData = () => {
    const updateUser = {
      'username': this.state.username,
      'content': {
        'type': this.state.type,
        'class': this.state.class
      }
    }

    return axios
      .post('/backend/user/update', updateUser)
      .then(res => {
        if (res.data.code === 'I001') {
          this.props.status('successfully')
        }
        this.handleCloseFloatingForm();
      })
      .catch(err => {
        this.props.status('failed')
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
      email: '',
      birthday: moment('1990-01-01').format(),
      holyBirthday: moment('1990-01-01').format(),
      class: '',
      type: '',
    })
    this.props.callback(false);
    this.props.resetSelectedRow('')
  }

  handleResetForm = () => {
    this.setState({
      username: '',
      holyName: '',
      fullname: '',
      phone: '',
      email: '',
      birthday: moment('1990-01-01').format(),
      holyBirthday: moment('1990-01-01').format(),
      class: '',
      type: '',
    })
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
              disabled
              value={this.state.username}
              label="Tên tài khoản"
              onChange={e => this.handleFormChange(e, 'username')}
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
              required
              disabled={(this.props.type==='edit')? true: false}
              value={this.state.holyName}
              label="Tên thánh"
              onChange={e => this.handleFormChange(e, 'holyName')}
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
              disabled={(this.props.type==='edit')? true: false}
              value={this.state.fullname}
              label="Họ và tên"
              onChange={e => this.handleFormChange(e, 'fullname')}
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
              required
              disabled={(this.props.type==='edit')? true: false}
              value={this.state.email}
              label="Email"
              onChange={e => this.handleFormChange(e, 'email')}
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
              required
              disabled={(this.props.type==='edit')? true: false}
              value={this.state.phone}
              label="Số điện thoại"
              onChange={e => this.handleFormChange(e, 'phone')}
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
                required
                disabled={(this.props.type==='edit')? true: false}
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
                required
                disabled={(this.props.type==='edit')? true: false}
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
              className={classes.primaryButton}
              size='small'
              onClick={this.updateData}>
              Cập nhật
            </Button>
            :
            <div>
              <Button
                variant="contained"
                disabled={
                  (this.state.holyname === '' || 
                  this.state.fullname === '' || 
                  this.state.email === '' ||
                  this.state.phone === '' || 
                  this.state.birthday === this.state.defaultDate || 
                  this.state.holyBirthday === this.state.defaultDate)? true : false}
                size="small"
                className={classes.primaryButton}
                onClick={this.createNewUser}
              >Tạo mới</Button>
              <Button
                variant="contained"
                size='small'
                className={classes.primaryButton}
                onClick={this.handleResetForm}
              >Xóa</Button>
            </div>
          }
          <Button
            variant="contained"
            size='small'
            className={classes.secondaryButton}
            onClick={this.handleCloseFloatingForm}>
            Đóng</Button>
        </Grid>
      </Collapse>
    )
  };
}

export default withStyles(useStyles)(UserForm);
