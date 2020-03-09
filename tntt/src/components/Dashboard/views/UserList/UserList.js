import React from 'react';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import axios from 'axios';
import moment from 'moment';
import {
  Paper, Collapse, Toolbar,
  Typography, Chip, TextField,
  Grid, MenuItem, Tooltip, IconButton,
  Menu, ListItemIcon, ListItemText, colors,
  Card, CardHeader, CardContent, CardActions, Avatar,
} from '@material-ui/core';

import firebaseKey from '../../common/firebase.json';

import {
  Cached,
  Delete,
  PersonAdd,
  MoreVert,
  Edit,
  ReportProblemRounded,
  Person,
  Clear
} from '@material-ui/icons';
import MaterialTable from 'material-table';
import tableIcons from '../Dashboard/components/tableIcon';
import SnackDialog from '../../../SnackerBar';
import UserForm from './UserForm';
import CustomHeader from '../../../Dashboard/components/CustomHeader/CustomHeader';

const useStyles = (theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.white
    }
  },
  master: {
    padding: theme.spacing(3),
    width: '100%'
  },
  masterforDevice: {
    padding: 0,
    paddingBottom: theme.spacing(3),
    width: '100%'
  },
  root: {
    padding: theme.spacing(4),
    width: '100%'
  },
  content: {
    marginTop: theme.spacing(3),
    overflow: 'auto',
  },
  chipsContainer: {
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
    '& label.Mui-focused': { color: 'white' },
    '& .MuiInput-input': {
      color: '#FFFFFF',
    },
    '& .MuiSelect-icon': {
      color: 'white'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: 'white',
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

const customColor = createMuiTheme({
  palette: {
    primary: {
      main: colors.teal[500],
      light: colors.teal[300],
      dark: colors.teal[700]
    }
  }
})

class UserList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      windowHeight: 0,
      windowWidth: 0,
      currentUserPosition: '',
      //for SnackDialog
      snackerBarStatus: false,
      snackbarMessage: "",
      snackbarType: "success",
      //for Users TableData
      isLoadingData: true,
      avatars: [],
      tableColumns: [
        {
          title: '',
          field: 'avatarUrl',
          render: rowData => <Avatar alt={rowData.username} src={rowData.avatarUrl} />,
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
      isOpenActionMenu: null,
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount = () => {
    this._isMounted = true;

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
    return this.getUsers('') &&
      axios.get(`/backend/user/get-user/${localStorage.getItem('username')}`)
        .then(res => {
          if (this._isMounted) {
            this.setState({
              currentUserPosition: res.data.data.type
            })
          }
        })
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
    this._isMounted = false;
  }

  updateWindowDimensions = () => {
    if (this._isMounted) {
      this.setState({
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
      })
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

  getUsers = (type) => {
    let users = [];
    let requests = [];
    return axios
      .get('/backend/user/all')
      .then(result => {
        users = result.data.data;
        const currentUser = localStorage.getItem('username');
        users.forEach(user => {
          user.birthday = (user.birthday === '') ? '' : moment(user.birthday).format('DD/MM/YYYY');
          user.holy_birthday = (user.holy_birthday === '') ? '' : moment(user.holy_birthday).format('DD/MM/YYYY');
        })
        users = users.filter(user => user.username !== currentUser);
        if (type !== '') users = users.filter(user => user.birthday.split('/')[1] === type || user.holy_birthday.split('/')[1] === type);
        requests = users.map((user, i, users) => {
          return axios.get(`/backend/user/avatar/by-name/${user.username}`, {
            responseType: 'blob'
          })
        })
        return axios.all(requests)
      })
      .then(results => {
        users.forEach((user, i) => {
          let data = new Blob([results[i].data], { type: `${results[i].headers['content-type']}` })
          user.avatarUrl = window.URL.createObjectURL(data) || window.webkitURL.createObjectURL(data);
        })
        if (this._isMounted) {
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

  reloadData = () => {
    this.setState({
      isLoadingData: true
    })
    return this.getUsers('');
  }

  multipleDelete = () => {
    let usernames = [];
    this.state.selectedRows.forEach(row => {
      usernames.push(row.username);
    });

    const firebaseNotification = this.buildFireBaseNotification(
      'Huynh Trưởng/GLV',
      (usernames.length < 2) ?
        `${localStorage.getItem('username')} vừa xóa tài khoản ${usernames[0]} ra khỏi danh sách` :
        `${localStorage.getItem('username')} vừa xóa ${usernames.length} tài khoản ra khỏi danh sách`,
      moment().format('DD/MM/YYYY hh:mm:ss'),
      'Delete'
    )

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
            selectedRows: [],
            snackbarType: 'success',
            snackerBarStatus: true,
            snackbarMessage: 'Xóa thành công'
          })
          return axios.post(firebaseKey.endpoint, firebaseNotification, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `key=${firebaseKey.serverKey}`
            }
          }).then(res => { })
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
    this.setState({
      isOpeningUserFrom: true,
      typeOfForm: 'edit',
      selectedRecord: rowData,
      selectedRows: []
    })
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
      this.getUsers(e.target.value)
    }
    else {
      return this.getUsers('');
    }
  }

  render = () => {
    const { classes } = this.props;

    return (
      <div className={(this.state.windowWidth < 500) ? classes.masterforDevice : classes.master}>
        <CustomHeader style={{
          background: this.state.themeColor,
          marginBottom: '-3em'
        }} title={
          <div>
            <Typography variant='h6'>Danh sách thành viên</Typography>
            <Typography variant="subtitle2">Bảng chi tiết các anh/chị/quý tu sĩ đang hoạt động trong Xứ Đoàn</Typography>
          </div>
        }
          subtitle={
            <Toolbar disableGutters variant="dense">
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                  <Typography variant="subtitle2" style={{ fontStyle: 'italic' }}>Sinh nhật và bổn mạng:</Typography>
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
              <div style={{ flex: 1 }} />
              <Tooltip title='Mở rộng'>
                <IconButton onClick={(e) => this.setState({ isOpenActionMenu: e.target })}>
                  <MoreVert style={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
            </Toolbar>
          } />
        <Paper className={classes.root} elevation={5}>
          <div className={classes.content} style={{ height: (this.state.windowHeight - 332) }}>
            <MuiThemeProvider theme={customColor}>
              <MaterialTable
                icons={tableIcons}
                data={this.state.usersData.map(row => this.state.selectedRows.find(selected => selected._id === row._id) ? { ...row, tableData: { checked: true } } : { ...row, tableData: { checked: false } })}
                columns={this.state.tableColumns}
                isLoading={this.state.isLoadingData}
                onSelectionChange={(rows, rowData) => {
                  if (this.state.selectedRows.find(row => row._id === rowData._id)) {
                    let arr = this.state.selectedRows.filter(row => row._id !== rowData._id)
                    this.setState({ selectedRows: arr })
                  }
                  else {
                    this.setState({ selectedRows: [...this.state.selectedRows, rowData] })
                  }
                }}
                options={{
                  paging: false,
                  sorting: false,
                  selection: this.state.currentUserPosition === 'Admin' ? true : false,
                  showSelectAllCheckbox: false,
                  showTextRowsSelected: false,
                  headerStyle: {
                    position: 'sticky',
                    top: 0,
                    color: '#009688',
                    fontSize: 15
                  },
                  search: true,
                  showTitle: false,
                  maxBodyHeight: this.state.windowHeight - 397,
                  minBodyHeight: this.state.windowHeight - 397,
                  debounceInterval: 500,
                  rowStyle: rowData => {
                    if (this.state.selectedRows.indexOf(rowData) !== -1 || rowData.tableData.checked === true) {
                      return {
                        backgroundColor: `${colors.teal[100]}`
                      }
                    }
                    else if (rowData._id === this.state.selectedRecord._id) {
                      return { backgroundColor: `${colors.teal[700]}`, color: 'white' }
                    }
                    return {};
                  },
                  selectionProps: rowData => ({
                    color: 'primary'
                  }),
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
                components={{
                  Container: props => <Paper {...props} elevation={0} />
                }}
                actions={[
                  {
                    icon: () => { return <Edit style={{ color: '#009688' }} /> },
                    tooltip: 'Chỉnh sửa',
                    position: 'row',
                    onClick: (e, rowData) => this.handleRowSelection(e, rowData),
                    hidden: (this.state.currentUserPosition === 'Guest') ? true : false
                  },
                ]}
              />
            </MuiThemeProvider>
            <Menu
              anchorEl={this.state.isOpenActionMenu}
              open={Boolean(this.state.isOpenActionMenu)}
              onClose={() => { this.setState({ isOpenActionMenu: null }) }}
              keepMounted
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem
                onClick={() => {
                  this.setState({
                    isOpeningUserFrom: true,
                    typeOfForm: 'add',
                    isOpenActionMenu: null,
                  })
                }}
                disabled={(this.state.currentUserPosition === 'Admin') ? false : true}
              >
                <ListItemIcon><PersonAdd /></ListItemIcon>
                <ListItemText primary='Tạo tài khoản mới' />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  this.reloadData()
                  this.setState({ isOpenActionMenu: null })
                }}>
                <ListItemIcon><Cached /></ListItemIcon>
                <ListItemText primary='Cập nhật danh sách' />
              </MenuItem>
            </Menu>
          </div>
          <UserForm
            open={this.state.isOpeningUserFrom}
            type={this.state.typeOfForm}
            callback={this.handleUserForm}
            status={this.handleStatusUserForm}
            selectedData={this.state.selectedRecord}
            resetSelectedRow={this.handleResetSelectedRow} />
          <Collapse in={(this.state.selectedRows.length > 0) ? true : false}>
            <div style={{ border: `2px solid ${colors.teal[300]}` }}>
              <Grid container spacing={1} style={{ margin: 0, width: '100%' }}>
                <Grid item xs={4} sm={2} md={2} lg={2}>
                  <div align='center'>
                    <ReportProblemRounded style={{ width: '3em', height: '3em', color: 'red' }} />
                    <Typography variant="subtitle1">Xóa các dữ liệu được chọn</Typography>
                  </div>
                </Grid>
                <Grid item xs={8} sm={10} md={10} lg={10}>
                  <Card>
                    <CardHeader title={'Đã chọn: ' + this.state.selectedRows.length} />
                    <CardContent className={classes.chipsContainer}>
                      <Grid container spacing={1} style={{ margin: 0, width: '100%' }}>
                        {this.state.selectedRows.map(row => (
                          <Grid item xs={12} sm={6} md={4} lg={3} key={row.fullname}>
                            <MuiThemeProvider theme={colorChips}>
                              <Chip
                                icon={<Person />}
                                label={row.fullname}
                                size="small"
                                color='primary'
                                onDelete={() => {
                                  let arr = this.state.selectedRows.filter(selectedRow => selectedRow._id !== row._id)
                                  this.setState({ selectedRows: arr })
                                }}
                                style={{ display: 'flex' }} />
                            </MuiThemeProvider>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Tooltip title='Xóa tất cả '>
                        <IconButton
                          onClick={this.multipleDelete}
                          style={{ marginLeft: 'auto', color: 'red' }}
                        ><Delete /></IconButton>
                      </Tooltip>
                      <Tooltip title='Hủy'>
                        <IconButton
                          onClick={this.handleCancelAll}
                          style={{ color: `${colors.teal[300]}` }}
                        ><Clear /></IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </div>
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
