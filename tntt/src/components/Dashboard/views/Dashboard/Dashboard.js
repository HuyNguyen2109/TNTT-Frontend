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
  Edit,
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
} from '@material-ui/core';
import MaterialTable from 'material-table';

import FloatingForm from './components/floatingForm';
import tableIcons from './components/tableIcon';

const useStyles = theme => ({
  root: {
    padding: theme.spacing(4),
    width: '100%',
  },
  content: {
    padding: 0
  },
  inner: {
    overflow: 'auto',
    marginTop: theme.spacing(1),
    maxHeight: 650
  },
  nameContainer: {
    padding: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  menu: {
    width: 200,
  },
  formButton: {
    marginTop: theme.spacing(2),
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
      itemPerPage: 10,
      tablePage: 0,
      selectedRecord: {},
      numberOfRecord: 0,
      currentClass: '',
      isExpansionButton: false,
      floatingFormType: '',
      search: '',

      windowsWidth: 0,
      windowsHeight: 0,

      materialColumn: [
        {
          title: 'Tên Thiếu nhi',
          field: 'name'
        },
        {
          title: 'Họ tên Cha',
          field: 'father_name'
        },
        {
          title: 'Họ tên Mẹ',
          field: 'mother_name'
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
        },
        {
          title: 'Ngày Rửa tội',
          field: 'day_of_baptism'
        },
        {
          title: 'Ngày Rước lễ',
          field: 'day_of_eucharist'
        },
        {
          title: 'Ngày Thêm sức',
          field: 'day_of_confirmation'
        },
        {
          title: 'Địa chỉ',
          field: 'address'
        },
        {
          title: 'Liên lạc',
          field: 'contact'
        },
        {
          title: 'Lớp',
          field: 'class'
        }
      ],
      isLoadingData: true,
      action: 'view',

      isUploadDialogOpen: false,
      restoreFileName: '',
      restoreFile: '',

      selectedRows: [],
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.myRef = createRef();
  }

  scrollToRef = () => this.myRef.current.scrollIntoView({ behavior: 'smooth' });

  componentDidUpdate = (prevProps) => {
    if (this.props.location.pathname.split("/")[2] !== prevProps.location.pathname.split("/")[2]) {
      this.setState({
        tablePage: 0,
      });
      this.getData(0, this.state.itemPerPage, null);
      this.getNumberOfRecord()
    }
  }

  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    return this.getData(this.state.tablePage, this.state.itemPerPage, null) && this.getNumberOfRecord();
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

  formatDate = (dateString) => {
    if (dateString.indexOf('-') > -1) {
      let dateArr = dateString.split('-');
      return dateArr[2] + '-' +
        ((dateArr[1].charAt(0) !== '0' && parseInt(dateArr[1]) < 10) ? '0' + dateArr[1] : dateArr[1]) + '-' +
        ((dateArr[0].charAt(0) !== '0' && parseInt(dateArr[0]) < 10) ? '0' + dateArr[0] : dateArr[0]);
    } else if (dateString.indexOf('/') > -1) {
      let dateArr = dateString.split('/');
      return dateArr[2] + '-' +
        ((dateArr[1].charAt(0) !== '0' && parseInt(dateArr[1]) < 10) ? '0' + dateArr[1] : dateArr[1]) + '-' +
        ((dateArr[0].charAt(0) !== '0' && parseInt(dateArr[0]) < 10) ? '0' + dateArr[0] : dateArr[0]);
    } else if (dateString.indexOf('.') > -1) {
      let dateArr = dateString.split('.');
      return dateArr[2] + '-' +
        ((dateArr[1].charAt(0) !== '0' && parseInt(dateArr[1]) < 10) ? '0' + dateArr[1] : dateArr[1]) + '-' +
        ((dateArr[0].charAt(0) !== '0' && parseInt(dateArr[0]) < 10) ? '0' + dateArr[0] : dateArr[0]);
    } else return dateString;
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

  getData = (page, itemPerPage, search) => {
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
            class: className,
            search: search
          }
        })
      })
      .then(result => {
        let modifiedData = result.data.data;
        modifiedData.forEach(row => {
          // row.firstname = row.firstname + ' ' + row.lastname;
          // delete row.lastname;

          row.birthday = (row.birthday === '' ? row.birthday : moment(this.formatDate(row.birthday)).format('DD/MM/YYYY'))
          row.day_of_baptism = (row.day_of_baptism === '' ? row.day_of_baptism : moment(this.formatDate(row.day_of_baptism)).format('DD/MM/YYYY'))
          row.day_of_eucharist = (row.day_of_eucharist === '' ? row.day_of_eucharist : moment(this.formatDate(row.day_of_eucharist)).format('DD/MM/YYYY'))
          row.day_of_confirmation = (row.day_of_confirmation === '' ? row.day_of_confirmation : moment(this.formatDate(row.day_of_confirmation)).format('DD/MM/YYYY'));
        })
        this.setState({
          records: modifiedData,
          isLoadingData: false,
        })
      })
      .catch(err => {
        console.log(err);
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

    return this.getData(0, 10, null) && this.getNumberOfRecord();
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
        }
      })
      .catch(err => {
        console.log(err)
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
    return (this.state.action === 'search') ? this.getData(this.state.tablePage, size, this.state.search) : this.getData(this.state.tablePage, size);
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
        return (this.state.action === 'search') ? this.getData(page, this.state.itemPerPage, this.state.search) : this.getData(page, this.state.itemPerPage);
      }
    }
    else {
      this.setState({
        tablePage: page,
        isLoadingData: true,
      })
      return (this.state.action === 'search') ? this.getData(page, this.state.itemPerPage, this.state.search) : this.getData(page, this.state.itemPerPage);
    }
  }

  handleCallBackFloatingform = (callback) => {
    this.setState({
      isExpansionButton: callback
    })
  }

  handleRowSelection = (e, rowData) => {
    this.scrollToRef();
    this.setState({
      isExpansionButton: true,
      floatingFormType: 'edit',
      selectedRecord: JSON.stringify(rowData)
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
      return axios
        .get('/backend/class/by-path', {
          params: {
            path: this.props.location.pathname
          }
        })
        .then(result => {
          const className = result.data.data[0].ID;
          return axios.get(`/backend/children/all/${this.state.tablePage}`, {
            params: {
              itemPerPage: this.state.tablePage,
              class: className,
              search: text
            }
          })
        })
        .then(result => {
          let modifiedData = result.data.data;
          modifiedData.forEach(row => {
            row.birthday = (row.birthday === '' ? row.birthday : moment(this.formatDate(row.birthday)).format('DD/MM/YYYY'))
            row.day_of_baptism = (row.day_of_baptism === '' ? row.day_of_baptism : moment(this.formatDate(row.day_of_baptism)).format('DD/MM/YYYY'))
            row.day_of_eucharist = (row.day_of_eucharist === '' ? row.day_of_eucharist : moment(this.formatDate(row.day_of_eucharist)).format('DD/MM/YYYY'))
            row.day_of_confirmation = (row.day_of_confirmation === '' ? row.day_of_confirmation : moment(this.formatDate(row.day_of_confirmation)).format('DD/MM/YYYY'));
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
      return this.getData(0, this.state.itemPerPage) && this.getNumberOfRecord()
    }
  }

  handleExportData = () => {
    axios
      .get('/backend/children/export')
      .then(result => {
        console.log(result);
        let data = new Blob([result.data.data], { type: 'text/csv;charset=utf-8;' });
        let csvURL = window.URL.createObjectURL(data);
        let link = document.createElement('a');
        link.href = csvURL;
        link.setAttribute('download', `Bản sao TNTT-${moment().format('DDMMYYYYHHMMSS')}.csv`);
        link.click();
      })
      .catch(err => {
        console.log(err);
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

  handleDeleteRow = (e, rowData) => {
    let r = window.confirm('Bạn có chắc muốn xóa em Thiếu nhi này?');
    if (r === true) {
      this.setState({
        isLoadingData: true
      });
      return axios
        .delete('/backend/children/delete/by-name', {
          params: {
            name: rowData.name
          }
        })
        .then(res => {
          if (res.data.code === "I001") {
            this.reloadData()
          }
        })
        .catch(err => {
          alert(err);
        })
    }
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
    this.setState({
      selectedRows: this.state.records
    })
  }

  handleCancelAll = () => {
    this.setState({
      selectedRows: []
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
        <Paper className={classes.root}>
          <div className={classes.inner}>
            {/* Table */}
            <MaterialTable
              title={(this.props.location.pathname.split("/")[2] === 'all') ? "Danh sách chung" : `Danh sách lớp ${this.state.currentClass}`}
              icons={tableIcons}
              columns={this.state.materialColumn}
              data={this.state.records}
              onChangePage={(page) => this.handleChangePage(page)}
              onChangeRowsPerPage={pageSize => this.handleChangeRowsPerPage(pageSize)}
              onSearchChange={(text) => this.handleSearchChange(text)}
              onRowClick={(e, rowData) => this.handleRowClick(e, rowData)}
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
                  backgroundColor: '#ffa000',
                  color: '#000000',
                  fontSize: 14,
                },
                maxBodyHeight: '500px',
                search: true,
                emptyRowsWhenPaging: false,
                debounceInterval: 1500,
                rowStyle: rowData => {
                  if (this.state.selectedRows.indexOf(rowData) !== -1) {
                    return { backgroundColor: '#ffecb3' }
                  }
                  return {};
                }
              }}
              actions={[
                {
                  icon: () => { return <Edit /> },
                  tooltip: "Chỉnh sửa",
                  onClick: (e, rowData) => {
                    this.handleRowSelection(e, rowData);
                  }
                },
                {
                  icon: () => { return <Delete /> },
                  tooltip: "Xóa",
                  onClick: (e, rowData) => {
                    this.handleDeleteRow(e, rowData);
                  }
                },
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
                }
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
            selectedData={this.state.selectedRecord} />
          <input id="filePicker" type="file" onChange={e => this.handleFileChange(e)} accept=".csv" style={{ 'display': 'none' }} />
        </Paper>
        <div ref={this.myRef} />
      </div>
    );
  }
}

export default withStyles(useStyles)(Dashboard);
