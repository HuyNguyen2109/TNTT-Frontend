import React from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import uuid from 'uuid';
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
  formButton: {
    marginTop: theme.spacing(2),
  },
  iconInButton: {
    margin: theme.spacing(1)
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
      //for TableData
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
      isLoadingData: true,
      textFieldStatus: 'add',
      //form
      newGradeType: '',
      newGradeTitle: '',
      newGrade: 0,
      newKey: '',
    };
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.type === 'edit' && JSON.stringify(prevProps.selectedData) !== JSON.stringify(this.props.selectedData) && this.props.selectedData.name !== undefined) {
      const name = this.props.selectedData.name
      return axios
        .get(`/backend/children/grade/by-name/${name}`)
        .then(result => {
          const gradesArr = result.data.data;
          if(gradesArr[0].hasOwnProperty('title') === false) {
            this.setState({
              grades: [],
              isAddGradeClicked: false,
              isLoadingData: false
          })
          } else {
            this.setState({
              grades: gradesArr,
              isAddGradeClicked: false,
              isLoadingData: false
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
    return axios
      .get(`/backend/children/grade/by-name/${name}`)
      .then(result => {
        const gradesArr = result.data.data;
        if(gradesArr[0].hasOwnProperty('title') === false) {
          this.setState({
            grades: [],
            isAddGradeClicked: false,
            isLoadingData: false
        })
        } else {
          this.setState({
            grades: gradesArr,
            isAddGradeClicked: false,
            isLoadingData: false
        })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  addNewItem = () => {
    const data = {
      'key': (this.state.newKey === '')? uuid.v4() : this.state.newKey,
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
      })
  }

  updateItem = () => {
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
      })
  }

  deleteItem = (e, rowData) => {
    console.log(rowData);
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
      })
  }

  handleChange = (e, type) => {
    const result = {};
    let data = e.target.value;
    result[type] = data;
    this.setState(result);
  }

  handleCloseFloatingForm = () => {
    this.setState({
      newGradeTitle: '',
      newGradeType: '',
      newGrade: 0,
      newKey: '',
      textFieldStatus: 'add',
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
              isLoading={this.state.isLoadingData}
              onRowClick={(e, rowData) => {
                this.setState({
                  newKey: rowData.key,
                  newGradeTitle: rowData.title,
                  newGradeType: rowData.type,
                  newGrade: rowData.point,
                  isAddGradeClicked: true,
                  textFieldStatus: 'edit'
              })}}
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
                  onClick: () => { this.setState({
                      newGradeTitle: '',
                      newGrade: 0,
                      newKey: '',
                      newGradeType: '',
                      isAddGradeClicked: true,
                      textFieldStatus: 'add'
                    }) 
                  }
                },
                {
                  icon: () => { return <Delete /> },
                  onClick: (e, rowData) => this.deleteItem(e, rowData)
                }
              ]}
            />
            <Collapse in={this.state.isAddGradeClicked}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    style={{marginTop: '1em'}}
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
                    style={{marginTop: '1em'}}
                    label="Nội dung"
                    value={this.state.newGradeTitle}
                    onChange={e => this.handleChange(e, "newGradeTitle")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ClosedCaption />
                        </InputAdornment>
                      )
                    }}/>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    style={{marginTop: '1em'}} 
                    label="Điểm"
                    value={this.state.newGrade}
                    onChange={e => this.handleChange(e, "newGrade")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Grade />
                        </InputAdornment>
                      )
                    }}/>
                </Grid>
                <Grid item xs={12} sm={3}>
                  {(this.state.textFieldStatus === 'add')? 
                  <IconButton 
                    style={{marginTop: '1em'}}
                    onClick={this.addNewItem}
                    disabled={(this.state.newGradeTitle !== '' && this.state.newGradeType !== '')? false : true}
                  ><Send fontSize="small" /></IconButton> : 
                  <IconButton 
                    style={{marginTop: '1em'}}
                    onClick={this.updateItem}
                  ><Check fontSize="small" /></IconButton>}
                  <IconButton 
                    style={{marginTop: '1em'}}
                    onClick={() => {
                      this.setState({
                        grade: this.state.initGrade,
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
              columns={this.state.gradeColumn}
              data={this.state.grades}
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
              }}
            />
          </Grid>
        </Grid>
        <Grid container alignItems="flex-start" justify="flex-end" direction="row">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            className={classes.formButton}
            onClick={this.handleCloseFloatingForm}>
            <Cancel className={classes.iconInButton} fontSize="small" />Đóng</Button>
        </Grid>
      </div>
    )
  };
};

export default withStyles(useStyles)(GradesInformation);