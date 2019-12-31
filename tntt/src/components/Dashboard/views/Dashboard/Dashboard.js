import React, { createRef } from 'react';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import axios from 'axios';
import moment from 'moment';
import {
  PersonAdd,
  Cached,
  Backup,
  Restore,
  InsertDriveFile,
  Check,
  Clear,
  Delete,
  PlaylistAddCheck,
  Cancel,
} from '@material-ui/icons/';
import {
  Paper,
  Button,
  Typography,
  Toolbar,
  Chip,
  Collapse,
  Grid,
  TextField,
  MenuItem,
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
  content: {
    padding: theme.spacing(4),
    width: '100%',
  },
  inner: {
    overflow: 'auto',
    marginTop: theme.spacing(1),
    maxHeight: 400
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
  formButton: {
    marginTop: theme.spacing(1),
  },
  exportDialog: {
    padding: theme.spacing(4),
    width: '100%',
  },
  flexGrow: {
    flexGrow: 1
  },
  chipsContainer: {
    backgroundColor: '#ff8a80',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
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
      selectedClass: 'all',
      itemPerPage: 10,
      tablePage: 0,
      selectedRecord: {},
      numberOfRecord: 0,
      isExpansionButton: false,
      floatingFormType: '',
      search: '',

      windowsWidth: 0,
      windowsHeight: 0,

      materialColumn: [
        {
          title: 'Tên Thiếu nhi',
          field: 'name',
          cellStyle: {minWidth: 200}
        },
        {
          title: 'Giáo khu',
          field: 'diocese'
        },
        {
          title: 'Nam?',
          field: 'male'
        },
        {
          title: 'Ngày sinh',
          field: 'birthday'
        }
      ],
      isLoadingData: true,
      action: 'view',

      isUploadDialogOpen: false,
      restoreFileName: '',
      restoreFile: '',

      selectedRows: [],

      updateStatus: '',
      snackerBarStatus: false,
      snackbarMessage: "",
      snackbarType: "success",

      themeColor: 'linear-gradient(to right bottom, #ba68c8, #9c27b0)',
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.myRef = createRef();
  }

  scrollToRef = () => this.myRef.current.scrollIntoView({ behavior: 'smooth' });

  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    localStorage.setItem('title', 'Danh sách Thiếu Nhi');
    return this.getData('all', this.state.tablePage, this.state.itemPerPage, null) && this.getNumberOfRecord('all') && this.getClasses();
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

  getClasses = () => {
    return axios
      .get('/backend/class/all')
      .then(result => {
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
      });
  }

  getNumberOfRecord = (className) => {
    if (className !== 'all') {
      const classID = className;
      return axios
        .get('/backend/children/count', {
          params: {
            condition: classID
          }
        })

      .then(result => {
        this.setState({
          numberOfRecord: result.data.data
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
      search: ''
    });

    return this.getData(this.state.selectedClass, 0, 10, null) && this.getNumberOfRecord(this.state.selectedClass);
  }

  postRestoreFile = () => {
    this.setState({
      isLoadingData: true
    })
    const data = new FormData();
    data.append('files', this.state.restoreFile);
    return axios
      .post('/backend/children/restore', data)
      .then(res => {
        if (res.data.code === "I001") {
          this.reloadData();
          this.handleCloseRestoreFile();
          this.setState({
            snackbarType: 'success',
            snackerBarStatus: true,
            snackbarMessage: 'Phục hồi dữ liệu thành công'
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({
          snackbarType: 'error',
          snackerBarStatus: true,
          snackbarMessage: 'Đã có lỗi trong quá trình phục hồi dữ liệu'
        })
      })
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

  handleChangeRowsPerPage = (size) => {
    this.setState({
      itemPerPage: size,
      isLoadingData: true
    })
    return (this.state.action === 'search') ? this.getData(this.state.selectedClass, this.state.tablePage, size, this.state.search) : this.getData(this.state.selectedClass, this.state.tablePage, size);
  }

  handleChangePage = (page) => {
    if (this.state.selectedRows.length > 0) {
      let ask = window.confirm('Bạn có chắc muốn hủy bỏ việc chọn lựa này?')
      if (ask === true) {
        this.setState({
          selectedRows: [],
          tablePage: page,
          isLoadingData: true,
        })
        return (this.state.action === 'search') ? this.getData(this.state.selectedClass, page, this.state.itemPerPage, this.state.search) : this.getData(this.state.selectedClass, page, this.state.itemPerPage);
      }
    }
    else {
      this.setState({
        tablePage: page,
        isLoadingData: true,
      })
      return (this.state.action === 'search') ? this.getData(this.state.selectedClass, page, this.state.itemPerPage, this.state.search) : this.getData(this.state.selectedClass, page, this.state.itemPerPage);
    }
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
    this.scrollToRef();
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
    axios
      .get('/backend/children/export')
      .then(result => {
        let data = new Blob([result.data.data], { type: 'text/csv;charset=utf-8;' });
        let csvURL = window.URL.createObjectURL(data);
        let link = document.createElement('a');
        link.href = csvURL;
        link.setAttribute('download', `Bản sao TNTT-${moment().format('DDMMYYYYHHMMSS')}.csv`);
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

  handleRestoreData = () => {
    document.getElementById('filePicker').click();
  }

  handleFileChange = (e) => {
    this.scrollToRef();
    const name = e.target.files[0].name;
    this.setState({
      restoreFileName: name,
      isUploadDialogOpen: true,
      restoreFile: e.target.files[0]
    });
  }

  handleCloseRestoreFile = () => {
    this.setState({
      restoreFileName: '',
      isUploadDialogOpen: false
    })
    let file = document.getElementById('filePicker');
    file.value = '';
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

  handleSelectAll = () => {
    this.scrollToRef();
    this.setState({
      selectedRows: this.state.records
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

    return axios
      .get(`/backend/class/by-id/${e.target.value}`)
      .then(res => {
        this.setState({
          currentClass: res.data.data[0].Value
        })
        console.log(res.data.data[0])
      })
  }


  toggleExpansionForm = () => {
    this.setState({
      isExpansionButton: !this.state.isExpansionButton,
      floatingFormType: 'new'
    })
    this.scrollToRef();
  }

  render = () => {
    const { classes } = this.props;

    return (
      <div className={(this.state.windowsWidth < 500) ? { padding: 0, width: '100%' } : classes.root}>
        <CustomHeader style={{
          background: this.state.themeColor,
        }} title={(this.state.currentClass !== 'Chung')? "Danh sách Thiếu Nhi - " + this.state.currentClass : "Danh sách Thiếu Nhi"} 
          subtitle="Bảng chi tiết sơ yếu lí lịch, lớp, điểm và điểm danh cho từng em thiếu nhi"/>
        <Paper className={classes.content} elevation={5}>
          <div className={classes.inner}>
            {/* Table */}
            <MaterialTable
              title={
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item>
                    <Typography variant="subtitle1">Lớp:</Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      select
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
                        <MenuItem key={classEl.ID} value={classEl.ID}>
                          {classEl.title}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              }
              icons={tableIcons}
              columns={this.state.materialColumn}
              data={this.state.records}
              onChangePage={(page) => this.handleChangePage(page)}
              onChangeRowsPerPage={pageSize => this.handleChangeRowsPerPage(pageSize)}
              onSearchChange={(text) => this.handleSearchChange(text)}
              onRowClick={(e, rowData) => this.handleRowSelection(e, rowData)}
              totalCount={this.state.numberOfRecord}
              isLoading={this.state.isLoadingData}
              page={this.state.tablePage}
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
                headerStyle: {
                  position: 'sticky',
                  top: 0,
                  color: '#9c27b0',
                  fontSize: 15,
                },
                showTitle: true,
                maxBodyHeight: '250px',
                search: true,
                emptyRowsWhenPaging: false,
                debounceInterval: 1500,
                rowStyle: rowData => {
                  if (this.state.selectedRows.indexOf(rowData) !== -1) {
                    return { backgroundColor: '#e1bee7' }
                  }
                  return {};
                }
              }}
              actions={[
                {
                  icon: () => { return <PersonAdd /> },
                  tooltip: "Đăng ký thiếu nhi mới",
                  isFreeAction: true,
                  onClick: () => this.toggleExpansionForm()
                },
                {
                  icon: () => { return <Cached /> },
                  tooltip: "Cập nhật danh sách",
                  isFreeAction: true,
                  onClick: () => this.reloadData(),
                },
                {
                  icon: () => { return <Backup /> },
                  tooltip: "Sao lưu toàn bộ danh sách",
                  isFreeAction: true,
                  onClick: () => this.handleExportData(),
                },
                {
                  icon: () => { return <Restore /> },
                  tooltip: "Phục hồi danh sách",
                  isFreeAction: true,
                  onClick: () => this.handleRestoreData(),
                },
                {
                  icon: () => { return <PlaylistAddCheck /> },
                  tooltip: "Chọn toàn bộ trang này",
                  isFreeAction: true,
                  onClick: () => this.handleSelectAll(),
                },
                {
                  icon: () => { return <Delete />},
                  tooltip: 'Chọn xóa',
                  onClick: (e, rowData) => this.handleRowClick(e, rowData)
                },
              ]}
            />
          </div>
          <Collapse in={(this.state.selectedRows.length > 0) ? true : false}>
            <Toolbar className={classes.chipsContainer}>
              <Typography variant="subtitle1">Đã chọn: {this.state.selectedRows.length}</Typography>
              {this.state.selectedRows.map(row => (
                <MuiThemeProvider theme={colorChips} key={row.name}>
                  <Chip label={row.name} size="small" color={(row.male === 'x') ? 'primary' : 'secondary'} />
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
          {(this.state.isUploadDialogOpen) ?
            <Toolbar className={classes.exportDialog}>
              <Typography variant="subtitle1" display="inline">
                <InsertDriveFile fontSize="small" /> Bạn có muốn phục hồi CSDL từ tập tin "{this.state.restoreFileName}"?
              </Typography>
              <div className={classes.flexGrow} />
              <Button
                variant="contained"
                color="primary"
                className={classes.formButton}
                style={{ marginRight: '1em' }}
                onClick={this.postRestoreFile}
              >
                <Check /></Button>
              <Button
                variant="outlined"
                color="primary"
                className={classes.formButton}
                onClick={() => this.handleCloseRestoreFile()}>
                <Clear /></Button>
            </Toolbar> : null}
          <FloatingForm
            open={this.state.isExpansionButton}
            callback={this.handleCallBackFloatingform}
            type={this.state.floatingFormType}
            selectedData={this.state.selectedRecord}
            updateStatus={this.handleStatusFromFloatingForm} 
            resetSelectedRow={this.handleResetSelectedRow}/>
          <input id="filePicker" type="file" onChange={e => this.handleFileChange(e)} accept=".csv" style={{ 'display': 'none' }} />
        </Paper>
        <div ref={this.myRef} />
        <SnackDialog
          variant={this.state.snackbarType}
          message={this.state.snackbarMessage}
          className={this.state.snackbarType}
          callback={this.callbackSnackerBarHanlder}
          open={this.state.snackerBarStatus}
          type={this.state.floatingFormType}
        />
      </div>
    );
  }
}

export default withStyles(useStyles)(Dashboard);
