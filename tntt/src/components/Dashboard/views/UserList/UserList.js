import React from 'react';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import axios from 'axios';
import moment from 'moment';
import {
  Paper, Collapse, Toolbar, Typography, Button, Chip, TextField, Grid, MenuItem
} from '@material-ui/core';

import {
  Cached,
  Cancel,
  Clear,
  Delete,
  PersonAdd,
  Add,
  CallMerge
} from '@material-ui/icons';
import MaterialTable from 'material-table';
import tableIcons from '../Dashboard/components/tableIcon';
import SnackDialog from '../../../SnackerBar';
import UserForm from './UserForm';
import CustomHeader from '../../../Dashboard/components/CustomHeader/CustomHeader';
import Dialog from '../General/components/Dialog';

const useStyles = (theme) => ({
  master: {
    padding: theme.spacing(3),
    width: '100%'
  },
  root: {
    padding: theme.spacing(4),
    width: '100%'
  },
  content: {
    marginTop: theme.spacing(1),
    overflow: 'auto',
    maxHeight: 500
  },
  chipsContainer: {
    backgroundColor: '#ff8a80',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  formButton: {
    marginTop: theme.spacing(1),
  },
  flexGrow: {
    flexGrow: 1
  },
  menu: {
    width: '100%'
  },
  customInput: {
    '& label.Mui-focused': { color: '#009688' },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#009688',
    },
  },
});

const colorChips = createMuiTheme({
  palette: {
    primary: {
      500: '#67edcc'
    },
    secondary: {
      A400: '#f7c6cb'
    }
  }
})

