import React from 'react';
import {
  withStyles,
} from '@material-ui/core/styles';
import {
  Cancel,
  Check,
  Person,
  LocationOn,
  Phone,
  Update,
  Backspace,
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
  formButton: {
    marginTop: theme.spacing(2),
  },
  iconInButton: {
    margin: theme.spacing(1)
  }
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

      dioceses: ['Giuse', 'Nữ Vương Mân Côi', 'Anna', 'Phêrô'],
      genders: ['Nam', 'Nữ'],
      classes: [],
    }
  }

  componentDidMount = () => {
    return this.getClass();
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.type === 'edit' && JSON.stringify(prevProps.selectedData.name) !== JSON.stringify(this.props.selectedData.name)) {
      const data = this.props.selectedData
      this.setState({
        newName: data.name,
        newFatherName: data.father_name,
        newMotherName: data.mother_name,

        newGender: (data.male === 'x') ? "Nam" : "Nữ",
        newContact: data.contact,

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

  handleCloseFloatingForm = (e) => {
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
              color="primary"
              size="small"
              className={classes.formButton}
              style={{ marginRight: '1em' }}
            ><Update className={classes.iconInButton} fontSize="small"/>Cập nhật</Button>
            :
            <div>
              <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.formButton}
                style={{ marginRight: '1em' }}
              ><Check className={classes.iconInButton} fontSize="small"/>Xác nhận</Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                className={classes.formButton}
                style={{ marginRight: '1em' }}
              ><Backspace className={classes.iconInButton} fontSize="small"/>Xóa</Button>
            </div>
          }
          <Button
            variant="outlined"
            color="primary"
            size="small"
            className={classes.formButton}
            onClick={e => this.handleCloseFloatingForm(e)}>
            <Cancel className={classes.iconInButton} fontSize="small"/>Hủy bỏ</Button>
        </Grid>
      </div>
    )
  }
};

export default withStyles(useStyles)(BasicInformation);