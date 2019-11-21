import React from 'react';
import { withStyles } from '@material-ui/styles';
import axios from 'axios';
import {
  Add,
  Edit,
} from '@material-ui/icons/';
import {
  Typography,
  Paper,
} from '@material-ui/core';

import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  PagingPanel,
  SearchPanel,
  Toolbar,
  TableFixedColumns
} from '@devexpress/dx-react-grid-material-ui'
import {
  PagingState,
  SortingState,
  CustomPaging,
  SearchState,
} from '@devexpress/dx-react-grid'

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
      search: '',

      windowsWidth: 0,
      windowsHeight: 0,

      materialColumns: [
        {
          title: 'Họ và tên thánh',
          name: 'firstname'
        },
        {
          title: 'Tên',
          name: 'lastname'
        },
        {
          title: 'Họ tên Cha',
          name: 'father_name',
        },
        {
          title: 'Họ tên Mẹ',
          name: 'mother_name',
        },
        {
          title: 'Giáo khu',
          name: 'diocese',
          searchable: false
        },
        {
          title: 'Nam',
          name: 'male',
        },
        {
          title: 'Sinh nhật',
          name: 'birthday',
        },
        {
          title: 'Ngày Rửa tội',
          name: 'day_of_baptism',
        },
        {
          title: 'Ngày Rước lễ',
          name: 'day_of_eucharist',
        },
        {
          title: 'Ngày Thêm sức',
          name: 'day_of_confirmation',
        },
        {
          title: 'Địa chỉ',
          name: 'address',
        },
        {
          title: 'Liên lạc',
          name: 'contact',
        },
        {
          title: 'Lớp',
          name: 'class',
        }
      ],
      columnExtensions: [
        {
          columnName: 'firstname',
          width: '200px',
        },
        {
          columnName: 'father_name',
          width: '250px'
        },
        {
          columnName: 'mother_name',
          width: '250px'
        },
        {
          columnName: 'diocese',
          align: 'center'
        },
        {
          columnName: 'male',
          align: 'center'
        },
      ],
      leftColumns: ['firstname', 'lastname']
    }

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.location.pathname.split("/")[2] !== prevProps.location.pathname.split("/")[2]) {
      this.setState({
        tablePage: 0
      });
      this.getData(0, this.state.itemPerPage);
      this.getNumberOfRecord()
    }
  }

  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    this.getData(this.state.tablePage, this.state.itemPerPage);
    this.getNumberOfRecord();
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

  getData = (page, itemPerPage) => {
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
        let modifiedData = result.data.data;
        // modifiedData.forEach(row => {
        //   row.firstname = row.firstname + ' ' + row.lastname;
        //   delete row.lastname;
        // })
        this.setState({
          records: modifiedData,
        })
      })
      .catch(err => {
        console.log(err);
      })

  }

  handleChangeRowsPerPage = (size) => {
    this.setState({
      itemPerPage: size
    })
    this.getData(this.state.tablePage, size);
  }

  handleChangePage = (page) => {
    this.setState({
      tablePage: page
    })
    return this.getData(page, this.state.itemPerPage);
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

  handleSearchChange = (text) => {
    console.log(text);
    this.setState({
      search: text
    })
    if(text !== '') {
      return axios
      .get('/backend/children/find', {
        params: {
          search: text
        }
      })
      .then(result => {
        let modifiedData = result.data.data;
        this.setState({
          records: modifiedData,
          numberOfRecord: modifiedData.length
        })
      })
      .catch(err => {
        console.log(err);
      })
    }
    else {
      return this.getData(0, this.state.itemPerPage) && this.getNumberOfRecord()
    }
  }

  toggleExpansionForm = (e) => {
    this.setState({
      isExpansionButton: !this.state.isExpansionButton,
      floatingFormType: 'new'
    })
  }

  render = () => {
    const { classes } = this.props;
    

    return (
      <div className={(this.state.windowsWidth < 500) ? { padding: 0 } : classes.root}>
        <Paper className={classes.root}>
          <Typography variant="h4">
            {(this.props.location.pathname.split("/")[2] === 'all') ? "Danh sách chung" : `Danh sách lớp ${this.state.currentClass}`}
          </Typography>
          <div className={classes.inner}>
            <Grid rows={this.state.records} columns={this.state.materialColumns}>
              <SearchState
                value={this.state.search}
                onValueChange={text => this.handleSearchChange(text)}
                />
              <PagingState
                defaultCurrentPage={this.state.tablePage}
                defaultPageSize={this.state.itemPerPage}
                currentPage={this.state.tablePage}
                onCurrentPageChange={page => this.handleChangePage(page)}
                pageSize={this.state.itemPerPage}
                onPageSizeChange={size => this.handleChangeRowsPerPage(size)} />
              <CustomPaging
                totalCount={this.state.numberOfRecord} />
              <VirtualTable 
                columnExtensions={this.state.columnExtensions}/>  
              <TableHeaderRow 
                messages={{
                  sortingHint: 'Sắp xếp'
                }}/>
              <TableFixedColumns 
                leftColumns={this.state.leftColumns}/>
              <Toolbar />
              <SearchPanel 
                messages={{
                  searchPlaceholder: 'Tìm kiếm'
                }}/>
              <PagingPanel
                pageSizes={[10, 25, 50]} />
            </Grid>
          </div>
          <FloatingForm
            open={this.state.isExpansionButton}
            callback={this.handleCallBackFloatingform}
            type={this.state.floatingFormType} />
        </Paper>
      </div>
    );
  }
}

export default withStyles(useStyles)(Dashboard);
