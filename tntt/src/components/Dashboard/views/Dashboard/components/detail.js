import React from 'react';
import {
  withStyles,
} from '@material-ui/core/styles';
import axios from 'axios';
import {
  Dialog, DialogActions, DialogTitle, DialogContent, TextField, MenuItem, Grid,
  InputAdornment, colors, Button, Typography, IconButton, Paper, Tooltip, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, ExpansionPanelActions, Divider,
} from '@material-ui/core'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
  LocationOn, Phone, Class, Person, Apartment, Wc, Clear, Add, Delete, ClosedCaption,
  Check, ViewList, Grade, Edit, ExpandMore, Comment, ArrowDropDown
} from '@material-ui/icons';
import moment from 'moment';
import MaterialTable from 'material-table';
import uuid from 'uuid';

import tableIcons from './tableIcon';
import firebaseKey from '../../../common/firebase.json'

const useStyle = theme => ({
  root: {

  },
  header: {
    backgroundColor: colors.purple[500],
    color: 'white'
  },
  customInput: {
    '& label.Mui-focused': { color: '#9c27b0' },
    '& .Mui-disabled': { color: '#000000' },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#9c27b0',
    },
  },
  customInputForHeader: {
    '& .Mui-disabled': { color: '#FFFFFF', fontSize: '24px', },
    '$ input.MuiInput:before': { color: '#FFFFFF' },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#FFFFFF',
    },
  },
  customMarginforGrid: {
    margin: 0,
    width: '100%'
  },
  expansionPanel: {
    border: `1px solid ${colors.purple[500]}`
  },
  expansionTitle: {
    fontWeight: 'bold',
    color: `${colors.purple[500]}`
  },
})

