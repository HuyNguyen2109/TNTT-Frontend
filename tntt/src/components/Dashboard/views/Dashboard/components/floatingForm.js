import React from 'react';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';
import {
  Cancel,
  Check
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
  Collapse,
  MenuItem,
} from '@material-ui/core';

const useStyles = theme => ({
  root: {
  },
  menu: {
    width: 200,
  },
  formButton: {
    marginTop: theme.spacing(2),
  },
});

const confirmButon = createMuiTheme({
  palette: {
    primary: {
      500: '#25d366'
    },
  },
})

const errorButton = createMuiTheme({
  palette: {
    secondary: {
      A400: '#f42069'
    },
  },
})

class FloatingForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      newAddress: '',
      newFirstname: '',
      newLastName: '',
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
    }
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

  handleCloseFloatingForm = (e) => {
    this.props.callback(false);
  }

  render = () => {
    const { classes, open } = this.props;
    return (
      <Collapse in={open}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Tên thánh và Họ"
              name="firstName"
              id="firstName"
              value={this.state.newFirstname}
              onChange={e => this.handleFormChange(e, "newFirstname")}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Tên"
              name="lastName"
              id="lastName"
              value={this.state.newLastName}
              onChange={e => this.handleFormChange(e, "newLastName")}
              fullWidth
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
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Lớp"
              name="class"
              id="class"
              value={this.state.newClass}
              onChange={e => this.handleFormChange(e, "newClass")}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container alignItems="flex-start" justify="flex-end" direction="row" spacing={2}>
          <MuiThemeProvider theme={confirmButon}>
            <Button
              variant="contained"
              color="primary"
              className={classes.formButton}
              style={{marginRight: '1em'}}
              >
              <Check fontSize="small" />Xác nhận</Button>
          </MuiThemeProvider>
          <MuiThemeProvider theme={errorButton}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.formButton}
              onClick={e => this.handleCloseFloatingForm(e)}>
              <Cancel fontSize="small" />Hủy bỏ</Button>
          </MuiThemeProvider>
        </Grid>

      </Collapse>
    )
  }
};

export default withStyles(useStyles)(FloatingForm);