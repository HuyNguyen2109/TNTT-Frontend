import React from 'react';
import { withStyles } from '@material-ui/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import axios from 'axios';
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
  Grid
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
  tableCell: {
    position: "sticky",
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
    }
  }

  componentDidMount = () => {
    this.getData(null, this.state.tablePage, this.state.itemPerPage);
    this.getNumberOfRecord();
  }

  getNumberOfRecord = () => {
    return axios
      .get('/backend/children/count')
      .then(result => {
        this.setState({
          numberOfRecord: result.data.data
        })
      })
  }

  getData = (pathname, page, itemPerPage) => {
    return axios
      .get(`/backend/children/all/${page}`, {
        params: {
          itemPerPage: itemPerPage,
          class: 'all'
        }
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

  render = () => {
    const { classes, className } = this.props;

    return (
      <Grid
          container
          className={classes.root}
        >
          <Grid item xs={12}>
            <div>
              <h1>{(this.props.location.pathname.split("/")[2] === 'all')? "Danh sách chung" : "Danh sách lớp"}</h1>
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
                          <TableCell className={classes.tableCell}>Tên Thánh và Họ</TableCell>
                          <TableCell className={classes.tableCell}>Tên</TableCell>
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
                            <TableCell className={classes.tableCell}>{record.firstname}</TableCell>
                            <TableCell className={classes.tableCell}>{record.lastname}</TableCell>
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
                  rowsPerPageOptions={[10, 25, 50]} />
              </CardActions>
            </Card>
          </Grid>
        </Grid>
    );
  }
}

export default withStyles(useStyles)(Dashboard);