class Detail extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      //general
      innerHeight: 0,
      innerWidth: 0,
      //
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
      newNote: '',

      dioceses: ['Giuse', 'Nữ Vương Mân Côi', 'Anna', 'Phêrô'],
      genders: ['Nam', 'Nữ'],
      classes: [],

      grades: [],
      absents: [],
      //for Grade TableData
      gradeType: ['Điểm thường', 'Điểm kiểm tra', 'Điểm thi'],
      semesters: ['HKI', 'HKII'],
      gradeColumn: [
        {
          title: 'Học kỳ',
          field: 'semester'
        },
        {
          title: "Loại điểm",
          field: 'type'
        },
        {
          title: 'Nội dung',
          field: 'title'
        },
        {
          title: 'Điểm',
          field: 'point'
        }
      ],
      isAddGradeClicked: false,
      isAddAbsentClicked: false,
      isLoadingGradesData: true,
      isLoadingAbsentsData: true,
      gradeTextFieldStatus: 'add',
      absentTextFieldStatus: 'add',
      //for Absent TableData
      absentType: ['Phép', 'Không phép'],
      absentColumn: [
        {
          title: 'Ngày',
          field: 'day'
        },
        {
          title: 'Lí do',
          field: 'title'
        },
        {
          title: 'Loại phép',
          field: 'type'
        }
      ],
      //gradeForm
      newGradeType: '',
      newGradeTitle: '',
      newGrade: 0,
      newKey: '',
      selectedSemester: 'HKI',
      //absentForm
      newAbsentType: '',
      newAbsentTitle: '',
      newAbsentDay: moment().format(),
      newAbsentKey: '',
      isEdit: true,
    };
    this._isMounted = false
  }

  componentDidMount = () => {
    this._isMounted = true
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    this.getClass();
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.type === 'edit' && JSON.stringify(prevProps.selectedData) !== JSON.stringify(this.props.selectedData) && this.props.selectedData.name !== undefined) {
      this.setState({ isEdit: false })
      this.getChildrenData();
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false
    window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions() {
    if (this._isMounted) {
      this.setState({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });
    }
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

  handleClose = () => {
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
      newNote: '',

      newGradeTitle: '',
      newGradeType: '',
      newGrade: 0,
      newKey: '',
      gradeTextFieldStatus: 'add',
    })
    this.props.callback(false);
    this.props.resetSelectedRow('');
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

  getClass = () => {
    return axios
      .get('/backend/class/all')
      .then(result => {
        let classes = result.data.data;
        classes = classes.filter(el => el.Value !== "Chung");
        if (this._isMounted) {
          this.setState({
            classes: classes
          })
        }
      })
  }

  getChildrenData = () => {
    return axios.get(`/backend/children/by-name/${this.props.selectedData.name}`)
      .then(result => {
        const childProfile = result.data.data[0]
        if (this._isMounted) {
          this.setState({
            newName: childProfile.name,
            newFatherName: childProfile.father_name,
            newMotherName: childProfile.mother_name,
            newBirthday: (childProfile.birthday === '') ? this.state.newBirthday : moment(childProfile.birthday).format(),
            newDayOfBaptism: (childProfile.day_of_baptism === '') ? this.state.newDayOfBaptism : moment(childProfile.dayOfBaptism).format(),
            newDayofEucharist: (childProfile.day_of_eucharist === '') ? this.state.newDayofEucharist : moment(childProfile.dayOfEucharist).format(),
            newDayofConfirmation: (childProfile.day_of_confirmation === '') ? this.state.newDayofConfirmation : moment(childProfile.dayOfConfirmation).format(),
            newAddress: (childProfile.address === '') ? '' : childProfile.address,
            newGender: (childProfile.male === 'x') ? "Nam" : "Nữ",
            newContact: (childProfile.contact === '') ? '' : childProfile.contact,
            newClass: childProfile.class,
            newDiocese: (childProfile.diocese === '') ? '' : childProfile.diocese,
            newNote: (childProfile.note === undefined || childProfile.note === '') ? '' : childProfile.note,
            grades: childProfile.grades.length !== 0 ? childProfile.grades : [],
            absents: childProfile.absents.length !== 0 ? childProfile.absents : [],
            isLoadingAbsentsData: false,
            isLoadingGradesData: false,
            isEdit: false,
          })
        }
      })
      .catch(err => {
        console.log(err)
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
      'contact': state.newContact,
      'note': state.newNote,
    }
    const firebaseNotification = this.buildFireBaseNotification(
      'Thiếu Nhi',
      `${localStorage.getItem('username')} vừa chỉnh sửa sơ thông tin cá nhân em ${state.newName}`,
      moment().format('DD/MM/YYYY hh:mm:ss'),
      'Edit'
    )

    return axios
      .post(`/backend/children/update/by-name/${state.newName}`, updatedData, {
        params: {
          username: localStorage.getItem('username')
        }
      })
      .then(result => {
        if (result.data.code === 'I001') {
          this.props.updateStatus('successfully')
        }
        this.getChildrenData();
        return axios.post(firebaseKey.endpoint, firebaseNotification, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `key=${firebaseKey.serverKey}`
          }
        }).then(res => { })
      })
      .catch(err => {
        console.log(err);
        this.props.updateStatus('failed')
      })
  }

  addNewItem = (type) => {
    if (type === 'grade') {
      const data = {
        'key': (this.state.newKey === '') ? uuid.v4() : this.state.newKey,
        'type': this.state.newGradeType,
        'title': this.state.newGradeTitle,
        'point': parseFloat(this.state.newGrade),
        'semester': this.state.selectedSemester
      }
      return axios
        .post(`/backend/children/grade/new/by-name/${this.props.selectedData.name}`, data)
        .then(res => {
          this.getChildrenData()
          this.setState({isAddGradeClicked: false})
          this.props.updateStatus('successfully')
        })
        .catch(err => {
          console.log(err)
          this.props.updateStatus('failed')
        })
    }
    else {
      const data = {
        'key': (this.state.newAbsentKey === '') ? uuid.v4() : this.state.newAbsentKey,
        'type': this.state.newAbsentType,
        'day': moment(this.state.newAbsentDay).format('YYYY-MM-DD'),
        'title': this.state.newAbsentTitle,
      }
      return axios
        .post(`/backend/children/absent/new/by-name/${this.props.selectedData.name}`, data)
        .then(res => {
          this.getChildrenData()
          this.setState({isAddAbsentClicked: false})
          this.props.updateStatus('successfully')
        })
        .catch(err => {
          console.log(err)
          this.props.updateStatus('failed')
        })
    }
  }

  updateItem = (type) => {
    if (type === 'grade') {
      const updatedData = {
        'key': this.state.newKey,
        'title': this.state.newGradeTitle,
        'point': this.state.newGrade,
        'type': this.state.newGradeType
      }
      return axios
        .post(`/backend/children/grade/update/by-name/${this.props.selectedData.name}`, updatedData)
        .then(res => {
          this.getChildrenData()
          this.setState({isAddGradeClicked: false})
          this.props.updateStatus('successfully')
        })
        .catch(err => {
          console.log(err)
          this.props.updateStatus('failed')
        })
    }
    else {
      const updatedData = {
        'key': this.state.newAbsentKey,
        'type': this.state.newAbsentType,
        'day': moment(this.state.newAbsentDay).format('YYYY-MM-DD'),
        'title': this.state.newAbsentTitle,
      }
      return axios
        .post(`/backend/children/absent/update/by-name/${this.props.selectedData.name}`, updatedData)
        .then(res => {
          this.getChildrenData()
          this.setState({isAddAbsentClicked: false})
          this.props.updateStatus('successfully')
        })
        .catch(err => {
          console.log(err)
          this.props.updateStatus('failed')
        })
    }
  }

  deleteItem = (e, rowData, type) => {
    if (type === 'grade') {
      const deleteData = {
        'key': rowData.key,
        'title': rowData.title,
        'point': rowData.point,
        'type': rowData.type
      }
      return axios
        .post(`/backend/children/grade/delete/by-name/${this.props.selectedData.name}`, deleteData)
        .then(res => {
          this.getChildrenData()
          this.props.updateStatus('successfully')
        })
        .catch(err => {
          console.log(err)
          this.props.updateStatus('failed')
        })
    }
    else {
      const deleteData = {
        'key': rowData.key,
        'title': rowData.title,
        'day': rowData.day.split("/")[2] + '-' + rowData.day.split("/")[1] + '-' + rowData.day.split("/")[0],
        'type': rowData.type
      }
      return axios
        .post(`/backend/children/absent/delete/by-name/${this.props.selectedData.name}`, deleteData)
        .then(res => {
          this.getChildrenData()
          this.props.updateStatus('successfully')
        })
        .catch(err => {
          console.log(err)
          this.props.updateStatus('failed')
        })
    }
  }

  render = () => {
    const { open, classes, userClass } = this.props

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        scroll='paper'
        maxWidth='md'
        fullScreen={this.state.innerWidth <= 840 ? true : false}
        transitionDuration={0}
        TransitionProps={{
          unmountOnExit: true
        }}>
        <DialogTitle className={classes.header}>
          {this.props.type === 'new' ? 'Tạo mới' :
            (
              <TextField
                disabled={this.state.isEdit ? false : true}
                margin='none'
                size='small'
                className={classes.customInputForHeader}
                value={this.state.newName}
                onChange={e => this.handleFormChange(e, "newName")}
                fullWidth
                InputProps={{
                  disableUnderline: this.state.isEdit ? false : true
                }}
              />
            )}
        </DialogTitle>
        <DialogContent dividers={true}>
          <Grid container spacing={2} className={classes.customMarginforGrid}>
            <Grid item xs={12} sm={5}>
              <ExpansionPanel defaultExpanded={this.state.innerWidth > 840 ? true : false} TransitionProps={{ unmountOnExit: true }} className={classes.expansionPanel}>
                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                  <Typography variant='subtitle1' className={classes.expansionTitle}>Thông tin cá nhân</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container spacing={2} className={classes.customMarginforGrid}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        disabled={this.state.isEdit ? false : true}
                        margin='none'
                        size='small'
                        label="Họ tên Cha"
                        name="fatherName"
                        id="fatherName"
                        placeholder='(trống)'
                        className={classes.customInput}
                        value={this.state.newFatherName}
                        onChange={e => this.handleFormChange(e, "newFatherName")}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Person style={{ color: 'black' }} />
                            </InputAdornment>
                          ),
                          disableUnderline: this.state.isEdit ? false : true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        disabled={this.state.isEdit ? false : true}
                        margin='none'
                        size='small'
                        label="Họ tên Mẹ"
                        name="motherName"
                        id="motherName"
                        placeholder='(trống)'
                        className={classes.customInput}
                        value={this.state.newMotherName}
                        onChange={e => this.handleFormChange(e, "newMotherName")}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Person style={{ color: 'black' }} />
                            </InputAdornment>
                          ),
                          disableUnderline: this.state.isEdit ? false : true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        select
                        disabled={this.state.isEdit ? false : true}
                        margin='none'
                        size='small'
                        label="Giáo khu"
                        name="diocese"
                        id="diocese"
                        className={classes.customInput}
                        value={this.state.newDiocese}
                        onChange={e => this.handleFormChange(e, "newDiocese")}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Apartment style={{ color: 'black' }} />
                            </InputAdornment>
                          ),
                          disableUnderline: this.state.isEdit ? false : true
                        }}
                        SelectProps={{
                          MenuProps: {
                            className: classes.menu
                          },
                          IconComponent: () => this.state.isEdit ? <ArrowDropDown /> : <ArrowDropDown style={{ display: 'none' }} />
                        }}
                      >
                        {this.state.dioceses.map(diocese => (
                          <MenuItem key={diocese} value={diocese}>
                            {diocese}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        select
                        disabled={this.state.isEdit ? false : true}
                        margin='none'
                        size='small'
                        label="Giới tính"
                        name="gender"
                        id="gender"
                        className={classes.customInput}
                        value={this.state.newGender}
                        onChange={e => this.handleFormChange(e, "newGender")}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Wc style={{ color: 'black' }} />
                            </InputAdornment>
                          ),
                          disableUnderline: this.state.isEdit ? false : true
                        }}
                        SelectProps={{
                          MenuProps: {
                            className: classes.menu
                          },
                          IconComponent: () => this.state.isEdit ? <ArrowDropDown /> : <ArrowDropDown style={{ display: 'none' }} />
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
                      <Grid item xs={12}>
                        <KeyboardDatePicker
                          fullWidth
                          disabled={this.state.isEdit ? false : true}
                          margin='none'
                          size='small'
                          format="dd/MM/yyyy"
                          id="birthday"
                          label="Ngày sinh"
                          className={classes.customInput}
                          value={this.state.newBirthday}
                          onChange={e => this.handleFormChange(e, "newBirthday")}
                          InputProps={{
                            disableUnderline: this.state.isEdit ? false : true
                          }}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                            'style': {
                              color: this.state.isEdit ? 'black' : 'white',
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <KeyboardDatePicker
                          fullWidth
                          disabled={this.state.isEdit ? false : true}
                          margin='none'
                          size='small'
                          format="dd/MM/yyyy"
                          id="dayOfBaptism"
                          label="Ngày Rửa tội"
                          className={classes.customInput}
                          value={this.state.newDayOfBaptism}
                          onChange={e => this.handleFormChange(e, "newDayOfBaptism")}
                          InputProps={{
                            disableUnderline: this.state.isEdit ? false : true
                          }}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                            'style': {
                              color: this.state.isEdit ? 'black' : 'white',
                            }
                          }} />
                      </Grid>
                      <Grid item xs={12}>
                        <KeyboardDatePicker
                          fullWidth
                          disabled={this.state.isEdit ? false : true}
                          margin='none'
                          size='small'
                          format="dd/MM/yyyy"
                          id="dayOfEucharist"
                          label="Ngày Rước lễ"
                          className={classes.customInput}
                          value={this.state.newDayofEucharist}
                          onChange={e => this.handleFormChange(e, "newDayofEucharist")}
                          InputProps={{
                            disableUnderline: this.state.isEdit ? false : true
                          }}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                            'style': {
                              color: this.state.isEdit ? 'black' : 'white',
                            }
                          }} />
                      </Grid>
                      <Grid item xs={12}>
                        <KeyboardDatePicker
                          fullWidth
                          disabled={this.state.isEdit ? false : true}
                          margin='none'
                          size='small'
                          format="dd/MM/yyyy"
                          id="dayOfConfirmation"
                          label="Ngày Thêm sức"
                          className={classes.customInput}
                          value={this.state.newDayofConfirmation}
                          onChange={e => this.handleFormChange(e, "newDayofConfirmation")}
                          InputProps={{
                            disableUnderline: this.state.isEdit ? false : true
                          }}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                            'style': {
                              color: this.state.isEdit ? 'black' : 'white',
                            }
                          }} />
                      </Grid>
                    </MuiPickersUtilsProvider>
                    <Grid item xs={12}>
                      <TextField
                        required
                        disabled={this.state.isEdit ? false : true}
                        margin='none'
                        size='small'
                        label="Địa chỉ"
                        name="address"
                        multiline
                        rows={3}
                        id="address"
                        placeholder='(trống)'
                        className={classes.customInput}
                        value={this.state.newAddress}
                        onChange={e => this.handleFormChange(e, "newAddress")}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <LocationOn style={{ color: 'black' }} />
                            </InputAdornment>
                          ),
                          disableUnderline: this.state.isEdit ? false : true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        disabled={this.state.isEdit ? false : true}
                        margin='none'
                        size='small'
                        label="Liên lạc"
                        multiline
                        rows={2}
                        name="contact"
                        id="contact"
                        placeholder='(trống)'
                        className={classes.customInput}
                        value={this.state.newContact}
                        onChange={e => this.handleFormChange(e, "newContact")}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Phone style={{ color: 'black' }} />
                            </InputAdornment>
                          ),
                          disableUnderline: this.state.isEdit ? false : true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        select
                        disabled={this.state.isEdit ? false : true}
                        margin='none'
                        size='small'
                        label="Lớp"
                        name="class"
                        id="class"
                        placeholder='(trống)'
                        className={classes.customInput}
                        value={this.state.newClass}
                        onChange={e => this.handleFormChange(e, "newClass")}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Class style={{ color: 'black' }} />
                            </InputAdornment>
                          ),
                          disableUnderline: this.state.isEdit ? false : true
                        }}
                        SelectProps={{
                          MenuProps: {
                            className: classes.menu
                          },
                          IconComponent: () => this.state.isEdit ? <ArrowDropDown /> : <ArrowDropDown style={{ display: 'none' }} />
                        }}
                      >
                        {this.state.classes.map(classEl => (
                          <MenuItem key={classEl.ID} value={classEl.ID}>
                            {classEl.Value}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        disabled={this.state.isEdit ? false : true}
                        margin='none'
                        size='small'
                        label="Ghi chú"
                        name="note"
                        multiline
                        rows={5}
                        id="note"
                        placeholder='(trống)'
                        className={classes.customInput}
                        value={this.state.newNote}
                        onChange={e => this.handleFormChange(e, "newNote")}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Comment style={{ color: 'black' }} />
                            </InputAdornment>
                          ),
                          disableUnderline: this.state.isEdit ? false : true
                        }}
                      />
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                  {this.props.type === 'new' ?
                    (
                      <Tooltip title='Xác nhận'>
                        <IconButton onClick={() => { }}>
                          <Check style={{ color: 'green' }} />
                        </IconButton>
                      </Tooltip>
                    ) :
                    (this.state.isEdit ?
                      (
                        <div>
                          <Tooltip title='Xác nhận'>
                            <IconButton onClick={this.updateData}>
                              <Check style={{ color: 'green' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Hủy bỏ'>
                            <IconButton onClick={() => {
                              this.setState({ isEdit: false })
                              this.getChildrenData()
                            }}><Clear style={{ color: 'red' }} /></IconButton>
                          </Tooltip>
                        </div>
                      ) :
                      (
                        <Tooltip title='Chỉnh sửa'>
                          <IconButton onClick={() => { this.setState({ isEdit: true }) }}
                            disabled={userClass === this.state.newClass? false : true}
                            component='div'>
                            <Edit style={{ color: `${colors.purple[500]}` }} />
                          </IconButton>
                        </Tooltip>
                      ))}
                </ExpansionPanelActions>
              </ExpansionPanel>
            </Grid>
            <Grid item xs={12} sm={7}>
              <ExpansionPanel defaultExpanded={this.state.innerWidth > 840 && this.props.type === 'edit' ? true : false} disabled={this.props.type === 'new'? true : false} TransitionProps={{ unmountOnExit: true }} className={classes.expansionPanel}>
                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                  <Typography variant='subtitle1' className={classes.expansionTitle}>Điểm và điểm danh</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container spacing={2} className={classes.customMarginforGrid}>
                    <Grid item xs={12}>
                      <MaterialTable
                        title={<Typography variant='subtitle1' style={{ fontWeight: 'bold' }}>Bảng điểm chi tiết</Typography>}
                        icons={tableIcons}
                        columns={this.state.gradeColumn}
                        data={this.state.grades}
                        isLoading={this.state.isLoadingGradesData}
                        onRowClick={(e, rowData) => {
                          if(userClass === this.state.newClass) {
                            return this.setState({
                              newKey: rowData.key,
                              newGradeTitle: rowData.title,
                              newGradeType: rowData.type,
                              newGrade: rowData.point,
                              isAddGradeClicked: true,
                              gradeTextFieldStatus: 'edit'
                            })
                          }
                          else return {}
                        }}
                        options={{
                          showFirstLastPageButtons: false,
                          paging: false,
                          search: false,
                          sorting: false,
                          headerStyle: {
                            position: 'sticky',
                            top: 0,
                            fontSize: 14,
                          },
                          maxBodyHeight: '384px',
                          minBodyHeight: '384px',
                          emptyRowsWhenPaging: false,
                        }}
                        localization={{
                          body: {
                            emptyDataSourceMessage: 'Không có dữ liệu!'
                          },
                          header: {
                            actions: ''
                          },
                        }}
                        actions={[
                          {
                            icon: () => { return <Add /> },
                            isFreeAction: true,
                            tooltip: 'Thêm mới',
                            hidden: userClass === this.state.newClass? false : true,
                            onClick: () => {
                              this.setState({
                                newGradeTitle: '',
                                newGrade: 0,
                                newKey: '',
                                newGradeType: '',
                                isAddGradeClicked: true,
                                gradeTextFieldStatus: 'add'
                              })
                            }
                          },
                          {
                            icon: () => { return <Delete /> },
                            onClick: (e, rowData) => this.deleteItem(e, rowData, 'grade')
                          }
                        ]}
                        components={{
                          Container: props => <Paper {...props} elevation={0} />
                        }}
                      />
                      <Dialog
                        open={this.state.isAddGradeClicked}
                        onClose={() => this.setState({ isAddGradeClicked: false })}
                        maxWidth='xs'
                      >
                        <DialogTitle style={{backgroundColor: `${colors.purple[300]}`, color: 'white'}}>Chỉnh sửa điểm</DialogTitle>
                        <DialogContent dividers>
                          <Grid container spacing={2} className={classes.customMarginforGrid}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                required
                                size='small'
                                margin='none'
                                className={classes.customInput}
                                style={{ marginTop: '1em' }}
                                select
                                label="Loại điểm"
                                name="gradeType"
                                id="gradeType"
                                value={this.state.selectedSemester}
                                onChange={e => this.handleFormChange(e, "selectedSemester")}
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <ViewList />
                                    </InputAdornment>
                                  )
                                }}
                                SelectProps={{
                                  MenuProps: {
                                    className: classes.menu
                                  }
                                }}
                              >
                                {this.state.semesters.map(el => (
                                  <MenuItem key={el} value={el}>
                                    {el}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                required
                                size='small'
                                margin='none'
                                className={classes.customInput}
                                style={{ marginTop: '1em' }}
                                select
                                label="Loại điểm"
                                name="gradeType"
                                id="gradeType"
                                value={this.state.newGradeType}
                                onChange={e => this.handleFormChange(e, "newGradeType")}
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <ViewList />
                                    </InputAdornment>
                                  )
                                }}
                                SelectProps={{
                                  MenuProps: {
                                    className: classes.menu
                                  }
                                }}
                              >
                                {this.state.gradeType.map(type => (
                                  <MenuItem key={type} value={type}>
                                    {type}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                size='small'
                                margin='none'
                                className={classes.customInput}
                                style={{ marginTop: '1em' }}
                                label="Điểm"
                                value={this.state.newGrade}
                                onChange={e => this.handleFormChange(e, "newGrade")}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Grade />
                                    </InputAdornment>
                                  )
                                }} />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                required
                                size='small'
                                margin='none'
                                className={classes.customInput}
                                style={{ marginTop: '1em' }}
                                label="Nội dung"
                                value={this.state.newGradeTitle}
                                onChange={e => this.handleFormChange(e, "newGradeTitle")}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <ClosedCaption />
                                    </InputAdornment>
                                  )
                                }} />
                            </Grid>
                          </Grid>
                        </DialogContent>
                        <DialogActions>
                          {(this.state.gradeTextFieldStatus === 'add') ?
                            <Button
                              onClick={() => this.addNewItem('grade')}
                              style={{ color: `${colors.purple[500]}` }}
                              disabled={(this.state.newGradeTitle !== '' && this.state.newGradeType !== '') ? false : true}
                            >Xác nhận</Button> :
                            <Button
                              onClick={() => this.updateItem('grade')}
                              style={{ color: `${colors.purple[500]}` }}
                            >Xác nhận</Button>}
                          <Button
                            style={{ color: `${colors.red[500]}` }}
                            onClick={() => {
                              this.setState({
                                isAddGradeClicked: false
                              })
                            }}
                          >Hủy bỏ</Button>
                        </DialogActions>
                      </Dialog>
                    </Grid>
                    <Grid item xs={12}>
                      <MaterialTable
                        title={<Typography variant='subtitle1' style={{ fontWeight: 'bold' }}>Bảng điểm danh chi tiết</Typography>}
                        icons={tableIcons}
                        columns={this.state.absentColumn}
                        isLoading={this.state.isLoadingAbsentsData}
                        data={this.state.absents}
                        onRowClick={(e, rowData) => {
                          if(userClass === this.state.newClass) {
                            return this.setState({
                              newAbsentDay: rowData.day.split("/")[2] + '-' + rowData.day.split("/")[1] + '-' + rowData.day.split("/")[0],
                              newAbsentKey: rowData.key,
                              newAbsentTitle: rowData.title,
                              newAbsentType: rowData.type,
                              isAddAbsentClicked: true,
                              absentTextFieldStatus: 'edit'
                            })
                          }
                          else return {}
                        }}
                        options={{
                          showFirstLastPageButtons: false,
                          paging: false,
                          search: false,
                          sorting: false,
                          headerStyle: {
                            position: 'sticky',
                            top: 0,
                            fontSize: 14,
                          },
                          maxBodyHeight: '384px',
                          minBodyHeight: '384px',
                          emptyRowsWhenPaging: false,
                        }}
                        localization={{
                          body: {
                            emptyDataSourceMessage: 'Không có dữ liệu!'
                          },
                          header: {
                            actions: ''
                          },
                        }}
                        actions={[
                          {
                            icon: () => { return <Add /> },
                            isFreeAction: true,
                            tooltip: 'Thêm mới',
                            hidden: userClass === this.state.newClass? false : true,
                            onClick: () => {
                              this.setState({
                                newAbsentDay: moment().format(),
                                newAbsentKey: '',
                                newAbsentTitle: '',
                                newAbsentType: '',
                                isAddAbsentClicked: true,
                                absentTextFieldStatus: 'add'
                              })
                            }
                          },
                          {
                            icon: () => { return <Delete /> },
                            onClick: (e, rowData) => this.deleteItem(e, rowData, 'absent')
                          }
                        ]}
                        components={{
                          Container: props => <Paper {...props} elevation={0} />
                        }}
                      />
                      <Dialog
                        open={this.state.isAddAbsentClicked}
                        onClose={() => this.setState({ isAddAbsentClicked: false })}
                        maxWidth='xs'>
                        <DialogTitle style={{backgroundColor: `${colors.purple[300]}`, color: 'white'}}>Chỉnh sửa nghỉ phép</DialogTitle>
                        <DialogContent dividers>
                          <Grid container spacing={2} className={classes.customMarginforGrid}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                required
                                size='small'
                                margin='none'
                                className={classes.customInput}
                                style={{ marginTop: '1em' }}
                                select
                                label="Loại phép"
                                name="absentType"
                                id="absentType"
                                value={this.state.newAbsentType}
                                onChange={e => this.handleFormChange(e, "newAbsentType")}
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <ViewList />
                                    </InputAdornment>
                                  )
                                }}
                                SelectProps={{
                                  MenuProps: {
                                    className: classes.menu
                                  }
                                }}
                              >
                                {this.state.absentType.map(type => (
                                  <MenuItem key={type} value={type}>
                                    {type}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                  fullWidth
                                  required
                                  size='small'
                                  margin='none'
                                  className={classes.customInput}
                                  style={{ marginTop: '1em' }}
                                  format="dd/MM/yyyy"
                                  id="absentDay"
                                  label="Ngày nghỉ"
                                  value={this.state.newAbsentDay}
                                  onChange={e => this.handleFormChange(e, "newAbsentDay")}
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                  }} />
                              </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                size='small'
                                margin='none'
                                className={classes.customInput}
                                disabled={(this.state.newAbsentType === "Không phép") ? true : false}
                                style={{ marginTop: '1em' }}
                                label="Lí do"
                                value={this.state.newAbsentTitle}
                                onChange={e => this.handleFormChange(e, "newAbsentTitle")}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <ClosedCaption />
                                    </InputAdornment>
                                  )
                                }} />
                            </Grid>
                          </Grid>
                        </DialogContent>
                        <DialogActions>
                          {(this.state.absentTextFieldStatus === 'add') ?
                            <Button
                              style={{ color: `${colors.purple[500]}` }}
                              onClick={() => this.addNewItem('absent')}
                              disabled={(this.state.newAbsentDay !== moment('1990-01-01').format() && this.state.newAbsentType !== '') ? false : true}
                            >Xác nhận</Button> :
                            <Button
                              style={{ color: `${colors.purple[500]}` }}
                              onClick={() => this.updateItem('absent')}
                            >Xác nhận</Button>}
                          <Button
                            style={{ color: `${colors.red[500]}` }}
                            onClick={() => {
                              this.setState({
                                isAddAbsentClicked: false
                              })
                            }}
                          >Hủy bỏ</Button>
                        </DialogActions>
                      </Dialog>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Tooltip title='Đóng'>
            <IconButton onClick={this.handleClose}><Clear style={{ color: `${colors.purple[500]}` }} /></IconButton>
          </Tooltip>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(useStyle)(Detail);