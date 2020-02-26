import React from 'react';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import {
  PersonAdd,
  Cached,
  Clear,
  Delete,
  PlaylistAddCheck,
  GetApp,
  Lock,
  LockOpen,
  LooksOne,
  LooksTwo,
  MoreVert,
  Edit,
  ReportProblemRounded,
  Person
} from '@material-ui/icons/';
import {
  Paper,
  Typography,
  Toolbar,
  Chip,
  Collapse,
  Grid,
  TextField,
  MenuItem,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  IconButton,
  colors,
  Card, CardHeader, CardContent, CardActions, Fab, Zoom
} from '@material-ui/core';
import MaterialTable from 'material-table';

import FloatingForm from './components/floatingForm';
import tableIcons from './components/tableIcon';
import SnackDialog from '../../../SnackerBar';
import CustomHeader from '../../../Dashboard/components/CustomHeader/CustomHeader';

const useStyles = theme => ({
  root: {
    padding: theme.spacing(3),
    width: '100%',
  },
  rootSmallDevice: {
    padding: 0,
    paddingBottom: theme.spacing(3),
    width: '100%'
  },
  content: {
    padding: theme.spacing(4),
    width: '100%',
  },
  inner: {
    overflow: 'auto',
    marginTop: theme.spacing(3),
  },
  nameContainer: {
    padding: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  menu: {
    width: '100%'
  },
  exportDialog: {
    padding: theme.spacing(4),
    width: '100%',
  },
  flexGrow: {
    flexGrow: 1
  },
  chipsContainer: {
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  customInput: {
    '& label.Mui-focused': { color: '#9c27b0' },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#9c27b0',
    },
  },
  speedDial: {
    position: 'fixed',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
  fabButton: {
    color: 'white',
    backgroundColor: '#9c27b0',
    '&:hover': {
      backgroundColor: '#9c27b0',
    }
  },
  fabButtonSecondary: {
    color: 'white',
    backgroundColor: '#ba68c8',
    '&:hover': {
      backgroundColor: '#ba68c8',
    }
  },
  fabButtonError: {
    color: 'white',
    backgroundColor: '#e53935',
    '&:hover': {
      backgroundColor: '#e53935',
    }
  },
  fabToolTip: {
    'backgroundColor': '#000000'
  }
});

const colorChips = createMuiTheme({
  palette: {
    primary: {
      500: colors.green[500]
    },
    secondary: {
      A400: colors.pink[500]
    }
  }
})

const customColor = createMuiTheme({
  palette: {
    primary: {
      main: colors.purple[500],
      light: colors.purple[300],
      dark: colors.purple[700]
    }
  }
})

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
      classes: [],
      currentClass: 'Chung',
      selectedClass: '',
      itemPerPage: 10,
      tablePage: 0,
      selectedRecord: {},
      numberOfRecord: 0,
      isExpansionButton: false,
      floatingFormType: '',
      search: '',
      currentTeachers: [],

      windowsWidth: 0,
      windowsHeight: 0,

      materialColumn: [
        {
          title: 'Tên Thiếu nhi',
          field: 'name',
          cellStyle: { minWidth: 200 }
        },
        {
          title: 'Giáo khu',
          field: 'diocese'
        },
        {
          title: 'Ngày sinh',
          field: 'birthday'
        },
        {
          title: 'Điểm HKI',
          field: 'scoreI',
        },
        {
          title: 'Điểm HKII',
          field: 'scoreII'
        },
        {
          title: 'Điểm cả năm',
          field: 'finalScore'
        },
      ],
      isLoadingData: true,
      action: 'view',

      selectedRows: [],

      updateStatus: '',
      snackerBarStatus: false,
      snackbarMessage: "",
      snackbarType: "success",

      themeColor: 'linear-gradient(to right bottom, #ba68c8, #9c27b0)',

      //for Speed dial
      actions: [
        {
          icon: <LooksOne style={{ color: `${colors.purple[300]}` }} />,
          name: 'Khóa điểm HKI',
          keyword: 'HKI'
        },
        {
          icon: <LooksTwo style={{ color: `${colors.purple[300]}` }} />,
          name: 'Khóa điểm HKII',
          keyword: 'HKII'
        },
        {
          icon: <Lock style={{ color: `${colors.purple[700]}` }} />,
          name: 'Khóa điểm cả năm',
          keyword: 'Final'
        },
        {
          icon: <LockOpen style={{ color: 'red' }} />,
          name: 'Xóa toàn bộ điểm'
        }
      ],
      isSpeedDialOpen: false,
      isOpenActionMenu: null,
      isOpenLockScoreMenu: null,
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this._isMounted = false;
  }

  componentDidMount = () => {
    this._isMounted = true;
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    return this.getData("", this.state.tablePage, this.state.itemPerPage, null) && this.getNumberOfRecord("") && this.getClasses();
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
    this._isMounted = false;
  }

  updateWindowDimensions() {
    if (this._isMounted) {
      this.setState({
        windowsWidth: window.innerWidth,
        windowsHeight: window.innerHeight
      });
    }
  }

  getClasses = () => {
    return axios
      .get('/backend/class/all')
      .then(result => {
        if (this._isMounted) {
          let classArr = [];
          result.data.data.forEach(res => {
            classArr.push({
              'title': res.Value,
              'ID': res.ID
            })
          })
          this.setState({
            classes: classArr
          });
        }
      });
  }

  getNumberOfRecord = (className) => {
    if (className !== "") {
      const classID = className;
      return axios
        .get('/backend/children/count', {
          params: {
            condition: classID
          }
        })

        .then(result => {
          if (this._isMounted) {
            this.setState({
              numberOfRecord: result.data.data
            })
          }

          return axios.get(`/backend/user/get-user-by-class/${classID}`)
        })
        .then(result => {
          if (this._isMounted) {
            this.setState({
              currentTeachers: result.data.data
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
    else {
      return axios
        .get('/backend/children/count', {
          params: {
            condition: ""
          }
        })
        .then(result => {
          if (this._isMounted) {
            this.setState({
              numberOfRecord: result.data.data
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
  }

  getData = (classID, page, itemPerPage, search) => {
    const className = classID;
    return axios.get(`/backend/children/all/${page}`, {
      params: {
        itemPerPage: itemPerPage,
        class: className,
        search: search
      }
    })
      .then(result => {
        if (this._isMounted) {
          let modifiedData = result.data.data;
          modifiedData.forEach(row => {
            row.birthday = (row.birthday === '' ? row.birthday : moment(row.birthday).format('DD/MM/YYYY'))
            row.day_of_baptism = (row.day_of_baptism === '' ? row.day_of_baptism : moment(row.day_of_baptism).format('DD/MM/YYYY'))
            row.day_of_eucharist = (row.day_of_eucharist === '' ? row.day_of_eucharist : moment(row.day_of_eucharist).format('DD/MM/YYYY'))
            row.day_of_confirmation = (row.day_of_confirmation === '' ? row.day_of_confirmation : moment(row.day_of_confirmation).format('DD/MM/YYYY'));
          })
          this.setState({
            records: modifiedData,
            isLoadingData: false,
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
      records: [],
      isLoadingData: true,
      tablePage: 0,
      itemPerPage: 10,
      search: '',
      isOpenActionMenu: null
    });

    return this.getData(this.state.selectedClass, 0, 10, null) && this.getNumberOfRecord(this.state.selectedClass);
  }

  multipleDelete = () => {
    let childrenNames = []
    this.state.selectedRows.forEach(row => {
      childrenNames.push(row.name)
    });

    return axios
      .delete('/backend/children/delete/by-names', {
        params: {
          names: childrenNames
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

  lockSemesterScores = (scoreType) => {
    this.setState({isOpenLockScoreMenu: null})
    const typeInfo = {
      'type': scoreType,
      'class': this.state.selectedClass
    }
    return axios
      .post(`backend/children/lock-scores`, typeInfo)
      .then(res => {
        if (res.data.code === 'I001') {
          this.reloadData();
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({
          snackbarType: 'error',
          snackerBarStatus: true,
          snackbarMessage: 'Đã có lỗi xảy ra từ máy chủ'
        })
      })
  }

  resetScores = () => {
    this.setState({isOpenLockScoreMenu: null})
    return axios
      .delete(`/backend/children/reset-scores/${this.state.selectedClass}`)
      .then(res => {
        if (res.data.code === 'I001') {
          this.reloadData();
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleChangeRowsPerPage = (size) => {
    this.setState({
      itemPerPage: size,
      isLoadingData: true
    })
    return (this.state.action === 'search') ? this.getData(this.state.selectedClass, this.state.tablePage, size, this.state.search) : this.getData(this.state.selectedClass, this.state.tablePage, size);
  }

  handleChangePage = (page) => {
    this.setState({
      tablePage: page,
      isLoadingData: true,
    })
    return (this.state.action === 'search') ? this.getData(this.state.selectedClass, page, this.state.itemPerPage, this.state.search) : this.getData(this.state.selectedClass, page, this.state.itemPerPage);
  }

  handleCallBackFloatingform = (callback) => {
    this.setState({
      isExpansionButton: callback
    })
  }

  handleResetSelectedRow = (callback) => {
    this.setState({
      selectedRecord: callback
    })
  }

  handleStatusFromFloatingForm = (callback) => {
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

  callbackSnackerBarHanlder = (callback) => {
    this.setState({ snackerBarStatus: callback });
  }

  handleRowSelection = (e, rowData) => {
    this.setState({
      isExpansionButton: true,
      floatingFormType: 'edit',
      selectedRecord: rowData,
      selectedRows: []
    })
  }

  handleSearchChange = (text) => {
    this.setState({
      search: text,
      records: [],
      isLoadingData: true,
      tablePage: 0,
      numberOfRecord: 0,
      itemPerPage: 10,
      action: 'search'
    })
    if (text !== '') {
      const className = this.state.selectedClass;
      return axios.get(`/backend/children/all/${this.state.tablePage}`, {
        params: {
          itemPerPage: this.state.tablePage,
          class: className,
          search: text
        }
      })
        .then(result => {
          let modifiedData = result.data.data;
          modifiedData.forEach(row => {
            row.birthday = (row.birthday === '' ? row.birthday : moment(row.birthday).format('DD/MM/YYYY'))
            row.day_of_baptism = (row.day_of_baptism === '' ? row.day_of_baptism : moment(row.day_of_baptism).format('DD/MM/YYYY'))
            row.day_of_eucharist = (row.day_of_eucharist === '' ? row.day_of_eucharist : moment(row.day_of_eucharist).format('DD/MM/YYYY'))
            row.day_of_confirmation = (row.day_of_confirmation === '' ? row.day_of_confirmation : moment(row.day_of_confirmation).format('DD/MM/YYYY'));
          })
          this.setState({
            records: modifiedData,
            isLoadingData: false,
            numberOfRecord: modifiedData.length
          })
        })
        .catch(err => {
          console.log(err);
        })
    }
    else {
      this.setState({
        action: 'view'
      })
      return this.getData(this.state.selectedClass, 0, this.state.itemPerPage) && this.getNumberOfRecord(this.state.selectedClass)
    }
  }

  handleExportData = () => {
    this.setState({ isOpenActionMenu: null });
    axios
      .get('/backend/children/export', {
        responseType: 'blob'
      })
      .then(result => {
        let data = new Blob([result.data], { type: result.headers['content-type'] });
        let csvURL = window.URL.createObjectURL(data);
        let link = document.createElement('a');
        link.href = csvURL;
        link.setAttribute('download', `Bản sao TNTT-${moment().format('DDMMYYYYHHMMSS')}.xlsx`);
        link.click();
      })
      .catch(err => {
        console.log(err);
        this.setState({
          snackbarType: 'error',
          snackerBarStatus: true,
          snackbarMessage: 'Đã có lỗi trong quá trình sao lưu'
        })
      })
  }

  handleCloseRestoreFile = () => {
    this.setState({
      restoreFileName: '',
      isUploadDialogOpen: false
    })
    let file = document.getElementById('filePicker');
    file.value = '';
  }

  handleSelectAll = () => {
    let arr = this.state.selectedRows.concat(this.state.records)
    arr = _.uniqBy(arr, item => { return item._id })
    this.setState({
      selectedRows: arr,
      isOpenActionMenu: null
    })
  }

  handleCancelAll = () => {
    this.setState({
      selectedRows: []
    })
  }

  handleClassChange = (e, type) => {
    const result = {};
    result[type] = e.target.value;
    this.setState(result);
    this.setState({
      isLoadingData: true,
      tablePage: 0,
    })
    this.getData(e.target.value, 0, this.state.itemPerPage, null);
    this.getNumberOfRecord(e.target.value)
    let className = (e.target.value === "") ? "all" : e.target.value;
    return axios
      .get(`/backend/class/by-id/${className}`)
      .then(res => {
        if (this._isMounted) {
          this.setState({
            currentClass: res.data.data[0].Value
          })
        }
      })
  }

  handleSpeedDialClose = () => {
    this.setState({ isSpeedDialOpen: false })
  }

  handleSpeedDialOpen = () => {
    this.setState({ isSpeedDialOpen: true })
  }

  toggleExpansionForm = () => {
    this.setState({
      isExpansionButton: !this.state.isExpansionButton,
      floatingFormType: 'new',
      isOpenActionMenu: null,
    })
  }

  render = () => {
    const { classes } = this.props;

    return (
      <div className={(this.state.windowsWidth < 500) ? classes.rootSmallDevice : classes.root}>
        <CustomHeader style={{
          background: this.state.themeColor,
          marginBottom: '-3em'
        }} title={(this.state.currentClass !== 'Chung') ? "Danh sách Thiếu Nhi - " + this.state.currentClass : "Danh sách Thiếu Nhi"}
          subtitle={
            <Toolbar disableGutters>
              <div>
                <Typography variant="subtitle2">Bảng chi tiết sơ yếu lí lịch, lớp, điểm và điểm danh cho từng em thiếu nhi</Typography>
                <Toolbar variant="dense">
                  <Typography variant="subtitle2">Anh/Chị phụ trách</Typography>
                  {this.state.currentTeachers.map(people => (
                    <Chip label={people.holyname + ' ' + people.fullname}
                      key={people.holyname + ' ' + people.fullname}
                      size="small"
                      style={{ marginLeft: '5px', backgroundColor: '#4a148c', color: '#ffffff' }} />
                  ))}
                </Toolbar>
              </div>
              <div style={{ flex: 1 }} />
              <Tooltip title='Mở rộng'>
                <IconButton onClick={(e) => this.setState({ isOpenActionMenu: e.target })}>
                  <MoreVert style={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
            </Toolbar>
          } />
        <Paper className={classes.content} elevation={5}>
          <div className={classes.inner} style={{ height: (this.state.windowsHeight - 300) }}>
            {/* Table */}
            <MuiThemeProvider theme={customColor}>
              <MaterialTable
                title={
                  <Toolbar disableGutters>
                    <Grid container spacing={1} alignItems="flex-end">
                      <Grid item>
                        <Typography variant="subtitle1">Lớp:</Typography>
                      </Grid>
                      <Grid item>
                        <TextField
                          select
                          className={classes.customInput}
                          value={this.state.selectedClass}
                          onChange={e => this.handleClassChange(e, "selectedClass")}
                          fullWidth
                          SelectProps={{
                            MenuProps: {
                              className: classes.menu
                            }
                          }}
                        >
                          {this.state.classes.map(classEl => (
                            <MenuItem key={classEl.title} value={classEl.ID} name={classEl.title}>
                              {classEl.title}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                    <Tooltip title='Chọn toàn bộ trang này'>
                      <IconButton onClick={this.handleSelectAll}>
                        <PlaylistAddCheck />
                      </IconButton>
                    </Tooltip>
                  </Toolbar>
                }
                icons={tableIcons}
                columns={this.state.materialColumn}
                data={this.state.records.map(row => this.state.selectedRows.find(selected => selected._id === row._id) ? { ...row, tableData: { checked: true } } : { ...row, tableData: { checked: false } })}
                onChangePage={(page) => this.handleChangePage(page)}
                onChangeRowsPerPage={pageSize => this.handleChangeRowsPerPage(pageSize)}
                onSearchChange={(text) => this.handleSearchChange(text)}
                totalCount={this.state.numberOfRecord}
                isLoading={this.state.isLoadingData}
                page={this.state.tablePage}
                onSelectionChange={(rows, rowData) => {
                  if (this.state.selectedRows.find(row => row._id === rowData._id)) {
                    let arr = this.state.selectedRows.filter(row => row._id !== rowData._id)
                    this.setState({ selectedRows: arr })
                  }
                  else {
                    this.setState({ selectedRows: [...this.state.selectedRows, rowData] })
                  }
                }}
                localization={{
                  header: {
                    actions: ''
                  },
                  pagination: {
                    previousTooltip: "Trang trước",
                    nextTooltip: "Trang sau",
                    firstTooltip: "Trang đầu",
                    lastTooltip: "Trang cuối",
                    labelRowsSelect: "Dòng"
                  },
                  body: {
                    emptyDataSourceMessage: 'Không có dữ liệu!'
                  },
                  toolbar: {
                    searchPlaceholder: 'Tìm kiếm...',
                    searchTooltip: 'Tìm kiếm'
                  }
                }}
                options={{
                  showFirstLastPageButtons: true,
                  pageSizeOptions: [10, 25, 50],
                  pageSize: this.state.itemPerPage,
                  paging: true,
                  sorting: false,
                  selection: true,
                  showSelectAllCheckbox: false,
                  showTextRowsSelected: false,
                  headerStyle: {
                    position: 'sticky',
                    top: 0,
                    color: '#9c27b0',
                    fontSize: 15,
                  },
                  showTitle: true,
                  maxBodyHeight: this.state.windowsHeight - 417,
                  minBodyHeight: this.state.windowsHeight - 417,
                  search: true,
                  emptyRowsWhenPaging: false,
                  debounceInterval: 1500,
                  actionsColumnIndex: -1,
                  rowStyle: rowData => {
                    if (this.state.selectedRows.indexOf(rowData) !== -1 || rowData.tableData.checked === true) {
                      return { backgroundColor: '#e1bee7' }
                    }
                    else if (rowData._id === this.state.selectedRecord._id) {
                      return { backgroundColor: '#6a1b9a', color: 'white' }
                    }
                    return {};
                  },
                  selectionProps: rowData => ({
                    color: 'primary'
                  }),
                }}

                components={{
                  Container: props => <Paper {...props} elevation={0} />
                }}
                actions={[
                  {
                    icon: () => { return <Edit style={{ color: '#9c27b0' }} /> },
                    tooltip: 'Chỉnh sửa',
                    position: 'row',
                    onClick: (e, rowData) => this.handleRowSelection(e, rowData)
                  }
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
                onClick={this.toggleExpansionForm}
              >
                <ListItemIcon><PersonAdd /></ListItemIcon>
                <ListItemText primary='Đăng ký mới' />
              </MenuItem>
              <MenuItem
                onClick={this.reloadData}
              >
                <ListItemIcon><Cached /></ListItemIcon>
                <ListItemText primary='Cập nhật' />
              </MenuItem>
              <MenuItem
                onClick={this.handleExportData}
              >
                <ListItemIcon><GetApp /></ListItemIcon>
                <ListItemText primary='Xuất file (.xlsx)' />
              </MenuItem>
            </Menu>
          </div>
          <Collapse in={(this.state.selectedRows.length > 0) ? true : false}>
            <div style={{ border: `2px solid ${colors.purple[300]}` }}>
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
                          <Grid item xs={12} sm={6} md={4} lg={3} key={row.name}>
                            <MuiThemeProvider theme={colorChips}>
                              <Chip
                                icon={<Person />}
                                label={row.name}
                                size="small"
                                color={(row.male === 'x') ? 'primary' : 'secondary'}
                                deleteIcon={<Clear />}
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
                          style={{ color: `${colors.purple[300]}` }}
                        ><Clear /></IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </div>
          </Collapse>
          <FloatingForm
            open={this.state.isExpansionButton}
            callback={this.handleCallBackFloatingform}
            type={this.state.floatingFormType}
            selectedData={this.state.selectedRecord}
            updateStatus={this.handleStatusFromFloatingForm}
            resetSelectedRow={this.handleResetSelectedRow} />
        </Paper>
        <SnackDialog
          variant={this.state.snackbarType}
          message={this.state.snackbarMessage}
          className={this.state.snackbarType}
          callback={this.callbackSnackerBarHanlder}
          open={this.state.snackerBarStatus}
          type={this.state.floatingFormType}
        />
        <Zoom
          in={(this.state.currentClass !== 'Chung' && this.state.selectedClass === localStorage.getItem('currentClass')) ? true : false}
          style={{
            transitionDelay: `0ms`,
          }}
          unmountOnExit
        >
          <Fab
            variant='extended'
            size='medium'
            className={classes.fabButton}
            style={{
              position: 'fixed',
              bottom: '1em',
              right: '1em'
            }}
            onClick={(e) => { this.setState({ isOpenLockScoreMenu: e.target }) }}>
            <Lock style={{ marginRight: '5px' }} /> Khóa điểm
        </Fab>
        </Zoom>
        <Menu
          anchorEl={this.state.isOpenLockScoreMenu}
          open={Boolean(this.state.isOpenLockScoreMenu)}
          onClose={() => { this.setState({ isOpenLockScoreMenu: null }) }}
          keepMounted
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {this.state.actions.map(action => (
            (action.name === 'Xóa toàn bộ điểm') ?
              <MenuItem onClick={this.resetScores} key={action.name}>
                <ListItemIcon>{action.icon}</ListItemIcon>
                <ListItemText primary={action.name} />
              </MenuItem>
              :
              <MenuItem onClick={() => this.lockSemesterScores(action.keyword)} key={action.name}>
                <ListItemIcon>{action.icon}</ListItemIcon>
                <ListItemText primary={action.name} />
              </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

export default withStyles(useStyles)(Dashboard);
