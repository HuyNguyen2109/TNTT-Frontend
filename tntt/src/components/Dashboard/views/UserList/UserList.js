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
  Delete,
  PersonAdd,
} from '@material-ui/icons';
import MaterialTable from 'material-table';
import tableIcons from '../Dashboard/components/tableIcon';
import SnackDialog from '../../../SnackerBar';
import UserForm from './UserForm';

const useStyles = (theme) => ({
  root: {
    padding: theme.spacing(4),
    width: '100%'
  },
  header: {
    marginBottom: theme.spacing(2)
  },
  content: {
    marginTop: theme.spacing(1),
    overflow: 'auto',
    maxHeight: 750
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
          title: 'Tài khoản',
          field: 'username',
          editable: 'onAdd'
        },
        {
          title: 'Tên thánh',
          field: 'holyname',
          editable: 'onAdd'
        },
        {
          title: 'Họ và tên',
          field: 'fullname',
          editable: 'onAdd',
          cellStyle: {minWidth: 200}
        },
        {
          title: 'Số điện thoại',
          field: 'phone_number',
          editable: 'onAdd'
        },
        {
          title: 'Email',
          field: 'email',
          editable: 'onAdd',
          cellStyle: {minWidth: 200},
          searchable: false
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
      ]
    };
  }

  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
    return this.getUsers();
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions = () => {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth
    })
  }

  getUsers = () => {
    return axios
      .get('/backend/user/all')
      .then(result => {
        let users = result.data.data;
        const currentUser = localStorage.getItem('username');
        users.forEach(user => {
          user.birthday = (user.birthday === '')? '': moment(user.birthday).format('DD/MM/YYYY');
          user.holy_birthday = (user.holy_birthday === '')? '' : moment(user.holy_birthday).format('DD/MM/YYYY');
        })
        users = users.filter(user => user.username !== currentUser);
        this.setState({
          usersData: users,
          isLoadingData: false
        })
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
    if(callback === 'successfully') {
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

  handleRowSelection = (e, rowData) => {
    if(localStorage.getItem('type') === 'Admin') {
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
    if(e.target.value !== '') {
      return axios
        .get('/backend/user/all')
        .then(result => {
          let users = result.data.data;
          const currentUser = localStorage.getItem('username');
          users.forEach(user => {
            user.birthday = (user.birthday === '')? '': moment(user.birthday).format('DD/MM/YYYY');
            user.holy_birthday = (user.holy_birthday === '')? '' : moment(user.holy_birthday).format('DD/MM/YYYY');
          })
          users = users.filter(user => user.username !== currentUser);
          console.log(users);
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
      <div className={(this.state.windowWidth < 500) ? { padding: 0, width: '100%' } : classes.root}>
        <Typography variant="h5" className={classes.header}>
          Danh sách Huynh trưởng/Dự trưởng/Trợ tá/Trợ úy
        </Typography>
        <Paper className={classes.root}>
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
                  backgroundColor: '#ffa000',
                  color: '#000000',
                  fontSize: 14
                },
                search: true,
                maxBodyHeight: '500px',
                debounceInterval: 500,
                rowStyle: rowData => {
                  if (this.state.selectedRows.indexOf(rowData) !== -1) {
                    return { 
                      backgroundColor: '#ffecb3'
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
                  disabled: (localStorage.getItem('type') === 'Admin')? false : true
                },
                {
                  icon: () => { return <Delete />},
                  tooltip: 'Chọn xóa',
                  onClick: (e, rowData) => this.handleRowClick(e, rowData),
                  hidden: (localStorage.getItem('type') === 'Admin')? false : true
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
            resetSelectedRow={this.handleResetSelectedRow}/>
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
        <SnackDialog
          variant={this.state.snackbarType}
          message={this.state.snackbarMessage}
          className={this.state.snackbarType}
          callback={this.callbackSnackerBarHanlder}
          open={this.state.snackerBarStatus}
          type={this.state.floatingFormType}
        />
      </div>
    )
  }
}

export default withStyles(useStyles)(UserList);
