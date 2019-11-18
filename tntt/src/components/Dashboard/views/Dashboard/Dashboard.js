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
  Button,
  Typography,
  Paper
} from '@material-ui/core';

import FloatingForm from './components/floatingForm';

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

  handleCallBackFloatingform = (callback) => {
    this.setState({
      isExpansionButton: callback
    })
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
      <div className={(this.state.windowsWidth < 500) ? { padding: 0 } : classes.root}>
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
                    tabIndex={-1}
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
          <FloatingForm open={this.state.isExpansionButton} callback={this.handleCallBackFloatingform}/>
        </Paper>
      </div>
    );
  }
}

export default withStyles(useStyles)(Dashboard);
