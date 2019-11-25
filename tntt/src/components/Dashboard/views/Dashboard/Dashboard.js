import React from 'react';
import { withStyles } from '@material-ui/styles';
import axios from 'axios';
import moment from 'moment';
import {
  Add,
  Edit,
  Cached,
  GetApp,
} from '@material-ui/icons/';
import {
  Paper,
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
          field:  'name'
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
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.location.pathname.split("/")[2] !== prevProps.location.pathname.split("/")[2]) {
      this.setState({
        tablePage: 0
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
    if(dateString.indexOf('-') > -1) {
      let dateArr = dateString.split('-');
      return dateArr[2] + '-' + 
      ((dateArr[1].charAt(0) !== '0' && parseInt(dateArr[1]) < 10)? '0' + dateArr[1] : dateArr[1]) + '-' + 
      ((dateArr[0].charAt(0) !== '0' && parseInt(dateArr[0]) < 10)? '0' + dateArr[0] : dateArr[0]);
    } else if(dateString.indexOf('/') > -1) {
      let dateArr = dateString.split('/');
      return dateArr[2] + '-' + 
      ((dateArr[1].charAt(0) !== '0' && parseInt(dateArr[1]) < 10)? '0' + dateArr[1] : dateArr[1]) + '-' + 
      ((dateArr[0].charAt(0) !== '0' && parseInt(dateArr[0]) < 10)? '0' + dateArr[0] : dateArr[0]);
    } else if(dateString.indexOf('.') > -1) {
      let dateArr = dateString.split('.');
      return dateArr[2] + '-' + 
      ((dateArr[1].charAt(0) !== '0' && parseInt(dateArr[1]) < 10)? '0' + dateArr[1] : dateArr[1]) + '-' + 
      ((dateArr[0].charAt(0) !== '0' && parseInt(dateArr[0]) < 10)? '0' + dateArr[0] : dateArr[0]);
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
          row.day_of_confirmation = (row.day_of_confirmation === ''? row.day_of_confirmation : moment(this.formatDate(row.day_of_confirmation)).format('DD/MM/YYYY'));
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

  handleChangeRowsPerPage = (size) => {
    this.setState({
      itemPerPage: size,
      isLoadingData: true
    })
    return (this.state.action === 'search')? this.getData(this.state.tablePage, size, this.state.search) : this.getData(this.state.tablePage, size);
  }

  handleChangePage = (page) => {
    this.setState({
      tablePage: page,
      isLoadingData: true
    })
    return (this.state.action === 'search')? this.getData(page, this.state.itemPerPage, this.state.search) : this.getData(page, this.state.itemPerPage);
  }

  handleCallBackFloatingform = (callback) => {
    this.setState({
      isExpansionButton: callback
    })
  }

  handleRowSelection = (e, rowData) => {
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
    if(text !== '') {
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
          // row.firstname = row.firstname + ' ' + row.lastname;
          // delete row.lastname;
          
          row.birthday = (row.birthday === '' ? row.birthday : moment(this.formatDate(row.birthday)).format('DD/MM/YYYY'))
          row.day_of_baptism = (row.day_of_baptism === '' ? row.day_of_baptism : moment(this.formatDate(row.day_of_baptism)).format('DD/MM/YYYY'))
          row.day_of_eucharist = (row.day_of_eucharist === '' ? row.day_of_eucharist : moment(this.formatDate(row.day_of_eucharist)).format('DD/MM/YYYY'))
          row.day_of_confirmation = (row.day_of_confirmation === ''? row.day_of_confirmation : moment(this.formatDate(row.day_of_confirmation)).format('DD/MM/YYYY'));
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

  toggleExpansionForm = () => {
    this.setState({
      isExpansionButton: !this.state.isExpansionButton,
      floatingFormType: 'new'
    })
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
                  backgroundColor: '#38b6ff',
                  color: '#000000',
                  fontSize: 14,
                },
                maxBodyHeight: '500px',
                search: true,
                emptyRowsWhenPaging: false,
                debounceInterval: 500
              }}
              actions={[
                {
                  icon: () => { return <Edit/> },
                  tooltip: "Chỉnh sửa",
                  onClick: (e, rowData) => {
                    this.handleRowSelection(e, rowData);
                  }
                },
                {
                  icon: () => {return <Add />},
                  tooltip: "Đăng ký thiếu nhi mới",
                  isFreeAction: true,
                  onClick: () => this.toggleExpansionForm()
                },
                {
                  icon: () => {return <Cached />},
                  tooltip: "Cập nhật danh sách",
                  isFreeAction: true,
                  onClick: () => this.reloadData(),
                },
                {
                  icon: () => {return <GetApp />},
                  tooltip: "Tải toàn bộ danh sách",
                  isFreeAction: true,
                  onClick: () => alert('Clicked!'),
                }
              ]}
              />
          </div>
          <FloatingForm
            open={this.state.isExpansionButton}
            callback={this.handleCallBackFloatingform}
            type={this.state.floatingFormType}
            selectedData={this.state.selectedRecord} />
        </Paper>
      </div>
    );
  }
}

export default withStyles(useStyles)(Dashboard);
