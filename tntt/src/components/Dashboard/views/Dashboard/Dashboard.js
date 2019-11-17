import React from 'react';
import { withStyles } from '@material-ui/styles';
import axios from 'axios';
import {
  AddCircle
} from '@material-ui/icons/';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Grid,
  Button,
  TextField,
  Collapse,
  MenuItem,
  Typography,
  Paper
} from '@material-ui/core';

const useStyles = theme => ({
  root: {
    padding: theme.spacing(4),
    width: '100%',
  },
  content: {
    padding: 0
  },
  inner: {
    maxHeight: 440,
    overflow: 'auto',
  },
  nameContainer: {
    padding: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  menu: {
    width: 200,
  }
});

class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      firstname: '',
      lastname: '',
      fatherName: '',
      motherName: '',
      diocese: '',
      male: '',
      dayOfBaptism: '',
      dayOfEucharist: '',
      dayOfConfirmation: '',
      address: '',
      contact: '',
      records: [],
      itemPerPage: 10,
      tablePage: 0,
      selectedRecord: [],
      numberOfRecord: 0,
      currentClass: '',
      isExpansionButton: false,

      newFirstname: '',
      newLastName: '',
      newFatherName: '',
      newMotherName: '',
      newDiocese: 'Giuse',
      newGender: 'Nam',
      newClass: '',
      newBirthday: '',
      newDayOfBaptism: '',
      newDayofEucharist: '',
      newDayofConfirmation: '',

      dioceses: ['Giuse', 'Nữ Vương Mân Côi', 'Anna', 'Phêrô'],
      genders: ['Nam', 'Nữ'],

      windowsWidth: 0,
      windowsHeight: 0,
    }

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.location.pathname.split("/")[2] !== prevProps.location.pathname.split("/")[2]) {
      this.setState({
        tablePage: 0
      });

      return this.getData(null, 0, this.state.itemPerPage) && this.getNumberOfRecord();
    }
  }

  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    return this.getData(null, this.state.tablePage, this.state.itemPerPage) && this.getNumberOfRecord();
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions() {
    this.setState({ 
      windowsWidth: window.innerWidth, 
      windowsHeight: window.innerHeight 
    });
  }

  getNumberOfRecord = () => {
    if (this.props.location.pathname !== '/dashboard/all') {
      return axios
        .get('/backend/class/by-path', {
          params: {
            path: this.props.location.pathname
          }
        })
        .then(result => {
          const classID = result.data.data[0].ID;
          this.setState({
            currentClass: result.data.data[0].Value
          })
          return axios
            .get('/backend/children/count', {
              params: {
                condition: classID
              }
            })
        })
        .then(result => {
          this.setState({
            numberOfRecord: result.data.data
          })
        })
        .catch(err => {
          console.log(err);
        })
    }
    else {
      return axios
        .get('/backend/children/count', {
          params: {
            condition: 'all'
          }
        })
        .then(result => {
          this.setState({
            numberOfRecord: result.data.data
          })
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  getData = (pathname, page, itemPerPage) => {
    return axios
      .get('/backend/class/by-path', {
        params: {
          path: this.props.location.pathname
        }
      })
      .then(result => {
        const className = result.data.data[0].ID;
        return axios.get(`/backend/children/all/${page}`, {
          params: {
            itemPerPage: itemPerPage,
            class: className
          }
        })
      })
      .then(result => {
        this.setState({
          records: result.data.data
        })
      })
      .catch(err => {
        console.log(err);
      })

  }

  handleChangeRowsPerPage = (e) => {
    this.setState({
      itemPerPage: e.target.value
    })
    return this.getData(null, this.state.tablePage, e.target.value);
  }

  handleChangePage = (e, page) => {
    this.setState({
      tablePage: page
    })
    return this.getData(null, page, this.state.itemPerPage);
  }

  handleFormChange = (e, type) => {
    let data = e.target.value;
    const result = {};
    result[type] = data;
    this.setState(result);
  }

  toggleExpansionForm = (e) => {
    this.setState({
      isExpansionButton: !this.state.isExpansionButton
    })
  }

  render = () => {
    const { classes } = this.props;
    const columns = [
      {
        id: 'firstname',
        label: "Tên Thánh và Họ",
        minWidth: 100,
        align: 'left'
      },
      {
        id: 'lastname',
        label: "Tên",
        minWidth: 100,
        align: 'left'
      },
      {
        id: 'father_name',
        label: "Họ tên Cha",
        minWidth: 100,
        align: 'left'
      },
      {
        id: 'mother_name',
        label: "Họ tên Mẹ",
        minWidth: 100,
        align: 'left'
      },
      {
        id: 'diocese',
        label: "Giáo khu",
        minWidth: 100,
        align: 'center'
      },
      {
        id: 'male',
        label: "Giới tính",
        minWidth: 100,
        align: 'center'
      },
      {
        id: 'birthday',
        label: "Sinh nhật",
        minWidth: 100,
        align: 'center'
      },
      {
        id: 'day_of_baptism',
        label: "Ngày Rửa Tội",
        minWidth: 100,
        align: 'center'
      },
      {
        id: 'day_of_eucharist',
        label: "Ngày Rước Lễ",
        minWidth: 100,
        align: 'center'
      },
      {
        id: 'day_of_confirmation',
        label: "Ngày Thêm Sức",
        minWidth: 100,
        align: 'center'
      },
      {
        id: 'address',
        label: "Địa chỉ",
        minWidth: 100,
        align: 'left'
      },
      {
        id: 'contact',
        label: "Liên lạc",
        minWidth: 100,
        align: 'left'
      },
      {
        id: 'class',
        label: "Lớp",
        minWidth: 100,
        align: 'center'
      },
    ]

    return (
      <div className={(this.state.windowsWidth < 500) ? {padding: 0} : classes.root}>
        <Paper className={classes.root}>
          <Typography variant="h4">
            {(this.props.location.pathname.split("/")[2] === 'all') ? "Danh sách chung" : `Danh sách lớp ${this.state.currentClass}`}
          </Typography>
          <div className={classes.inner}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map(col => (
                    <TableCell
                      key={col.id}
                      align={col.align}
                      style={{ minWidth: col.minWidth }}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.records.map(record => (
                  <TableRow
                    role="checkbox"
                    hover
                    key={record.ID}
                    tabIndex={this.state.selectedRecord.indexOf(record.ID) !== -1}
                  >
                    {columns.map(col => {
                      const value = record[col.id];
                      return (
                        <TableCell key={col.id} align={col.align}>
                          {col.id !== 'male' ? value : (col.id === 'male' && value === 'x') ? 'Nam' : 'Nữ'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component="div"
            count={this.state.numberOfRecord}
            onChangePage={(e, page) => this.handleChangePage(e, page)}
            onChangeRowsPerPage={e => this.handleChangeRowsPerPage(e)}
            page={this.state.tablePage}
            rowsPerPage={this.state.itemPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Dòng" />
          <Button variant="contained" color="primary" onClick={e => this.toggleExpansionForm(e)}><AddCircle fontSize="small" /> Thêm mới</Button>
          <Collapse in={this.state.isExpansionButton}>
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
            </Grid>
          </Collapse>
        </Paper>
      </div>
    );
  }
}

export default withStyles(useStyles)(Dashboard);
