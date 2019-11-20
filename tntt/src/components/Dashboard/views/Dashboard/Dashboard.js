import React from 'react';
import { withStyles } from '@material-ui/styles';
import axios from 'axios';
import {
  Cached,
  Add,
  Edit,
  Search,
} from '@material-ui/icons/';
import {
  Grid,
  Typography,
  Paper,
  TextField,
  InputAdornment
} from '@material-ui/core';
import MaterialTable from 'material-table';

import FloatingForm from './components/floatingForm';
import tableIcons from './components/tableIcons';

const useStyles = theme => ({
  root: {
    padding: theme.spacing(4),
    width: '100%',
  },
  content: {
    padding: 0
  },
  inner: {
    maxHeight: 500,
    overflow: 'auto',
    marginTop: theme.spacing(1)
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
      selectedRecord: [],
      numberOfRecord: 0,
      currentClass: '',
      isExpansionButton: false,
      floatingFormType: 'new',

      windowsWidth: 0,
      windowsHeight: 0,
      search: '',
    }

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    this.myRef = React.createRef();
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

  scrollToRef = () => {
    window.scrollTo(0, this.myRef.offsetTop)
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

  reloadData = (e) => {
    console.log('aaa')
    return this.getData(null, 0, this.state.itemPerPage) && this.getNumberOfRecord();
  }

  handleChangeRowsPerPage = (e) => {
    this.setState({
      itemPerPage: e.target.value
    })
    return this.getData(null, this.state.tablePage, e.target.value);
  }

  handleChangeRowsPerPageforMaterialTable = (pageSize) => {
    this.setState({
      itemPerPage: pageSize
    })
    return this.getData(null, this.state.tablePage, pageSize);
  }

  handleChangePage = (page) => {
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

  handleRowSelection = (e, rowData) => {
    this.setState({
      isExpansionButton: true,
      floatingFormType: 'edit'
    })
  }

  handleSearch = (e, type) => {
    const result = {};
    let data = e.target.value;
    result[type] = data;
    this.setState(result)
    
    return axios
      .get('/backend/children/find', {
        params: {
          search: e.target.value
        }
      })
      .then(result => {
        this.setState({
          records: result.data.data,
          numberOfRecord: result.data.data.length
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  toggleExpansionForm = (e) => {
    this.setState({
      isExpansionButton: !this.state.isExpansionButton,
      floatingFormType: 'new'
    })
  }

  render = () => {
    const { classes } = this.props;

    const materialColumns = [
      {
        title: 'Tên Thánh và Họ',
        field: 'firstname'
      },
      {
        title: 'Tên',
        field: 'lastname',
      },
      {
        title: 'Họ tên Cha',
        field: 'father_name',
      },
      {
        title: 'Họ tên Mẹ',
        field: 'mother_name',
      },
      {
        title: 'Giáo khu',
        field: 'diocese',
      },
      {
        title: 'Nam',
        field: 'male',
      },
      {
        title: 'Sinh nhật',
        field: 'birthday',
      },
      {
        title: 'Ngày Rửa tội',
        field: 'day_of_baptism',
      },
      {
        title: 'Ngày Rước lễ',
        field: 'day_of_eucharist',
      },
      {
        title: 'Ngày Thêm sức',
        field: 'day_of_confirmation',
      },
      {
        title: 'Địa chỉ',
        field: 'address',
      },
      {
        title: 'Liên lạc',
        field: 'contact',
      },
      {
        title: 'Lớp',
        field: 'class',
      }
    ];

    return (
      <div className={(this.state.windowsWidth < 500) ? { padding: 0 } : classes.root}>
        <Paper className={classes.root}>
          <Typography variant="h4">
            {(this.props.location.pathname.split("/")[2] === 'all') ? "Danh sách chung" : `Danh sách lớp ${this.state.currentClass}`}
          </Typography>
          <Grid container alignItems="flex-start" justify="flex-end" direction="row">
            <TextField 
              placeholder="Tìm kiếm..."
              id="searchField"
              value={this.state.search}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => this.handleSearch(e, "search")}
            />
          </Grid>
          <div className={classes.inner}>
            <MaterialTable
              icons={tableIcons}
              columns={materialColumns}
              data={this.state.records}
              onChangePage={(page) => this.handleChangePage(page)}
              onChangeRowsPerPage={pageSize => this.handleChangeRowsPerPageforMaterialTable(pageSize)}
              totalCount={this.state.numberOfRecord}
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
                }
              }}
              options={{
                showFirstLastPageButtons: true,
                pageSizeOptions: [10, 25, 50],
                pageSize: this.state.itemPerPage,
                paging: true,
                headerStyle: {
                  position: 'sticky',
                  top: 0,
                  backgroundColor: '#38b6ff',
                  color: '#000000',
                  fontSize: 14,
                },
                maxBodyHeight: '370px',
                search: false,
                emptyRowsWhenPaging: false,
              }}
              onSearchChange={(e) => console.log("search changed: " + e)}
              actions={[
                {
                  icon: () => { return <Edit/> },
                  tooltip: "Chỉnh sửa",
                  onClick: (e, rowData) => {
                    this.handleRowSelection(e, rowData);
                    this.scrollToRef()
                  }
                },
                {
                  icon: () => {return <Add />},
                  tooltip: "Đăng ký thiếu nhi mới",
                  isFreeAction: true,
                  onClick: (e) => this.toggleExpansionForm(e)
                },
                {
                  icon: () => {return <Cached />},
                  tooltip: "Cập nhật danh sách",
                  isFreeAction: true,
                  onClick: () => this.myRef.current && this.myRef.current.onQueryChange(),
                }
              ]}
              />
          </div>
          <FloatingForm open={this.state.isExpansionButton} callback={this.handleCallBackFloatingform} type={this.state.floatingFormType}/>
        </Paper>
      </div>
    );
  }
}

export default withStyles(useStyles)(Dashboard);
