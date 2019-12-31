import React from 'react';
import {
  withStyles,
} from '@material-ui/core/styles';
import {
  Person,
  LocationOn,
  Phone,
} from '@material-ui/icons/';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import {
  Grid,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
} from '@material-ui/core';
import axios from 'axios';


const useStyles = theme => ({
  root: {
    flexGrow: 1,
  },
  menu: {
    width: 200,
  },
  primaryButton: {
    marginTop: theme.spacing(2),
    marginRight: '1em',
    color: '#FFFFFF',
    background: 'linear-gradient(to right bottom, #ba68c8, #9c27b0)',
  },
  secondaryButton: {
    marginTop: theme.spacing(2),
    marginRight: '1em',
    color: '#9c27b0',
    backgroundColor: '#FFFFFF',
    borderColor: '#9c27b0',
  },
});

class BasicInformation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      newAddress: '',
      newName: '',
      newFatherName: '',
      newMotherName: '',
      newDiocese: 'Giuse',
      newGender: 'Nam',
      newContact: '',
      newClass: '',
      newBirthday: moment("1990-01-01").format(),
      newDayOfBaptism: moment("1990-01-01").format(),
      newDayofEucharist: moment("1990-01-01").format(),
      newDayofConfirmation: moment("1990-01-01").format(),
      defaultDate: moment("1990-01-01").format(),

      dioceses: ['Giuse', 'Nữ Vương Mân Côi', 'Anna', 'Phêrô'],
      genders: ['Nam', 'Nữ'],
      classes: [],
    }
  }

  componentDidMount = () => {
    return this.getClass();
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.type === 'edit' && JSON.stringify(prevProps.selectedData) !== JSON.stringify(this.props.selectedData) && this.props.selectedData.name !== undefined) {
      const name = this.props.selectedData.name
  
      return axios
        .get(`/backend/children/by-name/${name}`)
        .then(result => {
          const data = result.data.data[0]
          this.setState({
            newName: data.name,
            newFatherName: data.father_name,
            newMotherName: data.mother_name,
            newBirthday: (data.birthday === '') ? this.state.newBirthday : moment(data.birthday).format(),
            newDayOfBaptism: (data.day_of_baptism === '') ? this.state.newDayOfBaptism : moment(data.day_of_baptism).format(),
            newDayofEucharist: (data.day_of_eucharist === '') ? this.state.newDayofEucharist : moment(data.day_of_eucharist).format(),
            newDayofConfirmation: (data.day_of_confirmation === '') ? this.state.newDayofConfirmation : moment(data.day_of_confirmation).format(),
            newAddress: data.address,
            newGender: (data.male === 'x') ? "Nam" : "Nữ",
            newContact: data.contact,
            newClass: data.class,
            newDiocese: data.diocese
          });
        })
        .catch(err => {
          console.log(err)
        })
    }
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

  updateData = () => {
    const state = this.state;
    const updatedData = {
      'name': state.newName,
      'father_name': state.newFatherName,
      'mother_name': state.newMotherName,
      'diocese': state.newDiocese,
      'male': (state.newGender === 'Nam') ? 'x' : '',
      'female': (state.newGender === 'Nữ') ? 'x' : '',
      'class': state.newClass,
      'birthday': (state.newBirthday === state.defaultDate) ? '' : moment(state.newBirthday).format('YYYY-MM-DD'),
      'day_of_baptism': (state.newDayOfBaptism === state.defaultDate) ? '' : moment(state.newDayOfBaptism).format('YYYY-MM-DD'),
      'day_of_eucharist': (state.newDayofEucharist === state.defaultDate) ? '' : moment(state.newDayofEucharist).format('YYYY-MM-DD'),
      'day_of_confirmation': (state.newDayofConfirmation === state.defaultDate) ? '' : moment(state.newDayofConfirmation).format('YYYY-MM-DD'),
      'address': state.newAddress,
      'contact': state.newContact
    }

    return axios
      .post(`/backend/children/update/by-name/${state.newName}`, updatedData)
      .then(result => {
        if(result.data.code === 'I001') {
          this.props.updateStatus('successfully')
        }
        this.handleCloseFloatingForm();
      })
      .catch(err => {
        console.log(err);
        this.props.updateStatus('failed')
      })
  }

  createNewChildren = () => {
    const state = this.state;
    const newData = {
      'name': state.newName,
      'father_name': state.newFatherName,
      'mother_name': state.newMotherName,
      'diocese': state.newDiocese,
      'male': (state.newGender === 'Nam') ? 'x' : '',
      'female': (state.newGender === 'Nữ') ? 'x' : '',
      'class': state.newClass,
      'birthday': (state.newBirthday === state.defaultDate) ? '' : moment(state.newBirthday).format('YYYY-MM-DD'),
      'day_of_baptism': (state.newDayOfBaptism === state.defaultDate) ? '' : moment(state.newDayOfBaptism).format('YYYY-MM-DD'),
      'day_of_eucharist': (state.newDayofEucharist === state.defaultDate) ? '' : moment(state.newDayofEucharist).format('YYYY-MM-DD'),
      'day_of_confirmation': (state.newDayofConfirmation === state.defaultDate) ? '' : moment(state.newDayofConfirmation).format('YYYY-MM-DD'),
      'address': state.newAddress,
      'contact': state.newContact,
      'grades': [],
      'absents': []
    }
    return axios
      .post('/backend/children/create', newData)
      .then(result => {
        if(result.data.code === 'I001') {
          this.props.updateStatus('successfully')
        }
        this.handleCloseFloatingForm();
      })
      .catch(err => {
        console.log(err);
        this.props.updateStatus('failed')
      })
  }

  handleCloseFloatingForm = () => {
    this.setState({
      newAddress: '',
      newName: '',
      newFatherName: '',
      newMotherName: '',
      newDiocese: 'Giuse',
      newGender: 'Nam',
      newContact: '',
      newClass: '',
      newBirthday: moment("1990-01-01").format(),
      newDayOfBaptism: moment("1990-01-01").format(),
      newDayofEucharist: moment("1990-01-01").format(),
      newDayofConfirmation: moment("1990-01-01").format(),
    })
    this.props.callback(false);
    this.props.resetSelectedRow('');
  }

  handleResetForm = () => {
    this.setState({
      newAddress: '',
      newName: '',
      newFatherName: '',
      newMotherName: '',
      newDiocese: 'Giuse',
      newGender: 'Nam',
      newContact: '',
      newClass: '',
      newBirthday: moment("1990-01-01").format(),
      newDayOfBaptism: moment("1990-01-01").format(),
      newDayofEucharist: moment("1990-01-01").format(),
      newDayofConfirmation: moment("1990-01-01").format(),
    })
  }

  handleFormChange = (e, type) => {
    const result = {};
    let data;
    if (type === "newBirthday" || type === "newDayOfBaptism" || type === "newDayofEucharist" || type === "newDayofConfirmation") {
      data = e;
    }
    else {
      data = e.target.value;
    }
    result[type] = data;
    this.setState(result);
  }

  render = () => {
    const { classes, value, index } = this.props;

    return (
      <div
        key="basic"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpabel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              disabled={(this.props.type === 'edit')? true : false}
              autoFocus
              label="Tên Thiếu nhi"
              name="name"
              id="name"
              value={this.state.newName}
              onChange={e => this.handleFormChange(e, "newName")}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              required
              label="Họ tên Cha"
              name="fatherName"
              id="fatherName"
              value={this.state.newFatherName}
              onChange={e => this.handleFormChange(e, "newFatherName")}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              required
              label="Họ tên Mẹ"
              name="motherName"
              id="motherName"
              value={this.state.newMotherName}
              onChange={e => this.handleFormChange(e, "newMotherName")}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              required
              select
              label="Giáo khu"
              name="diocese"
              id="diocese"
              value={this.state.newDiocese}
              onChange={e => this.handleFormChange(e, "newDiocese")}
              fullWidth
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
            >
              {this.state.dioceses.map(diocese => (
                <MenuItem key={diocese} value={diocese}>
                  {diocese}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              required
              select
              label="Giới tính"
              name="gender"
              id="gender"
              value={this.state.newGender}
              onChange={e => this.handleFormChange(e, "newGender")}
              fullWidth
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
            >
              {this.state.genders.map(gender => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item xs={12} sm={3}>
              <KeyboardDatePicker
                fullWidth
                format="dd/MM/yyyy"
                id="birthday"
                label="Ngày sinh"
                value={this.state.newBirthday}
                onChange={e => this.handleFormChange(e, "newBirthday")}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <KeyboardDatePicker
                fullWidth
                format="dd/MM/yyyy"
                id="dayOfBaptism"
                label="Ngày Rửa tội"
                value={this.state.newDayOfBaptism}
                onChange={e => this.handleFormChange(e, "newDayOfBaptism")}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <KeyboardDatePicker
                fullWidth
                format="dd/MM/yyyy"
                id="dayOfEucharist"
                label="Ngày Rước lễ"
                value={this.state.newDayofEucharist}
                onChange={e => this.handleFormChange(e, "newDayofEucharist")}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <KeyboardDatePicker
                fullWidth
                format="dd/MM/yyyy"
                id="dayOfConfirmation"
                label="Ngày Thêm sức"
                value={this.state.newDayofConfirmation}
                onChange={e => this.handleFormChange(e, "newDayofConfirmation")}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }} />
            </Grid>
          </MuiPickersUtilsProvider>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              label="Địa chỉ"
              name="address"
              id="address"
              value={this.state.newAddress}
              onChange={e => this.handleFormChange(e, "newAddress")}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              label="Liên lạc"
              name="contact"
              id="contact"
              value={this.state.newContact}
              onChange={e => this.handleFormChange(e, "newContact")}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Phone />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              select
              label="Lớp"
              name="class"
              id="class"
              value={this.state.newClass}
              onChange={e => this.handleFormChange(e, "newClass")}
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
                size='small'
                disabled={(this.state.newName === '' || this.state.newFatherName === '' || this.state.newMotherName === '')? true : false}
                className={classes.primaryButton}
                onClick={this.createNewChildren}
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
      </div>
    )
  }
};

export default withStyles(useStyles)(BasicInformation);
