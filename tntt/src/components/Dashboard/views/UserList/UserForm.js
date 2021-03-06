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
  Grid, Button, TextField, InputAdornment, MenuItem, Collapse, Typography, Avatar
} from '@material-ui/core'
import {
  AccountCircle
} from '@material-ui/icons';

import firebaseKey from '../../common/firebase.json'

const useStyles = theme => ({
  root: {},
  primaryButton: {
    marginTop: theme.spacing(2),
    marginRight: '1em',
    color: '#FFFFFF',
    background: 'linear-gradient(to right bottom, #4db6ac, #009688)',
  },
  secondaryButton: {
    marginTop: theme.spacing(2),
    marginRight: '1em',
    color: '#009688',
    backgroundColor: '#FFFFFF',
    borderColor: '#009688'
  },
  menu: {
    width: 200
  },
  customInput: {
    '& label.Mui-focused': { color: '#009688' },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#009688',
    },
  },
})

class UserForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentUserPosition: '',
      //for Remote Data
      username: '',
      holyName: '',
      fullname: '',
      phone: '',
      email: '',
      birthday: moment('1990-01-01').format(),
      holyBirthday: moment('1990-01-01').format(),
      class: '',
      type: 'Member',
      defaultDate: moment('1990-01-01').format(),
      // for text field list
      classes: [],
      types: [
        {
          title: 'Ban điều hành',
          type: 'Admin'
        },
        {
          title: 'Trưởng ngành',
          type: 'Leader'
        },
        {
          title: 'Thành viên',
          type: 'Member'
        }
      ],
      windowHeight: 0,
      windowWidth: 0,
      userAvatar: '',
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this._isMounted = false;
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

  buildFireBaseNotification = (title, content, timestamp, icon) => {
    let payload = {
      data: {
        title: title,
        body: content,
        timestamp: timestamp,
        icon: icon
      },
      to: '/topics/TNTT',
      time_to_live: 30
    }
    return payload
  }

  componentDidMount = () => {
    this._isMounted = true;
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
    return this.getClass() &&
    axios.get(`/backend/user/get-user/${localStorage.getItem('username')}`)
      .then(res => {
        if (this._isMounted) {
          this.setState({
            currentUserPosition: res.data.data.type
          })
        }
      });
  }

  componentDidUpdate = (prevProps) => {
    if (this._isMounted && this.props.type === 'edit' && prevProps.selectedData !== this.props.selectedData && this.props.selectedData.username !== undefined) {
      const username = this.props.selectedData.username;

      return axios.all([
        axios.get(`/backend/user/get-user/${username}`),
        axios.get(`/backend/user/avatar/by-name/${username}`, {
          responseType: 'blob'
        })
      ])
        .then(result => {
          const data = result[0].data.data;
          let blob = new Blob([result[1].data], { type: `${result[1].headers['content-type']}` })
          let avatarUrl = window.URL.createObjectURL(blob) || window.webkitURL.createObjectURL(blob);
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
            userAvatar: avatarUrl,
          });
        })
        .catch(err => {
          console.log(err)
        });
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
    this._isMounted = false;
  }

  updateWindowDimensions = () => {
    if (this._isMounted) {
      this.setState({
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
      })
    }
  }

  createNewUser = () => {
    let arr = this.state.fullname.split(' ');
    let first = this.removeVietnameseLetter(arr[arr.length - 1].toLowerCase());
    let last = '';
    for (let i = 0; i < arr.length - 1; i++) {
      last += arr[i].charAt(0).toLowerCase();
    }
    let birthday = moment(this.state.birthday).format('YYYY-MM-DD');
    const newUser = {
      'username': first + last + birthday.split('-')[2] + birthday.split('-')[1] + birthday.split('-')[0],
      'email': this.state.email,
      'holyname': this.state.holyName,
      'fullname': this.state.fullname,
      'phone_number': this.state.phone,
      'birthday': (this.state.birthday !== this.state.defaultDate) ? moment(this.state.birthday).format('YYYY-MM-DD') : '',
      'holy_birthday': (this.state.holyBirthday !== this.state.defaultDate) ? moment(this.state.holyBirthday).format('YYYY-MM-DD') : '',
      'type': this.state.type,
      'class': this.state.class,
    };

    const firebaseNotification = this.buildFireBaseNotification(
      'Huynh Trưởng/GLV',
      `${localStorage.getItem('username')} vừa tạo tài khoản ${newUser.username}`,
      moment().format('DD/MM/YYYY hh:mm:ss'),
      'User'
    )

    return axios.post('/backend/user/register', newUser)
      .then(res => {
        if (res.data.code === 'I001') {
          this.props.status('successfully')
        }
        this.handleCloseFloatingForm();
        return axios.post(firebaseKey.endpoint, firebaseNotification, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `key=${firebaseKey.serverKey}`
          }
        }).then(res => { })
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

    const firebaseNotification = this.buildFireBaseNotification(
      'Huynh Trưởng/GLV',
      `${localStorage.getItem('username')} vừa cập nhật lớp/chức danh cho tài khoản ${updateUser.username}`,
      moment().format('DD/MM/YYYY hh:mm:ss'),
      'Edit'
    )

    return axios
      .post('/backend/user/update', updateUser)
      .then(res => {
        if (res.data.code === 'I001') {
          this.props.status('successfully')
        }
        this.handleCloseFloatingForm();
        return axios.post(firebaseKey.endpoint, firebaseNotification, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `key=${firebaseKey.serverKey}`
          }
        }).then(res => { })
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
      <Collapse in={open} style={{ marginTop: '2em' }}>
        <Typography variant="h5">
          Thông tin tài khoản
        </Typography>
        <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
          <Grid item xs={false} md={3} lg={3} style={(this.state.windowWidth <= 500) ? { display: 'none' } : {}}>
            <div align='center'>
              <Avatar alt={this.state.username} src={this.state.userAvatar} style={{ width: '10em', height: '10em' }} />
            </div>
          </Grid>
          <Grid item xs={12} md={9} lg={9}>
            <div>
              <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    disabled
                    className={classes.customInput}
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
                    className={classes.customInput}
                    disabled={(this.props.type === 'edit') ? true : false}
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
                    disabled={(this.props.type === 'edit') ? true : false}
                    value={this.state.fullname}
                    label="Họ và tên"
                    className={classes.customInput}
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
                    disabled={(this.props.type === 'edit') ? true : false}
                    value={this.state.email}
                    className={classes.customInput}
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
                    className={classes.customInput}
                    disabled={(this.props.type === 'edit') ? true : false}
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
                      disabled={(this.props.type === 'edit') ? true : false}
                      format="dd/MM/yyyy"
                      label="Ngày sinh"
                      value={this.state.birthday}
                      className={classes.customInput}
                      onChange={e => this.handleFormChange(e, "birthday")}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <KeyboardDatePicker
                      fullWidth
                      required
                      disabled={(this.props.type === 'edit') ? true : false}
                      format="dd/MM/yyyy"
                      label="Bổn mạng"
                      className={classes.customInput}
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
                    disabled={this.state.currentUserPosition !== 'Admin'? true : false}
                    label="Chức vụ"
                    value={this.state.type}
                    className={classes.customInput}
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
                        {typeEl.title}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    disabled={this.state.currentUserPosition !== 'Admin'? true : false}
                    label="Lớp"
                    value={this.state.class}
                    className={classes.customInput}
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
            </div>
          </Grid>
        </Grid>
        <Grid container alignItems="flex-start" justify="flex-end" direction="row" spacing={2}>
          {(this.props.type === "edit") ?
            <Button
              variant="contained"
              className={classes.primaryButton}
              size='small'
              onClick={this.updateData}
              disabled={this.state.currentUserPosition !== 'Admin'? true : false}>
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
                    this.state.holyBirthday === this.state.defaultDate) ? true : false}
                size="small"
                className={classes.primaryButton}
                onClick={this.createNewUser}
              >Tạo mới</Button>
              <Button
                variant="contained"
                size='small'
                className={classes.secondaryButton}
                onClick={this.handleResetForm}
              >Xóa</Button>
            </div>
          }
          <Button
            variant="outlined"
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
