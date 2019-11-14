import React from 'react';
import { withStyles } from '@material-ui/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import axios from 'axios';
import {
  AddCircle
} from '@material-ui/icons/';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  CardActions,
  Grid,
  Button,
  TextField,
  Collapse
} from '@material-ui/core';
import clsx from 'clsx';

const useStyles = theme => ({
  root: {
    padding: theme.spacing(4),
    width: '100%',
  },
  content: {
    padding: 0
  },
  inner: {
    maxHeight: 450,
    overflow: 'auto',
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  actions: {
    justifyContent: 'flex-end'
  },
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
      newDiocese: '',
      newgender: '',
      newClass: '',
      newBirthday: '',
      newDayOfBaptism: '',
      newDayofEucharist: '',
      newDayofConfirmation: '',
    }
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
    return this.getData(null, this.state.tablePage, this.state.itemPerPage) && this.getNumberOfRecord();
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
    const { classes, className } = this.props;

    return (
      <Grid
        container
        className={classes.root}
      >
        <Grid item xs={12} style={{ marginBottom: '2em' }}>
          <div>
            <h1>{(this.props.location.pathname.split("/")[2] === 'all') ? "Danh sách chung" : `Danh sách lớp ${this.state.currentClass}`}</h1>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Card
            className={clsx(classes.root, className)}
          >
            <CardContent className={classes.content}>
              <PerfectScrollbar>
                <div className={classes.inner}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên Thánh và Họ</TableCell>
                        <TableCell>Tên</TableCell>
                        <TableCell>Họ tên Cha</TableCell>
                        <TableCell>Họ tên Mẹ</TableCell>
                        <TableCell>Giáo khu</TableCell>
                        <TableCell>Giới tính</TableCell>
                        <TableCell>Sinh nhật</TableCell>
                        <TableCell>Ngày Rửa Tội</TableCell>
                        <TableCell>Ngày Rước Lễ</TableCell>
                        <TableCell>Ngày Thêm Sức</TableCell>
                        <TableCell>Địa chỉ</TableCell>
                        <TableCell>Liên lạc</TableCell>
                        <TableCell>Lớp</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.records.map(record => (
                        <TableRow
                          className={classes.tableRow}
                          hover
                          key={record.ID}
                          selected={this.state.selectedRecord.indexOf(record.ID) !== -1}
                        >
                          <TableCell>{record.firstname}</TableCell>
                          <TableCell>{record.lastname}</TableCell>
                          <TableCell>{record.father_name}</TableCell>
                          <TableCell>{record.mother_name}</TableCell>
                          <TableCell>{record.diocese}</TableCell>
                          <TableCell>{(record.male === "x") ? "Nam" : "Nữ"}</TableCell>
                          <TableCell>{record.birthday}</TableCell>
                          <TableCell>{record.day_of_baptism}</TableCell>
                          <TableCell>{record.day_of_eucharist}</TableCell>
                          <TableCell>{record.day_of_confirmation}</TableCell>
                          <TableCell>{record.address}</TableCell>
                          <TableCell>{record.contact}</TableCell>
                          <TableCell>{record.class}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </PerfectScrollbar>
            </CardContent>
            <CardActions className={classes.actions}>
              <TablePagination
                component="div"
                count={this.state.numberOfRecord}
                onChangePage={(e, page) => this.handleChangePage(e, page)}
                onChangeRowsPerPage={e => this.handleChangeRowsPerPage(e)}
                page={this.state.tablePage}
                rowsPerPage={this.state.itemPerPage}
                rowsPerPageOptions={[10, 25, 50]}
                labelRowsPerPage="Số lượng dòng trên trang" />
              <Button variant="contained" color="primary" onClick={e => this.toggleExpansionForm(e)}><AddCircle fontSize="small" /> Thêm mới</Button>
            </CardActions>

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
              </Grid>
            </Collapse>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(useStyles)(Dashboard);