class UserList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      windowHeight: 0,
      windowWidth: 0,
      //for SnackDialog
      snackerBarStatus: false,
      snackbarMessage: "",
      snackbarType: "success",
      //for Users TableData
      isLoadingData: true,
      tableColumns: [
        {
          title: 'Tên thánh',
          field: 'holyname',
          editable: 'onAdd'
        },
        {
          title: 'Họ và tên',
          field: 'fullname',
          editable: 'onAdd',
          cellStyle: { minWidth: 200 }
        },
        {
          title: 'Số điện thoại',
          field: 'phone_number',
          editable: 'onAdd'
        },
        {
          title: 'Sinh nhật',
          field: 'birthday',
          editable: 'onAdd'
        },
        {
          title: 'Bổn mạng',
          field: 'holy_birthday',
          editable: 'onAdd'
        },
        {
          title: 'Lớp phụ trách',
          field: 'class'
        },
      ],
      usersData: [],
      selectedRows: [],
      selectedRecord: {},
      //for User form
      isOpeningUserFrom: false,
      typeOfForm: 'add',
      //for month filter
      selectedMonth: '',
      months: [
        {
          title: '(không chọn)',
          value: ''
        },
        {
          title: 'Tháng 1',
          value: '01'
        },
        {
          title: 'Tháng 2',
          value: '02'
        },
        {
          title: 'Tháng 3',
          value: '03'
        },
        {
          title: 'Tháng 4',
          value: '04'
        },
        {
          title: 'Tháng 5',
          value: '05'
        },
        {
          title: 'Tháng 6',
          value: '06'
        },
        {
          title: 'Tháng 7',
          value: '07'
        },
        {
          title: 'Tháng 8',
          value: '08'
        },
        {
          title: 'Tháng 9',
          value: '09'
        },
        {
          title: 'Tháng 10',
          value: '10'
        },
        {
          title: 'Tháng 11',
          value: '11'
        },
        {
          title: 'Tháng 12',
          value: '12'
        },
      ],
      //for theme color
      themeColor: 'linear-gradient(to right bottom, #4db6ac, #009688)',
      isOpenEventForm: false,
      isButtonDisabled: false,
      internalFunds: [],
      isLoadingFund: true,
    };
  }

  componentDidMount = () => {
    this._isMounted = true;
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
    return this.getUsers() && this.getInternalFunds();
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
    this._isMounted = false;
  }

  updateWindowDimensions = () => {
    if(this._isMounted) {
      this.setState({
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
      })
    }
  }

  priceFormat = (num) => {
    if(Math.abs(num) > 999 && Math.abs(num) < 999999) {
      return Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'ng';
    }
    else if (Math.abs(num) > 999999) {
      return Math.sign(num)*((Math.abs(num)/1000000).toFixed(1)) + 'tr';
    }
    else {
      return num
    };
  }

  getUsers = () => {
    return axios
      .get('/backend/user/all')
      .then(result => {
        let users = result.data.data;
        const currentUser = localStorage.getItem('username');
        users.forEach(user => {
          user.birthday = (user.birthday === '') ? '' : moment(user.birthday).format('DD/MM/YYYY');
          user.holy_birthday = (user.holy_birthday === '') ? '' : moment(user.holy_birthday).format('DD/MM/YYYY');
        })
        users = users.filter(user => user.username !== currentUser);
        if(this._isMounted) {
          this.setState({
            usersData: users,
            isLoadingData: false
          })
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          snackbarType: 'error',
          snackerBarStatus: true,
          snackbarMessage: 'Đã có lỗi trong quá trình nhận dữ liệu từ máy chủ'
        })
      })
  }

  getInternalFunds = () => {
    return axios
      .get('/backend/internal-fund/all')
      .then(result => {
        let allInternalFunds = result.data.data;
        allInternalFunds.forEach(fund => {
          fund.price = this.priceFormat(fund.price);
        })

        if(this._isMounted) {
          this.setState({ internalFunds: allInternalFunds, isLoadingFund: false })
        }
      })
  }

  reloadData = () => {
    this.setState({
      isLoadingData: true
    })
    return this.getUsers();
  }

  multipleDelete = () => {
    let usernames = [];
    this.state.selectedRows.forEach(row => {
      usernames.push(row.username);
    });

    return axios
      .delete('/backend/user/delete/by-usernames', {
        params: {
          usernames: usernames
        }
      })
      .then(res => {
        if (res.data.code === "I001") {
          this.reloadData();
          this.setState({
            selectedRows: []
          })
          this.setState({
            snackbarType: 'success',
            snackerBarStatus: true,
            snackbarMessage: 'Xóa thành công'
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({
          snackbarType: 'error',
          snackerBarStatus: true,
          snackbarMessage: 'Đã có lỗi trong quá trình xóa'
        })
      })
  }

  createNewFund = (fund) => {
    this.setState({ isButtonDisabled: true, isLoadingFund: true })

    return axios
      .post('/backend/internal-fund/new-fund', fund)
      .then(res => {
        if (res.data.code === 'I001') {
          this.setState({
            isButtonDisabled: false,
            isOpenEventForm: false,
          })
          this.getInternalFunds();
        }
      })
      .catch(err => {
        this.setState({
          snackerBarStatus: true,
          snackbarType: 'error',
          snackbarMessage: 'Đã có lỗi từ máy chủ',
          isButtonDisabled: false,
          isLoadingFund: false,
        })
      })
  }

  handleRowClick = (e, rowData) => {
    let joined;
    if (this.state.selectedRows.includes(rowData) === true) {
      joined = this.state.selectedRows.filter(o => o !== rowData);
    }
    else {
      joined = this.state.selectedRows.concat(rowData);
    }
    this.setState({
      selectedRows: joined,
    })
  }

  handleCancelAll = () => {
    this.setState({
      selectedRows: []
    })
  }

  callbackSnackerBarHanlder = (callback) => {
    this.setState({ snackerBarStatus: callback });
  }

  handleStatusUserForm = (callback) => {
    if (callback === 'successfully') {
      this.setState({
        snackerBarStatus: true,
        snackbarMessage: "Thay đổi thành công",
        snackbarType: "success",
      })
      this.reloadData();
    }
    else {
      this.setState({
        snackerBarStatus: true,
        snackbarMessage: "Đã có lỗi xảy ra trong quá trình thay đổi",
        snackbarType: "error",
      })
    }
    this.setState({
      updateStatus: callback
    })
  }

  handleUserForm = (callback) => {
    this.setState({
      isOpeningUserFrom: callback
    })
  }

  handleCloseForm = (callback) => {
    this.setState({ isOpenEventForm: callback })
  }

  handleRowSelection = (e, rowData) => {
    if (localStorage.getItem('type') === 'Admin') {
      this.setState({
        isOpeningUserFrom: true,
        typeOfForm: 'edit',
        selectedRecord: rowData
      })
    }
  }

  handleResetSelectedRow = (callback) => {
    this.setState({
      selectedRecord: callback
    })
  }

  handleMonthChange = (e, type) => {
    const result = {};
    result[type] = e.target.value;
    this.setState(result);
    this.setState({
      isLoadingData: true
    })
    if (e.target.value !== '') {
      return axios
        .get('/backend/user/all')
        .then(result => {
          let users = result.data.data;
          const currentUser = localStorage.getItem('username');
          users.forEach(user => {
            user.birthday = (user.birthday === '') ? '' : moment(user.birthday).format('DD/MM/YYYY');
            user.holy_birthday = (user.holy_birthday === '') ? '' : moment(user.holy_birthday).format('DD/MM/YYYY');
          })
          users = users.filter(user => user.username !== currentUser);
          users = users.filter(user => user.birthday.split('/')[1] === e.target.value || user.holy_birthday.split('/')[1] === e.target.value);
          this.setState({
            usersData: users,
            isLoadingData: false
          })
        })
    }
    else {
      return this.getUsers();
    }
  }

  render = () => {
    const { classes } = this.props;

    return (
      <div className={(this.state.windowWidth < 500) ? { padding: 0, width: '100%' } : classes.master}>
        <Grid container spacing={4}>
          <Grid item lg={8} md={6} sm={12}>
            <CustomHeader style={{
              background: this.state.themeColor,
            }} title="Danh sách thành viên"
              subtitle="Bảng chi tiết các anh/chị/quý tu sĩ đang hoạt động trong Xứ Đoàn" />
            <Paper className={classes.root} elevation={5}>
              <div className={classes.content}>
                <MaterialTable
                  title={
                    <Grid container spacing={1} alignItems="flex-end">
                      <Grid item>
                        <Typography variant="subtitle1">Sinh nhật và bổn mạng:</Typography>
                      </Grid>
                      <Grid item>
                        <TextField
                          select
                          className={classes.customInput}
                          value={this.state.selectedMonth}
                          onChange={e => this.handleMonthChange(e, "selectedMonth")}
                          fullWidth
                          SelectProps={{
                            MenuProps: {
                              className: classes.menu
                            }
                          }}
                        >
                          {this.state.months.map(month => (
                            <MenuItem key={month.title} value={month.value}>
                              {month.title}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  }
                  icons={tableIcons}
                  data={this.state.usersData}
                  columns={this.state.tableColumns}
                  isLoading={this.state.isLoadingData}
                  onRowClick={this.handleRowSelection}
                  options={{
                    paging: false,
                    sorting: false,
                    headerStyle: {
                      position: 'sticky',
                      top: 0,
                      color: '#009688',
                      fontSize: 15
                    },
                    search: true,
                    maxBodyHeight: '300px',
                    debounceInterval: 500,
                    rowStyle: rowData => {
                      if (this.state.selectedRows.indexOf(rowData) !== -1) {
                        return {
                          backgroundColor: '#4db6ac'
                        }
                      }
                      return {};
                    }
                  }}
                  localization={{
                    header: {
                      actions: ''
                    },
                    body: {
                      emptyDataSourceMessage: 'Không có dữ liệu!',
                      addTooltip: 'Tạo tài khoản mới',
                      editRow: {
                        saveTooltip: 'Lưu',
                        cancelTooltip: 'Hủy bỏ'
                      }
                    },
                    toolbar: {
                      searchPlaceholder: 'Tìm kiếm...',
                      searchTooltip: 'Nhập từ khóa để tìm kiếm'
                    },
                  }}
                  actions={[
                    {
                      icon: () => { return <Cached /> },
                      tooltip: "Cập nhật danh sách",
                      isFreeAction: true,
                      onClick: () => this.reloadData(),
                    },
                    {
                      icon: () => { return <PersonAdd /> },
                      isFreeAction: true,
                      onClick: () => {
                        this.setState({
                          isOpeningUserFrom: true,
                          typeOfForm: 'add',
                        })
                      },
                      tooltip: 'Tạo tài khoản mới',
                      disabled: (localStorage.getItem('type') === 'Admin') ? false : true
                    },
                    {
                      icon: () => { return <Clear style={{ color: 'red' }} /> },
                      tooltip: 'Chọn xóa',
                      onClick: (e, rowData) => this.handleRowClick(e, rowData),
                      hidden: (localStorage.getItem('type') === 'Admin') ? false : true
                    },
                  ]}
                />
              </div>
              <UserForm
                open={this.state.isOpeningUserFrom}
                type={this.state.typeOfForm}
                callback={this.handleUserForm}
                status={this.handleStatusUserForm}
                selectedData={this.state.selectedRecord}
                resetSelectedRow={this.handleResetSelectedRow} />
              <Collapse in={(this.state.selectedRows.length > 0) ? true : false}>
                <Toolbar className={classes.chipsContainer}>
                  <Typography variant="subtitle1">Đã chọn: {this.state.selectedRows.length}</Typography>
                  {this.state.selectedRows.map(row => (
                    <MuiThemeProvider theme={colorChips} key={row.username}>
                      <Chip label={row.fullname} size="small" color='primary' />
                    </MuiThemeProvider>
                  ))}
                  <div className={classes.flexGrow} />
                  <Button
                    className={classes.formButton}
                    onClick={this.multipleDelete}
                    tooltip="Xóa tất cả"
                  ><Delete /></Button>
                  <Button
                    className={classes.formButton}
                    onClick={this.handleCancelAll}
                    tooltip="Xóa tất cả"
                  ><Cancel /></Button>
                </Toolbar>
              </Collapse>
            </Paper>
          </Grid>
          <Grid item lg={4} md={6} sm={12}>
            <CustomHeader style={{
              background: this.state.themeColor,
            }} title="Quỹ Xứ đoàn"
              subtitle="Chi tiết thu chi quỹ nội bộ Xứ Đoàn" />
            <Paper className={classes.root} elevation={5} style={{height: '400px'}}>
              <div className={classes.content}>
                <MaterialTable
                  icons={tableIcons}
                  columns={[
                    {
                      title: 'Ngày',
                      field: 'date',
                      cellStyle: { minWidth: 20 }
                    },
                    {
                      title: 'Nội dung',
                      field: 'title',
                      cellStyle: { minWidth: 250 }
                    },
                    {
                      title: 'Số tiền',
                      field: 'price',
                      cellStyle: { minWidth: 50 }
                    }
                  ]}
                  data={this.state.internalFunds}
                  isLoading={this.state.isLoadingFund}
                  options={{
                    paging: false,
                    sorting: false,
                    headerStyle: {
                      position: 'sticky',
                      top: 0,
                      color: '#009688',
                      fontSize: 15
                    },
                    search: false,
                    maxBodyHeight: '250px',
                    showTitle: false
                  }}
                  localization={{
                    body: {
                      emptyDataSourceMessage: 'Không có dữ liệu!'
                    },
                  }}
                  actions={[
                    {
                      icon: () => { return <Add /> },
                      tooltip: 'Thêm sự kiện',
                      isFreeAction: true,
                      hidden: (localStorage.type !== 'Admin') ? true : false,
                      onClick: () => {
                        this.setState({
                          isOpenEventForm: true,
                        })
                      }
                    },
                    {
                      icon: () => { return <CallMerge /> },
                      tooltip: 'Tổng kết quỹ đến hiện tại',
                      isFreeAction: true,
                      hidden: (localStorage.type !== 'Admin') ? true : false,
                      onClick: () => {
                        return axios.post('/backend/internal-fund/merge-fund')
                          .then(res => {
                            if (res.data.code === 'I001') {
                              this.setState({ isLoadingFund: true })
                              this.getInternalFunds();
                            }
                          })
                          .catch(err => {
                            this.setState({
                              snackerBarStatus: true,
                              snackbarType: 'error',
                              snackbarMessage: 'Đã có lỗi từ máy chủ',
                              isButtonDisabled: false
                            })
                          })
                      }
                    }
                  ]}
                />
              </div>
            </Paper>
          </Grid>
        </Grid>
        <SnackDialog
          variant={this.state.snackbarType}
          message={this.state.snackbarMessage}
          className={this.state.snackbarType}
          callback={this.callbackSnackerBarHanlder}
          open={this.state.snackerBarStatus}
          type={this.state.floatingFormType}
        />
        <Dialog
          open={this.state.isOpenEventForm}
          dialogType='fund'
          callback={this.handleCloseForm}
          func={this.createNewFund}
          disabled={this.state.isButtonDisabled}
          style={{ color: '#009688' }} />
      </div>
    )
  }
}

export default withStyles(useStyles)(UserList);
