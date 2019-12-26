import React from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import uuid from 'uuid';
import moment from 'moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
  withStyles,
} from '@material-ui/core/styles';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Collapse,
  InputAdornment,
} from '@material-ui/core';
import {
  Add,
  Check,
  Send,
  Delete,
  Cancel,
  ClosedCaption,
  Grade,
  ViewList,
} from '@material-ui/icons/';

import tableIcons from '../tableIcon';

const useStyles = (theme) => ({
  root: {
    margin: theme.spacing(4),
  },
  gradeTypeMenu: {
    width: 200
  },
  secondaryButton: {
    marginTop: theme.spacing(2),
    marginRight: '1em',
    color: '#9c27b0',
    backgroundColor: '#FFFFFF',
  },
  inner: {
    overflow: 'auto',
    marginTop: theme.spacing(1),
    maxHeight: 500
  },
  menu: {
    width: 200
  }
})

class GradesInformation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      grades: [],
      absents: [],
      //for Grade TableData
      gradeType: ['Điểm thường', 'Điểm kiểm tra', 'Điểm thi'],
      gradeColumn: [
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
      //absentForm
      newAbsentType: '',
      newAbsentTitle: '',
      newAbsentDay: moment('1990-01-01').format(),
      newAbsentKey: ''
    };
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.type === 'edit' && JSON.stringify(prevProps.selectedData) !== JSON.stringify(this.props.selectedData) && this.props.selectedData.name !== undefined) {
      const name = this.props.selectedData.name
      const getGradesData = axios.get(`/backend/children/grade/by-name/${name}`);
      const getAbsentData = axios.get(`/backend/children/absent/by-name/${name}`)
      return axios
        .all([getGradesData, getAbsentData])
        .then((...results) => {
          const gradesArr = results[0][0].data.data;
          const absentsArr = results[0][1].data.data;
          if (gradesArr.length === 0) {
            this.setState({
              grades: [],
              isAddGradeClicked: false,
              isLoadingGradesData: false
            })
          } else {
            this.setState({
              grades: gradesArr,
              isAddGradeClicked: false,
              isLoadingGradesData: false
            })
          }

          if (absentsArr.length === 0) {
            this.setState({
              absents: [],
              isAddAbsentClicked: false,
              isLoadingAbsentsData: false
            })
          } else {
            absentsArr.forEach(absent => {
              absent.day = (absent.day === '')? absent.day : moment(absent.day).format('DD/MM/YYYY')
            })
            this.setState({
              absents: absentsArr,
              isAddAbsentClicked: false,
              isLoadingAbsentsData: false
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  reloadData = () => {
    const name = this.props.selectedData.name
    const getGradesData = axios.get(`/backend/children/grade/by-name/${name}`);
    const getAbsentData = axios.get(`/backend/children/absent/by-name/${name}`)
    return axios
      .all([getGradesData, getAbsentData])
      .then((...results) => {
        const gradesArr = results[0][0].data.data;
        const absentsArr = results[0][1].data.data;
        if (gradesArr.length === 0) {
          this.setState({
            grades: [],
            isAddGradeClicked: false,
            isLoadingGradesData: false
          })
        } else {
          this.setState({
            grades: gradesArr,
            isAddGradeClicked: false,
            isLoadingGradesData: false
          })
        }

        if (absentsArr.length === 0) {
          this.setState({
            absents: [],
            isAddAbsentClicked: false,
            isLoadingAbsentsData: false
          })
        } else {
          absentsArr.forEach(absent => {
            absent.day = (absent.day === '')? absent.day : moment(absent.day).format('DD/MM/YYYY')
          })
          this.setState({
            absents: absentsArr,
            isAddAbsentClicked: false,
            isLoadingAbsentsData: false
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  addNewItem = (type) => {
    if (type === 'grade') {
      const data = {
        'key': (this.state.newKey === '') ? uuid.v4() : this.state.newKey,
        'type': this.state.newGradeType,
        'title': this.state.newGradeTitle,
        'point': parseInt(this.state.newGrade),
      }
      return axios
        .post(`/backend/children/grade/new/by-name/${this.props.selectedData.name}`, data)
        .then(res => {
          this.reloadData()
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
          this.reloadData()
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
          this.reloadData()
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
          this.reloadData()
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
          this.reloadData()
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
          this.reloadData()
          this.props.updateStatus('successfully')
        })
        .catch(err => {
          console.log(err)
          this.props.updateStatus('failed')
        })
    }
  }

  handleChange = (e, type) => {
    const result = {};
    let data;
    if(type === 'newAbsentDay') {
      data = e
    }
    else {
      data = e.target.value;
    }
    if(type === 'newAbsentType' && e.target.value === "Không phép") {
      this.setState({
        newAbsentTitle: ''
      })
    }
    result[type] = data;
    this.setState(result);
  }

  handleCloseFloatingForm = () => {
    this.setState({
      newGradeTitle: '',
      newGradeType: '',
      newGrade: 0,
      newKey: '',
      gradeTextFieldStatus: 'add',
    })
    this.props.callback(false);
    this.props.resetSelectedRow('');
  }

  render = () => {
    const { classes, value, index } = this.props;

    return (
      <div
        key="basic"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpabel-${index}`}
        aria-labelledby={`simple-tab-${index}`}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <MaterialTable
              title="Bảng điểm chi tiết"
              icons={tableIcons}
              columns={this.state.gradeColumn}
              data={this.state.grades}
              isLoading={this.state.isLoadingGradesData}
              onRowClick={(e, rowData) => {
                this.setState({
                  newKey: rowData.key,
                  newGradeTitle: rowData.title,
                  newGradeType: rowData.type,
                  newGrade: rowData.point,
                  isAddGradeClicked: true,
                  gradeTextFieldStatus: 'edit'
                })
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
                maxBodyHeight: '300px',
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
            />
            <Collapse in={this.state.isAddGradeClicked}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    style={{ marginTop: '1em' }}
                    select
                    label="Loại điểm"
                    name="gradeType"
                    id="gradeType"
                    value={this.state.newGradeType}
                    onChange={e => this.handleChange(e, "newGradeType")}
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
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    required
                    style={{ marginTop: '1em' }}
                    label="Nội dung"
                    value={this.state.newGradeTitle}
                    onChange={e => this.handleChange(e, "newGradeTitle")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ClosedCaption />
                        </InputAdornment>
                      )
                    }} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    style={{ marginTop: '1em' }}
                    label="Điểm"
                    value={this.state.newGrade}
                    onChange={e => this.handleChange(e, "newGrade")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Grade />
                        </InputAdornment>
                      )
                    }} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  {(this.state.gradeTextFieldStatus === 'add') ?
                    <IconButton
                      style={{ marginTop: '1em' }}
                      onClick={() => this.addNewItem('grade')}
                      disabled={(this.state.newGradeTitle !== '' && this.state.newGradeType !== '') ? false : true}
                    ><Send fontSize="small" /></IconButton> :
                    <IconButton
                      style={{ marginTop: '1em' }}
                      onClick={() => this.updateItem('grade')}
                    ><Check fontSize="small" /></IconButton>}
                  <IconButton
                    style={{ marginTop: '1em' }}
                    onClick={() => {
                      this.setState({
                        isAddGradeClicked: false
                      })
                    }}
                  ><Cancel fontSize="small" /></IconButton>
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MaterialTable
              title="Bảng điểm danh chi tiết"
              icons={tableIcons}
              columns={this.state.absentColumn}
              isLoading={this.state.isLoadingAbsentsData}
              data={this.state.absents}
              onRowClick={(e, rowData) => {
                this.setState({
                  newAbsentDay: rowData.day.split("/")[2] + '-' + rowData.day.split("/")[1] + '-' + rowData.day.split("/")[0],
                  newAbsentKey: rowData.key,
                  newAbsentTitle: rowData.title,
                  newAbsentType: rowData.type,
                  isAddAbsentClicked: true,
                  absentTextFieldStatus: 'edit'
                })
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
                maxBodyHeight: '300px',
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
                  onClick: () => {
                    this.setState({
                      newAbsentDay: moment('1990-01-01').format(),
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
            />
            <Collapse in={this.state.isAddAbsentClicked}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    style={{ marginTop: '1em' }}
                    select
                    label="Loại phép"
                    name="absentType"
                    id="absentType"
                    value={this.state.newAbsentType}
                    onChange={e => this.handleChange(e, "newAbsentType")}
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
                <Grid item xs={12} sm={3}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      fullWidth
                      required
                      style={{ marginTop: '1em' }}
                      format="dd/MM/yyyy"
                      id="absentDay"
                      label="Ngày nghỉ"
                      value={this.state.newAbsentDay}
                      onChange={e => this.handleChange(e, "newAbsentDay")}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }} />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    disabled={(this.state.newAbsentType === "Không phép")? true : false}
                    style={{ marginTop: '1em' }}
                    label="Lí do"
                    value={this.state.newAbsentTitle}
                    onChange={e => this.handleChange(e, "newAbsentTitle")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ClosedCaption />
                        </InputAdornment>
                      )
                    }} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  {(this.state.absentTextFieldStatus === 'add') ?
                    <IconButton
                      style={{ marginTop: '1em' }}
                      onClick={() => this.addNewItem('absent')}
                      disabled={(this.state.newAbsentDay !== moment('1990-01-01').format() && this.state.newAbsentType !== '') ? false : true}
                    ><Send fontSize="small" /></IconButton> :
                    <IconButton
                      style={{ marginTop: '1em' }}
                      onClick={() => this.updateItem('absent')}
                    ><Check fontSize="small" /></IconButton>}
                  <IconButton
                    style={{ marginTop: '1em' }}
                    onClick={() => {
                      this.setState({
                        isAddAbsentClicked: false
                      })
                    }}
                  ><Cancel fontSize="small" /></IconButton>
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
        </Grid>
        <Grid container alignItems="flex-start" justify="flex-end" direction="row">
          <Button
            variant="contained"
            size='small'
            className={classes.secondaryButton}
            onClick={this.handleCloseFloatingForm}>
            Đóng</Button>
        </Grid>
      </div>
    )
  };
};

export default withStyles(useStyles)(GradesInformation);
