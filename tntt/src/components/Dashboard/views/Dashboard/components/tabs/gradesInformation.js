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
  Paper,
  TextField,
  MenuItem,
  Collapse,
} from '@material-ui/core';
import {
  Add,
  Check,
  Delete,
  Cancel,
  Update,
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
})

class GradesInformation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      grades: [],
      //for TableData
      gradeColumn: [
        {
          title: 'Lọai điểm',
          field: 'title'
        },
        {
          title: 'Điểm',
          field: 'point'
        }
      ],
      isAddGradeClicked: false,
      //form
      newGradeTitle: '',
      newGrade: 0,
      newKey: '',
    };
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.type === 'edit' && JSON.stringify(prevProps.selectedData) !== JSON.stringify(this.props.selectedData)) {
      const name = this.props.selectedData.name
      return axios
        .get(`/backend/children/grade/by-name/${name}`)
        .then(result => {
          const gradesArr = result.data.data;
          if(gradesArr[0].hasOwnProperty('title') === false) {
            this.setState({
              grades: [],
              isAddGradeClicked: false
          })
          } else {
            this.setState({
              grades: gradesArr,
              isAddGradeClicked: false
          })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  addNewItem = () => {
    const data = {
      'key': (this.state.newKey === '')? uuid.v4() : this.state.newKey,
      'title': this.state.newGradeTitle,
      'point': parseInt(this.state.newGrade),
    }
    console.log(data);
    return axios
      .post(`/backend/children/grade/new/by-name/${this.props.selectedData.name}`, data)
      .then(res => {
        console.log(res)
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
      newGrade: 0,
      newKey: ''
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
              onRowClick={(e, rowData) => {
                this.setState({
                  newKey: rowData.key,
                  newGradeTitle: rowData.title,
                  newGrade: rowData.point,
                  isAddGradeClicked: true
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
                  actions: 'Xóa'
                },
              }}
              actions={[
                {
                  icon: () => { return <Add /> },
                  isFreeAction: true,
                  onClick: () => { this.setState({
                      newGradeTitle: '',
                      newGrade: 0,
                      isAddGradeClicked: true
                    }) 
                  }
                },
                {
                  icon: () => { return <Delete /> },
                  onClick: (e, rowData) => {
                    console.log(rowData);
                  }
                }
              ]}
            />
            <Collapse in={this.state.isAddGradeClicked}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5}>
                  <TextField 
                    fullWidth
                    style={{marginTop: '1em'}}
                    label="Loại điểm"
                    value={this.state.newGradeTitle}
                    onChange={e => this.handleChange(e, "newGradeTitle")}/>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    style={{marginTop: '1em'}} 
                    label="Điểm"
                    value={this.state.newGrade}
                    onChange={e => this.handleChange(e, "newGrade")}/>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton 
                    style={{marginTop: '1em'}}
                    onClick={this.addNewItem}
                  ><Check fontSize="small" /></IconButton>
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