import React from 'react';
import moment from 'moment';
import axios from 'axios';
import AnimatedNumber from 'animated-number-react';
import Chart from 'chart.js';
import {
  Grid, Typography, IconButton, Tooltip, Divider,
  Toolbar, MenuItem, Menu, ListItemIcon, ListItemText, Select,
  InputBase, LinearProgress, Table, TableHead, TableCell,
  TableBody, TableRow, colors, InputLabel, Chip, Drawer, TextField,
  InputAdornment,
  Icon
} from '@material-ui/core';
import { withStyles, lighten, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import {
  Face, Group, AttachMoney, Add, Publish,
  Delete, Clear, GetApp, ShowChart, MoreVert, InfoOutlined,
  ArrowUpward, ArrowDownward, Edit, Class, GTranslate, Description, EventAvailable, Today, KeyboardArrowLeft, KeyboardArrowRight,
  Title, DateRange, Person, Speed, Check, Update,
} from '@material-ui/icons';
import MaterialTable from 'material-table';
import _ from 'lodash';

import tableIcons from './components/tableIcon';
import Report from './components/Report'
import DialogForm from './components/Dialog';
import SnackDialog from '../../../SnackerBar';
import 'moment/locale/vi';
import firebaseKey from '../../common/firebase.json'

const googleDocs = '/icons8-google-docs-72.png'
const googleSheets = '/icons8-google-sheets-72.png'
const googleSlides = '/icons8-google-slides-72.png'
const googlePdf = '/icons8-pdf-72.png'

const useStyle = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.white
    }
  },
  root: {},
  container: {
    margin: 0,
    width: '100%'
  },
  icon: {
    width: '2em',
    height: '2em',
  },
  chart: {
    width: '8em',
    height: '8em'
  },
  classMap: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  image: {
    width: '100%'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  circleStyle: {
    borderRadius: "50%",
    width: 10,
    height: 10,
    display: "inline-block",
    marginRight: theme.spacing(1),
  },
  colorPrimary: {
    backgroundColor: lighten('#ff9800', 0.5),
  },
  barColorPrimary: {
    backgroundColor: '#ff9800',
  },
  drawerIcon: {
    width: '3em',
    height: '3em'
  },
  documentIconTile: {
    width: '3em',
    height: '3em'
  },
  customInput: {
    '& label.Mui-focused': { color: '#e91e63' },
    '& label.Mui-disabled': { color: '#000000' },
    '& input.Mui-disabled': { color: '#000000' },
    '& textarea.Mui-disabled': { color: '#000000' },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#e91e63',
    },
  },
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

class General extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // Responsive
      innerWidth: 0,
      innerHeight: 0,
      // General
      currentTime: moment().format('DD/MM/YYYY'),
      currentTimeInMonthFormat: moment().format('MM/YYYY'),
      monthCount: 0,
      username: localStorage.getItem('username'),
      duration: 300,
      currentUserPosition: '',
      // Report results
      childrenTotalCount: 0,
      userTotalCount: 0,
      childrenFundTotalCount: 0,
      internalFundTotalCount: 0,
      // option for Bar chart
      selectedPieChartType: 'Lớp',
      doughnutChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 300
        },
        layout: {
          padding: 2
        },
        title: {
          display: true,
          position: 'bottom',
          fontSzie: 14,
          text: 'Biểu đồ số lượng Thiếu nhi'
        },
        legend: {
          display: false,
        },
      },
      lineChartOptions: {
        responsive: true,
        animation: {
          duration: 300
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 25,
              beginAtZero: true,
              callback: (value, i, values) => {
                return value + 'tr'
              }
            },
            gridLines: {
              drawBorder: false,
              display: true,
              color: 'rgba(0,0,0,0.2)',
              zeroLineColor: 'rgba(0,0,0,0.2)',
              borderDash: [1, 4],
              zeroLineBorderDash: [1, 4],
            }
          }],
          xAxes: [{
            ticks: {
              autoSkip: false
            },
            gridLines: {
              display: true,
              drawBorder: false,
              color: 'rgba(0,0,0,0.2)',
              zeroLineColor: 'rgba(0,0,0,0.2)',
              borderDash: [1, 4],
              zeroLineBorderDash: [1, 4],
            }
          }]
        },
        layout: {
          padding: 4
        },
        legend: {
          display: false
        },
      },
      //for Class table
      classes: [],
      classTableColumn: [
        {
          title: 'Mã lớp',
          field: 'ID'
        },
        {
          title: 'Tên lớp',
          field: 'Value'
        },
        {
          title: '',
          field: 'colorChip',
          render: rowData => <Chip style={{ backgroundColor: rowData.colorChip }} />
        }
      ],
      oldClassName: '',
      selectedClassRows: [],
      isOpenAddClassForm: false,
      isButtonDisabled: false,
      isOpenClassActionMenu: null,
      //for Children Fund Table
      selectedFundType: 'QTN',
      childrenFunds: [],
      childrenFundColumns: [
        {
          title: 'Ngày',
          field: 'date',
          cellStyle: {
            minWidth: 80,
            maxWidth: 80,
          }
        },
        {
          title: 'Nội dung',
          field: 'title',
          cellStyle: {
            minWidth: 150,
            maxWidth: 150
          }
        },
        {
          title: 'Số tiền',
          field: 'price',
          cellStyle: {
            minWidth: 20,
            maxWidth: 20,
          }
        }
      ],
      isOpenAddFundForm: false,
      isOpenFundActionMenu: null,
      selectedMonths: 6,
      fundDifference: 0,
      internalFundDifferences: 0,
      totalImport: 0,
      totalExport: 0,
      subtractChildrenFund: 0,
      totalInternalImport: 0,
      totalInternalExport: 0,
      subtractInternalFund: 0,
      // for Event Table
      isOpenAddEventForm: false,
      isOpenEventActionMenu: null,
      events: [],
      // for Documents Table
      documents: [],
      isOpenDocumentActionMenu: null,
      isOpenExpansionPanel: false,
      selectedDocumentId: '',
      oldDocumentName: '',
      documentName: '',
      documentDate: '',
      documentModifiedDate: '',
      documentUser: '',
      documentSize: '',
      isRename: false,
      // type of dialog
      typeofDialog: '',
      typeofAction: '',
      dialogContent: '',
      // for snackBar
      snackbarMessage: '',
      snackbarType: 'success',
      snackerBarStatus: false,
      // isLoading
      isLoading: true,
      //for tumblr image APIs
      tumblrImageURL: '',
      tumblrImagePage: '',
      tumbleContent: '',
      isTumblrLoading: true,
      tumblrBodyHeight: '18em',
      //for calendar
      currentDisplayTime: '',
      currentDisplayDate: moment().locale('vi').format('dddd, DD MMMM YYYY'),
      weekdayShort: [],
      calendarContent: [],
      fileType: '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt',
    }

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this._ismounted = false;
  }

  componentDidMount = () => {
    this._ismounted = true;
    this.axiosCancelSource = axios.CancelToken.source();
    this.updateWindowDimensions();
    this.displayTime();
    this.displayCalendar(this.state.monthCount);
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    this.getChildrenData()
    this.getMemberData()
    this.getFundData(this.state.selectedMonths, this.state.selectedFundType)
    this.getClassData(this.state.selectedPieChartType)
    this.getEventData()
    this.getDocumentData()
    this.getTumblrPost();
    return axios.get(`/backend/user/get-user/${localStorage.getItem('username')}`)
      .then(res => {
        if(this._ismounted) {
          this.setState({
            currentUserPosition: res.data.data.type
          })
        }
      })
  }

  componentWillUnmount = () => {
    this._ismounted = false;
    window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
    this.axiosCancelSource.cancel('Unmounted!')
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this._ismounted) {
      if (this.state.monthCount !== prevState.monthCount) {
        this.displayCalendar(this.state.monthCount)
      }
      if (this._ismounted && this.state.selectedDocumentId !== prevState.selectedDocumentId && this.state.selectedDocumentId !== '') {
        return axios.get(`/backend/document/by-id/${this.state.selectedDocumentId}`)
          .then(res => {
            const docDetail = res.data.data[0];
            this.setState({
              documentName: docDetail.filename,
              documentDate: moment(docDetail.date).format('DD/MM/YYYY hh:mm:ss'),
              documentModifiedDate: moment(docDetail.modifiedDate).format('DD/MM/YYYY hh:mm:ss'),
              documentUser: docDetail.username,
              documentSize: docDetail.size
            })
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }

  updateWindowDimensions() {
    if (this._ismounted) {
      this.setState({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });
      if (window.ChildrenFundChart) {
        this.getFundData(this.state.selectedMonths, this.state.selectedFundType);
        this.getClassData(this.state.selectedPieChartType);
      }
    }
  }

  formatValue = (value, type) => {
    if (type === 'đ') {
      return this.priceFormat(value) + ' ' + type;
    }
    else {
      return Number(value).toFixed(0) + ' ' + type;
    }
  }

  formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    else if (size >= 1024 && size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    else if (size >= 1024 * 1024 && size < 1024 * 1024 * 1024) return `${Math.round(size / 1024 * 1024)} MB`;
    else if (size >= 1024 * 1024 * 1024 && size < 1024 * 1024 * 1024 * 1024) return `${Math.round(size / 1024 * 1024 * 1024)} GB`;
    else return `${size}`
  }

  capitalizeWord = (text) => {
    var splitStr = text.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length - 1; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }


    splitStr[splitStr.length - 1] = splitStr[splitStr.length - 1].toUpperCase();
    // Directly return the joined string
    return splitStr.join(' ');
  }

  removeVietnameseLetter = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
  }

  priceFormat = (num) => {
    if (Math.abs(num) > 999 && Math.abs(num) < 999999) {
      return Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'ng';
    }
    else if (Math.abs(num) > 999999) {
      return Math.sign(num) * ((Math.abs(num) / 1000000).toFixed(1)) + 'tr';
    }
    else {
      return num
    };
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

  displayTime = () => {
    if (this._ismounted === true) {
      let localeMoment = moment().locale('vi')
      this.setState({
        currentDisplayTime: localeMoment.format('LTS'),
      })
      setTimeout(this.displayTime, 1000);
    }
  }

  displayCalendar = (number) => {
    if (this._ismounted === true) {
      let month = moment().subtract(number, 'months');
      let firstDay = month.startOf('month').format('d');
      let blanks = [];
      let daysInMonth = [];
      for (let i = 0; i < firstDay; i++) {
        blanks.push(<TableCell key={i + Math.floor(Math.random() * 100000)} style={{ fontSize: 11, textAlign: 'center' }}>{''}</TableCell>);
      }
      for (let d = 1; d <= month.daysInMonth(); d++) {
        if (d === Number(moment().format('D'))) daysInMonth.push(<TableCell key={d} style={{ fontSize: 11, textAlign: 'center', color: 'white', backgroundColor: lighten('#9c27b0', 0.7) }}>{d}</TableCell>);
        else daysInMonth.push(<TableCell key={d} style={{ fontSize: 11, textAlign: 'center' }}>{d}</TableCell>);
      }
      let totalSlot = [...blanks, ...daysInMonth];
      let rows = [], cells = [];
      totalSlot.forEach((row, i) => {
        if (i % 7 !== 0) cells.push(row)
        else {
          rows.push(cells);
          cells = [];
          cells.push(row)
        }
        if (i === totalSlot.length - 1) rows.push(cells)
      })
      let dayArr = rows.map((d, i) => {
        return <TableRow key={i + Math.floor(Math.random() * 100000)}>{d}</TableRow>;
      })
      this.setState({
        weekdayShort: moment.weekdaysShort(),
        calendarContent: dayArr,
        currentTimeInMonthFormat: moment().subtract(number, 'months').format('MM/YYYY')
      })
    }
  }

  getChildrenData = () => {
    if (this._ismounted === true) {
      return axios.get('/backend/children/count', { params: { condition: '' } })
        .then(res => {
          this.setState({ childrenTotalCount: res.data.data })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  getMemberData = () => {
    if (this._ismounted === true) {
      return axios.get('backend/user/all')
        .then(res => {
          this.setState({ userTotalCount: res.data.data.length })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  getEventData = () => {
    if (this._ismounted === true) {
      return axios.get('/backend/event/all')
        .then(res => {
          // Event modifications
          let listOfEvents = res.data.data;
          listOfEvents = _.orderBy(listOfEvents, ['date'], ['desc']);
          listOfEvents.forEach(event => {
            event.date = (event.date === '') ? '' : moment(event.date).format('DD/MM/YYYY');
          })
          // End of Event modifications
          this.setState({ events: listOfEvents })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  getDocumentData = () => {
    if (this._ismounted === true) {
      return axios.get('/backend/document/all')
        .then(res => {
          // Document modifications
          let listOfDocuments = res.data.data;
          listOfDocuments.forEach(doc => {
            doc.date = (doc.date === '') ? '' : moment(doc.date).format('DD/MM/YYYY hh:mm:ss');
          })
          // End of Document modifications
          this.setState({ documents: listOfDocuments })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  getClassData = (type) => {
    let classLabels = [];
    let classData = [];
    let unconfirmedData = 0;
    let allChildren = 0;
    let colors = [];
    let classesArr = [];
    if (this._ismounted === true) {
      return axios.get('/backend/children/count', { params: { condition: '' } })
        .then(res => {
          unconfirmedData = res.data.data
          allChildren = res.data.data
          return axios.get('/backend/class/all')
        })
        .then(classes => {
          // Class modifications
          let axiosRequests = [];
          classesArr = classes.data.data.filter(el => el.Value !== "Chung");

          classesArr.forEach(classEl => {
            classLabels.push(classEl.ID);
            axiosRequests.push(axios.get('/backend/children/count', { params: { condition: classEl.ID } }))
          })
          // End of class modifications
          return axios.all(axiosRequests)
        })
        .then((responseArr) => {
          responseArr.forEach(res => {
            classData.push(res.data.data)
            unconfirmedData -= res.data.data
          })
          classLabels.unshift('Chưa xếp lớp/Đã tốt nghiệp');
          classData.unshift(unconfirmedData);
          //draw chart
          if (window.ChildrenCountChart) {
            window.ChildrenCountChart.destroy();
          }
          colors = classData.map((data, index, classData) => {
            const nonData = '#2196f3'
            if (index === 0) return nonData;
            else return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
          })
          if (type === 'Lớp') {
            Chart.defaults.global.defaultFontColor = 'black'
            let ctx = document.getElementById('chart');
            window.ChildrenCountChart = new Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: classLabels,
                datasets: [{
                  label: 'Sỉ số (em)',
                  data: classData,
                  backgroundColor: colors,
                  hoverBorderWidth: 5,
                  hoverBorderColor: colors
                }]
              },
              options: this.state.doughnutChartOptions
            });
            colors.shift()
            colors.forEach((color, i, colors) => {
              classesArr[i].colorChip = color
            })
            this.setState({ classes: classesArr })
          } else {
            classesArr.forEach(data => {
              switch (data.group) {
                case 'Ấu':
                  data.colorChip = '#76ff03';
                  break;
                case 'Thiếu':
                  data.colorChip = '#3d5afe';
                  break;
                case 'Nghĩa':
                  data.colorChip = '#ffea00';
                  break;
                case 'Hiệp':
                  data.colorChip = '#795548';
                  break;
                default:
                  return null;
              }
            })
            this.setState({ classes: classesArr })
            let dataByGroup = [],
              classLabels = ['Chưa có ngành', 'Ấu', 'Thiếu', 'Nghĩa', 'Hiệp'];
            let itemPerPage = 10;
            let requests = [];
            let childrenData = [];
            let numberOfPage = (allChildren > itemPerPage) ? allChildren / itemPerPage : 1
            for (let i = 0; i < numberOfPage; i++) {
              requests.push(axios.get(`/backend/children/all/${i}`, {
                params: {
                  itemPerPage: itemPerPage,
                  class: '',
                  search: null
                }
              }))
            }
            return axios.all(requests)
              .then(results => {
                requests = [];
                results.forEach(res => {
                  res.data.data.forEach(child => {
                    childrenData.push(child)
                  })
                })
                for (let i = 0; i < childrenData.length; i++) {
                  for (let j = 0; j < classesArr.length; j++) {
                    if (childrenData[i].class === classesArr[j].ID) childrenData[i].group = classesArr[j].group;
                  }
                }
                dataByGroup = [
                  childrenData.filter(el => el.group === '').length,
                  childrenData.filter(el => el.group === 'Ấu').length,
                  childrenData.filter(el => el.group === 'Thiếu').length,
                  childrenData.filter(el => el.group === 'Nghĩa').length,
                  childrenData.filter(el => el.group === 'Hiệp').length,
                ];
                Chart.defaults.global.defaultFontColor = 'black'
                let ctx = document.getElementById('chart');
                window.ChildrenCountChart = new Chart(ctx, {
                  type: 'doughnut',
                  data: {
                    labels: classLabels,
                    datasets: [{
                      label: 'Sỉ số (em)',
                      data: dataByGroup,
                      backgroundColor: ['#2f2f2f', '#76ff03', '#3d5afe', '#ffea00', '#795548'],
                      hoverBorderWidth: 5,
                      hoverBorderColor: ['#2f2f2f', '#76ff03', '#3d5afe', '#ffea00', '#795548']
                    }]
                  },
                  options: this.state.doughnutChartOptions
                });
              })
              .catch(err => console.log(err));
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  getFundData = (numberOfMonths, selectedFundType) => {
    if (this._ismounted === true) {
      let childrenFundArr = [];
      let internalFundArr = [];
      let months = [];
      let n = 0;
      while (n < numberOfMonths) {
        months.push(moment().subtract(n, 'months').format('MM/YYYY'));
        n += 1;
      }
      months = months.reverse()
      months.forEach(month => {
        childrenFundArr.push({
          'month': month,
          'data': 0
        })
        internalFundArr.push({
          'month': month,
          'data': 0
        })
      })

      return axios.all([
        axios.get('/backend/children-fund/all'),
        axios.get('/backend/internal-fund/all'),
      ])
        .then(responses => {
          let dataResponses = [];
          responses.forEach(response => {
            dataResponses.push(response.data.data)
          })
          // Funds modifications
          let totalFunds = 0;
          let allFunds = dataResponses[0];
          let totalImport = 0;
          let totalExport = 0;
          let totalInternalImport = 0;
          let totalInternalExport = 0;
          allFunds = _.sortBy(allFunds, fund => { return fund.date });
          allFunds.forEach(fund => {
            fund.date = (fund.date === '') ? '' : moment(fund.date).format('DD/MM/YYYY');
            totalFunds += fund.price;
            if (fund.date.split('/')[2] === moment().subtract(1, 'years').format('YYYY') && Number(fund.price) >= 0) {
              totalImport += Number(fund.price)
            };
            if (fund.date.split('/')[2] === moment().subtract(1, 'years').format('YYYY') && Number(fund.price) < 0) {
              totalExport += Number(fund.price)
            };
            fund.price = this.priceFormat(fund.price);
          })
          // Internal Fund modifications
          let totalInternalFund = 0;
          let allInternalFunds = dataResponses[1];
          allInternalFunds = _.sortBy(allInternalFunds, fund => fund.date);
          allInternalFunds.forEach(fund => {
            fund.date = (fund.date === '') ? '' : moment(fund.date).format('DD/MM/YYYY');
            totalInternalFund += fund.price;
            if (fund.date.split('/')[2] === moment().subtract(1, 'years').format('YYYY') && Number(fund.price) >= 0) {
              totalInternalImport += Number(fund.price)
            };
            if (fund.date.split('/')[2] === moment().subtract(1, 'years').format('YYYY') && Number(fund.price) < 0) {
              totalInternalExport += Number(fund.price)
            };
            fund.price = this.priceFormat(fund.price);
          })
          //draw chart
          const groupedFunds = _.groupBy(allFunds, fund => fund.date.split("/")[1] + '/' + fund.date.split("/")[2])
          const groupedInternalFunds = _.groupBy(allInternalFunds, fund => fund.date.split("/")[1] + '/' + fund.date.split("/")[2]);
          let transformChildrenFundArr = [];
          let transformInternalFundArr = [];
          Object.entries(groupedFunds).forEach(keys => {
            transformChildrenFundArr.push({
              'key': keys[0],
              'data': keys[1]
            })
          })
          Object.entries(groupedInternalFunds).forEach(keys => {
            transformInternalFundArr.push({
              'key': keys[0],
              'data': keys[1]
            })
          })
          childrenFundArr.forEach(detail => {
            if (transformChildrenFundArr.map(fund => { return fund.key }).indexOf(detail.month) > -1) {
              detail.data = _.sumBy(transformChildrenFundArr[transformChildrenFundArr.map(fund => { return fund.key }).indexOf(detail.month)].data, key => {
                if (key.price.indexOf('tr') > -1) {
                  return Number(key.price.replace('tr', ''))
                }
                else if (key.price.indexOf('ng') > -1) {
                  return Number(key.price.replace('ng', '')) * 1000 / 1000000
                }
                else return Number(key.price)
              })
            }
          })
          internalFundArr.forEach(detail => {
            if (transformInternalFundArr.map(fund => { return fund.key }).indexOf(detail.month) > -1) {
              detail.data = _.sumBy(transformInternalFundArr[transformInternalFundArr.map(fund => { return fund.key }).indexOf(detail.month)].data, key => {
                if (key.price.indexOf('tr') > -1) {
                  return Number(key.price.replace('tr', ''))
                }
                else if (key.price.indexOf('ng') > -1) {
                  return Number(key.price.replace('ng', '')) * 1000 / 1000000
                }
                else return Number(key.price)
              })
            }
          })

          this.setState({
            fundDifference: _.sumBy(childrenFundArr, el => { return el.data }) - _.sumBy(childrenFundArr.slice(0, childrenFundArr.length - 2), el => { return el.data }),
            internalFundDifferences: _.sumBy(internalFundArr, el => { return el.data }) - _.sumBy(internalFundArr.slice(0, internalFundArr.length - 2), el => { return el.data })
          })

          if (window.ChildrenFundChart) {
            window.ChildrenFundChart.destroy();
          }
          Chart.defaults.global.defaultFontColor = 'black'
          let ctx = document.getElementById('childrenFund');
          window.ChildrenFundChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: childrenFundArr.map((data, i, childrenFundArr) => { return data.month }),
              datasets: [{
                label: 'Quỹ Thiếu Nhi (triệu)',
                data: childrenFundArr.map((data, i, childrenFundArr) => { return _.sumBy(childrenFundArr.slice(0, i + 1), el => { return el.data }) }),
                borderColor: 'rgba(76,175,80,0.9)',
                backgroundColor: 'rgba(76,175,80,0.1)',
                hoverBackgroundColor: 'rgba(76,175,80,0.9)',
                pointRadius: 5,
                pointBorderWidth: 3,
                pointBorderColor: 'rgba(76,175,80,0.9)',
                pointBackgroundColor: 'rgba(255,255,255,1.0)',
                showLine: true,
                fill: 'start',
                clip: 50
              }, {
                label: 'Quỹ Nội bộ (triệu)',
                data: internalFundArr.map((data, i, internalFundArr) => { return _.sumBy(internalFundArr.slice(0, i + 1), el => { return el.data }) }),
                borderColor: 'rgba(255,87,34,0.9)',
                backgroundColor: 'rgba(255,87,34,0.1)',
                hoverBackgroundColor: 'rgba(255,87,34,0.9)',
                pointRadius: 5,
                pointBorderWidth: 3,
                pointBorderColor: 'rgba(255,87,34,0.9)',
                pointBackgroundColor: 'rgba(255,255,255,1.0)',
                showLine: true,
                fill: 'start',
                clip: 50
              }]
            },
            options: this.state.lineChartOptions
          })
          // End of Fund modifications
          this.setState({
            childrenFundTotalCount: totalFunds,
            internalFundTotalCount: totalInternalFund,
            childrenFunds: (selectedFundType === 'QTN') ? allFunds : allInternalFunds,
            totalImport: totalImport,
            totalExport: totalExport,
            subtractChildrenFund: totalImport - Math.abs(totalExport),
            totalInternalImport: totalInternalImport,
            totalInternalExport: totalInternalExport,
            subtractInternalFund: totalInternalImport - Math.abs(totalInternalExport)
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  getTumblrPost = () => {
    return axios.get('/backend/database/tumblr/posts', { cancelToken: this.axiosCancelSource.token })
      .then(res => {
        if (this._ismounted) {
          this.setState({
            tumblrImageURL: res.data.data.img,
            tumblrImagePage: res.data.data.url,
            tumbleContent: res.data.data.content,
            isTumblrLoading: false,
          })
        }
      })
      .catch(err => {
        console.log(err)
        if(this._ismounted) {this.setState({ isTumblrLoading: false })}
      })
  }

  createNewClass = (classInformation) => {
    this.setState({ isButtonDisabled: true, isLoading: true })
    let className = classInformation.class;
    let classID = '';
    let classNameSplit = className.split(' ');
    for (let i = 0; i < classNameSplit.length - 1; i++) {
      classID += classNameSplit[i].charAt(0).toUpperCase();
    };
    classID += classNameSplit[classNameSplit.length - 1].toUpperCase();
    const newClass = {
      'ID': this.removeVietnameseLetter(classID),
      'Value': this.capitalizeWord(className),
      'group': classInformation.group,
      'path': `/dashboard/${classID}`
    }
    const firebaseNotification = this.buildFireBaseNotification(
      'Lớp',
      `${localStorage.getItem('username')} vừa tạo lớp ${this.capitalizeWord(className)}`,
      moment().format('DD/MM/YYYY hh:mm:ss'),
      'Class'
    )

    return axios.post('/backend/class/add', newClass)
      .then(res => {
        if (res.data.code === 'I001') {
          this.setState({
            isButtonDisabled: false,
            isOpenAddClassForm: false,
            oldClassName: this.capitalizeWord(className)
          })
          this.getClassData(this.state.selectedPieChartType);
          return axios.post(firebaseKey.endpoint, firebaseNotification, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `key=${firebaseKey.serverKey}`
            }
          }).then(res => { })
        }
      })
      .catch(err => {
        if (err.response.status === 409) {
          this.setState({
            snackerBarStatus: true,
            snackbarType: 'error',
            snackbarMessage: 'Lớp đã có sẵn trong CSDL',
            isButtonDisabled: false
          })
        }
        else {
          this.setState({
            snackerBarStatus: true,
            snackbarType: 'error',
            snackbarMessage: 'Đã có lỗi từ máy chủ',
            isButtonDisabled: false
          })
        }
      })
  }

  editClass = (classData) => {
    this.setState({ isButtonDisabled: true, isLoading: true })
    let className = classData.class;
    let classID = '';
    let classNameSplit = className.split(' ');
    for (let i = 0; i < classNameSplit.length - 1; i++) {
      classID += classNameSplit[i].charAt(0).toUpperCase();
    };
    classID += classNameSplit[classNameSplit.length - 1].toUpperCase();
    const classInformation = {
      'ID': this.removeVietnameseLetter(classID),
      'Value': this.capitalizeWord(className),
      'group': classData.group,
      'path': `/dashboard/${classID}`
    }

    const firebaseNotification = this.buildFireBaseNotification(
      'Lớp',
      `${localStorage.getItem('username')} vừa đổi tên lớp ${this.state.oldClassName} thành ${this.capitalizeWord(className)}`,
      moment().format('DD/MM/YYYY hh:mm:ss'),
      'Edit'
    )

    return axios.put(`/backend/class/update/${classData._id}`, classInformation)
      .then(res => {
        if (res.data.code === 'I001') {
          this.setState({
            isButtonDisabled: false,
            isOpenAddClassForm: false,
            selectedPieChartType: 'Lớp',
          })
          this.getClassData(this.state.selectedPieChartType);
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
      })
  }

  createNewFund = (fund) => {
    this.setState({ isButtonDisabled: true, isLoading: true })

    if (this.state.selectedFundType === 'QTN') {
      const firebaseNotification = this.buildFireBaseNotification(
        'Quỹ Thiếu Nhi',
        `${localStorage.getItem('username')} vừa thêm nhật kỹ quỹ mới`,
        moment().format('DD/MM/YYYY hh:mm:ss'),
        'Fund'
      )
      return axios
        .post('/backend/children-fund/new-fund', fund)
        .then(res => {
          if (res.data.code === 'I001') {
            this.setState({
              isButtonDisabled: false,
              isOpenAddFundForm: false,
              snackerBarStatus: true,
              snackbarType: 'success',
              snackbarMessage: 'Tạo nhật ký thành công',
            })
            this.getFundData(this.state.selectedMonths, this.state.selectedFundType);
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
            snackerBarStatus: true,
            snackbarType: 'error',
            snackbarMessage: 'Đã có lỗi từ máy chủ',
            isButtonDisabled: false
          })
        })
    }
    else {
      const firebaseNotification = this.buildFireBaseNotification(
        'Quỹ Nội Bộ',
        `${localStorage.getItem('username')} vừa thêm nhật kỹ quỹ mới`,
        moment().format('DD/MM/YYYY hh:mm:ss'),
        'InteralFund'
      )
      return axios
        .post('/backend/internal-fund/new-fund', fund)
        .then(res => {
          if (res.data.code === 'I001') {
            this.setState({
              isButtonDisabled: false,
              isOpenAddFundForm: false,
              snackerBarStatus: true,
              snackbarType: 'success',
              snackbarMessage: 'Tạo nhật ký thành công',
            })
            this.getFundData(this.state.selectedMonths, this.state.selectedFundType);
            return axios.post(firebaseKey.endpoint, firebaseNotification, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${firebaseKey.serverKey}`
              }
            }).then(res => { })
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
  }

  editFund = (fundData) => {
    this.setState({ isButtonDisabled: true, isLoading: true })
    const fundInformation = {
      'date': fundData.date,
      'title': fundData.title,
      'price': fundData.price
    }
    let firebaseNotification;
    switch (this.state.selectedFundType) {
      case 'QTN':
        firebaseNotification = this.buildFireBaseNotification(
          'Quỹ Thiếu Nhi',
          `${localStorage.getItem('username')} vừa cập nhật nhật ký quỹ Thiếu Nhi`,
          moment().format('DD/MM/YYYY hh:mm:ss'),
          'Edit'
        )
        return axios.put(`/backend/children-fund/update/${fundData._id}`, fundInformation)
          .then(res => {
            if (res.data.code === 'I001') {
              this.setState({
                isButtonDisabled: false,
                isOpenAddFundForm: false,
                snackerBarStatus: true,
                snackbarType: 'success',
                snackbarMessage: 'Cập nhật thành công',
              })
              this.getFundData(this.state.selectedMonths, this.state.selectedFundType);
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
          })
      case 'QR':
        firebaseNotification = this.buildFireBaseNotification(
          'Quỹ Nội Bộ',
          `${localStorage.getItem('username')} vừa cập nhật nhật ký quỹ Nội Bộ`,
          moment().format('DD/MM/YYYY hh:mm:ss'),
          'Edit'
        )
        return axios.put(`/backend/internal-fund/update/${fundData._id}`, fundInformation)
          .then(res => {
            if (res.data.code === 'I001') {
              this.setState({
                isButtonDisabled: false,
                isOpenAddFundForm: false,
                snackerBarStatus: true,
                snackbarType: 'success',
                snackbarMessage: 'Cập nhật thành công',
              })
              this.getFundData(this.state.selectedMonths, this.state.selectedFundType);
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
          })
      default:
        return null
    }
  }

  createNewEvent = (event) => {
    this.setState({ isButtonDisabled: true, isLoading: true })
    const firebaseNotification = this.buildFireBaseNotification(
      'Sự kiện',
      `${localStorage.getItem('username')} vừa tạo sự kiện mới`,
      moment().format('DD/MM/YYYY hh:mm:ss'),
      'Event'
    )

    return axios
      .post('/backend/event/new-event', event)
      .then(res => {
        if (res.data.code === 'I001') {
          this.setState({
            isButtonDisabled: false,
            isOpenAddEventForm: false,
          })
          this.getEventData();
          return axios.post(firebaseKey.endpoint, firebaseNotification, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `key=${firebaseKey.serverKey}`
            }
          }).then(res => { })
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

  editEvent = (eventData) => {
    this.setState({ isButtonDisabled: true, isLoading: true })
    const eventInformation = {
      'date': eventData.date,
      'content': eventData.content
    }

    const firebaseNotification = this.buildFireBaseNotification(
      'Sự kiện',
      `${localStorage.getItem('username')} vừa chỉnh sửa sự kiện`,
      moment().format('DD/MM/YYYY hh:mm:ss'),
      'Edit'
    )

    return axios.put(`/backend/event/update/${eventData._id}`, eventInformation)
      .then(res => {
        if (res.data.code === 'I001') {
          this.setState({
            isButtonDisabled: false,
            isOpenAddEventForm: false,
          })
          this.getEventData();
          return axios.post(firebaseKey.endpoint, firebaseNotification, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `key=${firebaseKey.serverKey}`
            }
          }).then(res => { })
        }
      })
      .catch(err => {
        this.setState({
          snackerBarStatus: true,
          snackbarType: 'error',
          snackbarMessage: 'Đã có lỗi khi chỉnh sửa sự kiện',
          isButtonDisabled: false
        })
      })
  }

  createDocument = (e) => {
    const extFiles = this.state.fileType.split(',')
    if (extFiles.indexOf(`.${e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1]}`) > -1) {
      const data = new FormData();
      data.append('date', moment().format('YYYY-MM-DD hh:mm:ss'))
      data.append('username', localStorage.getItem('username'))
      data.append('file', e.target.files[0])

      const firebaseNotification = this.buildFireBaseNotification(
        'Tài liệu',
        `${localStorage.getItem('username')} vừa tải lên tập tin ${e.target.files[0].name}`,
        moment().format('DD/MM/YYYY hh:mm:ss'),
        'Description'
      )

      return axios.post('/backend/document/create', data)
        .then(res => {
          if (res.data.code === "I001") {
            this.getDocumentData()
            this.setState({
              snackerBarStatus: true,
              snackbarType: 'success',
              snackbarMessage: 'Tải lên thành công',
            })
          }
          return axios.post(firebaseKey.endpoint, firebaseNotification, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `key=${firebaseKey.serverKey}`
            }
          }).then(res => { })
        })
        .catch(err => {
          if (err.response.status === 409) {
            this.setState({
              snackerBarStatus: true,
              snackbarType: 'error',
              snackbarMessage: 'File đã có sẵn trên máy chủ, vui lòng đổi tên file nếu đó là bản cập nhật',
              isButtonDisabled: false,
              isLoading: false,
            })
          }
          else {
            console.log(err)
            this.setState({
              snackerBarStatus: true,
              snackbarType: 'error',
              snackbarMessage: 'Đã có lỗi từ máy chủ',
              isButtonDisabled: false,
              isLoading: false,
            })
          }
        })
    }
    else {
      this.setState({
        snackerBarStatus: true,
        snackbarType: 'error',
        snackbarMessage: 'File không được hỗ trợ trên máy chủ',
        isButtonDisabled: false,
        isLoading: false,
      })
    }
  }

  renameDocument = () => {
    const documentDetail = {
      'filename': this.state.documentName,
      'modifiedDate': moment().format('YYYY-MM-DD hh:mm:ss')
    }

    const firebaseNotification = this.buildFireBaseNotification(
      'Tài liệu',
      `${localStorage.getItem('username')} vừa đổi tên tập tin ${this.state.oldDocumentName} thành ${this.state.documentName}`,
      moment().format('DD/MM/YYYY hh:mm:ss'),
      'Edit'
    )

    return axios.put(`/backend/document/rename/${this.state.selectedDocumentId}`, documentDetail)
      .then(res => {
        if (res.data.code === 'I001') {
          this.setState({
            snackerBarStatus: true,
            snackbarType: 'success',
            snackbarMessage: 'Tài liệu đã được đổi tên',
            isOpenExpansionPanel: false,
            isRename: false,
            selectedDocumentId: ''
          })
          this.getDocumentData();
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
          snackerBarStatus: true,
          snackbarType: 'error',
          snackbarMessage: 'Đã có lỗi từ máy chủ',
          isButtonDisabled: false,
          isLoading: false,
        })
      })
  }

  callbackClassTable = (callback) => {
    this.setState({
      isOpenAddClassForm: callback
    })
  }

  callbackFundTable = (callback) => {
    this.setState({
      isOpenAddFundForm: callback
    })
  }

  callbackEventTable = (callback) => {
    this.setState({
      isOpenAddEventForm: callback
    })
  }

  callbackSnackerBarHanlder = (callback) => {
    this.setState({ snackerBarStatus: callback });
  }

  handleUploadClick = () => {
    document.getElementById('filePicker2').click();
  }

  handleChangeValue = (e, type) => {
    const result = {};
    let data = e.target.value;
    result[type] = data;
    this.setState(result);
    this.getFundData(this.state.selectedMonths, data)
  }

  handleChangeMonth = (e, type) => {
    let result = {};
    result[type] = e.target.value;
    this.setState(result)
    this.getFundData(e.target.value, this.state.selectedFundType)
  }

  handleChangePieChart = (e, type) => {
    let result = {};
    result[type] = e.target.value;
    this.setState(result)
    this.getClassData(e.target.value)
  }

  handleChangeCalendarView = (number) => {
    this.setState({ monthCount: this.state.monthCount + number })
  }

  render = () => {
    const { classes } = this.props;

    return (
      <div style={(this.state.innerWidth < 700) ? { padding: 0 } : { padding: '1em' }}>
        <Grid container className={classes.container} spacing={3} >
          <Grid item xs={12} md={6} lg={6} xl={3}>
            <Report
              icon={<Face className={classes.icon} />}
              children={
                <div>
                  <Typography variant='subtitle2' style={{
                    textAlign: 'right'
                  }}>Thiếu Nhi</Typography>
                  <Typography variant='h4' style={{
                    textAlign: 'right'
                  }}><AnimatedNumber
                      value={this.state.childrenTotalCount}
                      duration={this.state.duration}
                      formatValue={value => this.formatValue(value, 'em')} />
                  </Typography>
                  <Divider />
                  <Typography variant='body1' style={{
                    textAlign: 'left',
                    paddingTop: '1em'
                  }}><Update style={{ fontSize: '18px', marginRight: '2px' }} />{'Cập nhật: ' + this.state.currentTime}</Typography>
                </div>
              }
              style={{
                background: 'linear-gradient(to bottom right, #7986cb, #3f51b5)',
                width: '6em',
                height: '6em',
                marginBottom: '-4em',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={3}>
            <Report
              icon={<Group className={classes.icon} />}
              children={
                <div>
                  <Typography variant='subtitle2' style={{
                    textAlign: 'right'
                  }}>HT/GLV</Typography>
                  <Typography variant='h4' style={{
                    textAlign: 'right'
                  }}><AnimatedNumber
                      value={this.state.userTotalCount}
                      duration={this.state.duration}
                      formatValue={value => this.formatValue(value, 'a/c')} />
                  </Typography>
                  <Divider />
                  <Typography variant='body1' style={{
                    textAlign: 'left',
                    paddingTop: '1em'
                  }}><Update style={{ fontSize: '18px', marginRight: '2px' }} />{'Cập nhật: ' + this.state.currentTime}</Typography>
                </div>
              }
              style={{
                background: 'linear-gradient(to bottom right, #f06292, #e91e63)',
                width: '6em',
                height: '6em',
                marginBottom: '-4em',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={3}>
            <Report
              icon={<AttachMoney className={classes.icon} />}
              children={
                <div>
                  <Typography variant='subtitle2' style={{
                    textAlign: 'right'
                  }}>Quỹ Thiếu Nhi</Typography>
                  <Typography variant='h4' style={{
                    textAlign: 'right'
                  }}><AnimatedNumber
                      value={this.state.childrenFundTotalCount}
                      duration={this.state.duration}
                      formatValue={value => this.formatValue(value, 'đ')} />
                  </Typography>
                  <Divider />
                  <Typography variant='body1' style={{
                    textAlign: 'left',
                    paddingTop: '1em'
                  }}>{(this.state.fundDifference >= 0) ?
                    <ArrowUpward style={{ color: 'green', fontSize: '18px' }} /> :
                    <ArrowDownward style={{ color: 'red', fontSize: '18px' }} />}
                    {(Math.abs(Number(this.state.fundDifference)) > 0 && Math.abs(Number(this.state.fundDifference)) < 1) ?
                      Math.abs(Number(this.state.fundDifference).toFixed(1)) + 'ng ' : Math.abs(Number(this.state.fundDifference).toFixed(1)) + 'tr '}
                    so với tháng trước</Typography>
                </div>
              }
              style={{
                background: 'linear-gradient(to bottom right, #81c784, #4caf50)',
                width: '6em',
                height: '6em',
                marginBottom: '-4em',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={3}>
            <Report
              icon={<AttachMoney className={classes.icon} />}
              children={
                <div>
                  <Typography variant='subtitle2' style={{
                    textAlign: 'right'
                  }}>Quỹ nội bộ</Typography>
                  <Typography variant='h4' style={{
                    textAlign: 'right'
                  }}><AnimatedNumber
                      value={this.state.internalFundTotalCount}
                      duration={this.state.duration}
                      formatValue={value => this.formatValue(value, 'đ')} />
                  </Typography>
                  <Divider />
                  <Typography variant='body1' style={{
                    textAlign: 'left',
                    paddingTop: '1em'
                  }}>{(this.state.internalFundDifferences >= 0) ?
                    <ArrowUpward style={{ color: 'green', fontSize: '18px' }} /> :
                    <ArrowDownward style={{ color: 'red', fontSize: '18px' }} />}
                    {(Math.abs(Number(this.state.internalFundDifferences)) > 0 && Math.abs(Number(this.state.internalFundDifferences)) < 1) ?
                      Math.abs(Number(this.state.internalFundDifferences).toFixed(1)) + 'ng ' : Math.abs(Number(this.state.internalFundDifferences).toFixed(1)) + 'tr '}
                    so với tháng trước</Typography>
                </div>
              }
              style={{
                background: 'linear-gradient(to bottom right, #ffab91, #ff5722)',
                width: '6em',
                height: '6em',
                marginBottom: '-4em',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={8}>
            <Report
              icon={<ShowChart className={classes.icon} />}
              style={{
                background: 'linear-gradient(to bottom right, #ffcc80, #ff9800)',
                width: '6em',
                height: '6em',
                marginBottom: '-4em',
              }}
              children={
                <div style={(this.state.innerWidth <= 840) ? { height: '37em' } : { height: '35em' }}>
                  <Toolbar disableGutters={true}>
                    <div style={{ flex: 1, marginLeft: '6em' }} />
                    <div>
                      <Typography variant="h5" style={{ textAlign: 'right' }}>Quỹ</Typography>
                      <Typography variant="subtitle2" style={{ textAlign: 'right' }}>{`Biểu đồ thể hiện tình hình quỹ ${this.state.selectedMonths} tháng gần nhất`}</Typography>
                    </div>
                  </Toolbar>
                  <Divider />
                  <div style={{ height: '28em' }}>
                    <Toolbar disableGutters>
                      <div>
                        <Typography variant="subtitle1"><div className={classes.circleStyle} style={{ backgroundColor: '#4caf50' }} />Quỹ Thiếu Nhi</Typography>
                        <Typography variant="subtitle1"><div className={classes.circleStyle} style={{ backgroundColor: '#ff5722' }} />Quỹ Nội bộ</Typography>
                      </div>
                      <div style={{ flex: 1 }} />
                      <div>
                        <Typography variant='subtitle1'>Hiển thị: </Typography>
                        <Select
                          value={this.state.selectedMonths}
                          onChange={(e) => this.handleChangeMonth(e, 'selectedMonths')}
                          input={<InputBase />}
                          style={{ justifyContent: 'right' }}>
                          <MenuItem value={6}>6 tháng</MenuItem>
                          <MenuItem value={9}>9 tháng</MenuItem>
                          <MenuItem value={12}>12 tháng</MenuItem>
                        </Select>
                      </div>
                    </Toolbar>
                    <canvas id='childrenFund' />
                  </div>
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <Report
              icon={<InfoOutlined className={classes.icon} />}
              style={{
                background: 'linear-gradient(to bottom right, #ffcc80, #ff9800)',
                marginBottom: '-4em',
                height: '6em',
                width: '6em',
              }}
              children={
                <div style={(this.state.innerWidth < 500) ? { height: 'auto' } : { height: '15em' }}>
                  <Toolbar disableGutters={true}>
                    <div style={{ flex: 1, marginLeft: '6em' }} />
                    <div>
                      <Typography variant="h5" style={{ textAlign: 'right' }}>{`Quỹ năm ${moment().subtract(1, 'years').format('YYYY')}`}</Typography>
                      <Typography variant="subtitle2" style={{ textAlign: 'right' }}>Tổng kết sơ bộ</Typography>
                    </div>
                  </Toolbar>
                  <Divider />
                  <div style={{ marginTop: '2em' }}>
                    {(this.state.selectedFundType === 'QTN') ?
                      (
                        <React.Fragment>
                          <Typography variant="body2">{`Tổng thu: ${this.priceFormat(this.state.totalImport)}`}</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(this.state.totalImport / (this.state.childrenFundTotalCount)) * 100}
                            classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }}
                            style={{ height: 12, marginBottom: '1em' }} />
                          <Typography variant="body2">{`Tổng chi: ${this.priceFormat(this.state.totalExport)}`}</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(Math.abs(this.state.totalExport) / (this.state.childrenFundTotalCount)) * 100}
                            classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }}
                            style={{ height: 12, marginBottom: '1em' }} />
                          <Typography variant="body2">{`Tồn: ${this.priceFormat(this.state.subtractChildrenFund)}`}</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(this.state.subtractChildrenFund / (this.state.childrenFundTotalCount)) * 100}
                            classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }}
                            style={{ height: 12, marginBottom: '1em' }} />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <Typography variant="body2">{`Tổng thu: ${this.priceFormat(this.state.totalInternalImport)}`}</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(this.state.totalInternalImport / (this.state.childrenFundTotalCount)) * 100}
                            classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }}
                            style={{ height: 10 }} />
                          <Typography variant="body2">{`Tổng chi: ${this.priceFormat(this.state.totalInternalExport)}`}</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(Math.abs(this.state.totalInternalExport) / (this.state.childrenFundTotalCount)) * 100}
                            classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }}
                            style={{ height: 10 }} />
                          <Typography variant="body2">{`Tồn: ${this.priceFormat(this.state.subtractInternalFund)}`}</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(this.state.subtractInternalFund / (this.state.childrenFundTotalCount)) * 100}
                            classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }}
                            style={{ height: 10 }} />
                        </React.Fragment>
                      )}
                  </div>
                </div>
              }
            />
            <Report
              icon={
                <div align='center'>
                  <Today className={classes.icon} style={{ marginTop: '1em' }} />
                  <Typography variant='subtitle1' style={{ color: 'white', marginTop: '-1em' }}>{this.state.currentTimeInMonthFormat}</Typography>
                </div>
              }
              style={{
                marginTop: '2em',
                background: 'linear-gradient(to bottom right, #ce93d8, #9c27b0)',
                height: '6em',
                width: '6em',
                marginBottom: '-4em',
              }}
              children={
                <div style={(this.state.innerWidth < 500) ? { height: 'auto' } : { height: '14em' }}>
                  <Toolbar disableGutters={true}>
                    <Tooltip title='Tháng trước'>
                      <IconButton size='small' style={{ marginLeft: '6em' }} onClick={() => this.handleChangeCalendarView(1)}><KeyboardArrowLeft /></IconButton>
                    </Tooltip>
                    <Tooltip title='Tháng sau'>
                      <IconButton size='small' onClick={() => this.handleChangeCalendarView(-1)}><KeyboardArrowRight /></IconButton>
                    </Tooltip>
                    <div style={{ flex: 1 }} />
                    <div>
                      <Typography variant="h5" style={{ textAlign: 'right' }}>{this.state.currentDisplayTime}</Typography>
                      <Typography variant="subtitle2" style={{ textAlign: 'right' }}>{this.state.currentDisplayDate}</Typography>
                    </div>
                  </Toolbar>
                  <Divider />
                  <Table padding='none' style={{ marginRight: '1em' }}>
                    <TableHead>
                      <TableRow>
                        {this.state.weekdayShort.map(day => {
                          return (
                            <TableCell
                              style={{
                                color: 'white',
                                backgroundColor: '#9c27b0',
                                fontSize: 11,
                                textAlign: 'center'
                              }}
                              key={day}>{day}</TableCell>)
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>{this.state.calendarContent}</TableBody>
                  </Table>
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Report
              icon={<InfoOutlined className={classes.icon} />}
              style={{
                background: 'linear-gradient(to bottom right, #ffcc80, #ff9800)',
                marginBottom: '-4em',
                height: '6em',
                width: '6em'
              }}
              children={
                <div style={(this.state.innerWidth < 500) ? { height: 'auto' } : { height: '25em' }}>
                  <Toolbar disableGutters={true}>
                    <Select
                      value={this.state.selectedFundType}
                      onChange={(e) => this.handleChangeValue(e, 'selectedFundType')}
                      input={<InputBase />}
                      style={{ marginLeft: '6em' }}>
                      <MenuItem value='QTN'>Quỹ TN</MenuItem>
                      <MenuItem value='QR'>Quỹ nội bộ</MenuItem>
                    </Select>
                    <div style={{ flex: 1 }} />
                    <div>
                      <Typography variant="h5" style={{ textAlign: 'right' }}>Quỹ</Typography>
                      <Typography variant="subtitle2" style={{ textAlign: 'right' }}>Nhật ký</Typography>
                    </div>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton onClick={(e) => { this.setState({ isOpenFundActionMenu: e.target }) }} >
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={this.state.isOpenFundActionMenu}
                      open={Boolean(this.state.isOpenFundActionMenu)}
                      onClose={() => { this.setState({ isOpenFundActionMenu: null }) }}
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
                        disabled={(this.state.currentUserPosition !== 'Admin') ? true : false}
                        onClick={() => {
                          this.setState({
                            isOpenAddFundForm: true,
                            typeofDialog: 'fund',
                            typeofAction: 'create',
                            isOpenFundActionMenu: null
                          })
                        }}>
                        <ListItemIcon><Add /></ListItemIcon>
                        <ListItemText primary="Tạo mới" />
                      </MenuItem>
                    </Menu>
                  </Toolbar>
                  <Divider />
                  <div style={{ marginTop: '1em', overflow: 'auto' }}>
                    <MaterialTable
                      icons={tableIcons}
                      columns={this.state.childrenFundColumns}
                      data={this.state.childrenFunds}
                      options={{
                        paging: false,
                        sorting: false,
                        headerStyle: {
                          position: 'sticky',
                          top: 0,
                          color: '#ff9800',
                          fontSize: 15
                        },
                        search: false,
                        maxBodyHeight: '18em',
                        minBodyHeight: '18em',
                        showTitle: false,
                        toolbar: false,
                      }}
                      localization={{
                        body: {
                          emptyDataSourceMessage: 'Không có dữ liệu!'
                        },
                        header: {
                          actions: ''
                        }
                      }}
                      actions={[
                        {
                          icon: () => { return <Edit style={{ color: '#ff9800' }} /> },
                          tooltip: 'Chỉnh sửa',
                          hidden: this.state.currentUserPosition !== 'Admin'? true :false,
                          onClick: (e, rowData) => {
                            this.setState({
                              isOpenAddFundForm: true,
                              typeofDialog: 'fund',
                              typeofAction: 'edit',
                              dialogContent: rowData,
                            })
                          }
                        },
                        {
                          icon: () => { return <Clear style={{ color: 'red' }} /> },
                          tooltip: 'Xóa',
                          hidden: this.state.currentUserPosition !== 'Admin'? true :false,
                          onClick: (e, rowData) => {
                            switch (this.state.selectedFundType) {
                              case 'QTN':
                                return axios.delete(`/backend/children-fund/delete/${rowData._id}`)
                                  .then(res => {
                                    if (res.data.code === 'I001') {
                                      this.getFundData(this.state.selectedMonths, this.state.selectedFundType)
                                    }
                                  })
                                  .catch(err => {
                                    this.setState({
                                      snackerBarStatus: true,
                                      snackbarType: 'error',
                                      snackbarMessage: 'Đã có lỗi từ máy chủ. Không thể xóa!',
                                    })
                                  })
                              case 'QR':
                                return axios.delete(`/backend/internal-fund/delete/${rowData._id}`)
                                  .then(res => {
                                    if (res.data.code === 'I001') {
                                      this.getFundData(this.state.selectedMonths, this.state.selectedFundType)
                                    }
                                  })
                                  .catch(err => {
                                    this.setState({
                                      snackerBarStatus: true,
                                      snackbarType: 'error',
                                      snackbarMessage: 'Đã có lỗi từ máy chủ. Không thể xóa!',
                                    })
                                  })
                              default:
                                return null
                            }
                          }
                        }
                      ]}
                    />
                    <DialogForm
                      open={this.state.isOpenAddFundForm}
                      dialogType={this.state.typeofDialog}
                      dialogAction={this.state.typeofAction}
                      dialogContent={this.state.dialogContent}
                      callback={this.callbackFundTable}
                      func={this.createNewFund}
                      editFunc={this.editFund}
                      disabled={this.state.isButtonDisabled}
                      resetSelectedRow={(callback) => this.setState({ dialogContent: callback })}
                      style={{ color: '#ff9800' }} />
                  </div>
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Report
              icon={<EventAvailable className={classes.icon} />}
              style={{
                background: 'linear-gradient(to bottom right, #ce93d8, #9c27b0)',
                height: '6em',
                width: '6em',
                marginBottom: '-4em',
              }}
              children={
                <div style={(this.state.innerWidth < 500) ? { height: 'auto' } : { height: '25em' }}>
                  <Toolbar disableGutters={true}>
                    <div style={{ flex: 1, marginLeft: '6em' }} />
                    <div>
                      <Typography variant="h5" style={{ textAlign: 'right' }}>Sự kiện</Typography>
                      <Typography variant="subtitle2" style={{ textAlign: 'right' }}>Từ Xứ Đoàn</Typography>
                    </div>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton onClick={(e) => { this.setState({ isOpenEventActionMenu: e.target }) }} >
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={this.state.isOpenEventActionMenu}
                      open={Boolean(this.state.isOpenEventActionMenu)}
                      onClose={() => { this.setState({ isOpenEventActionMenu: null }) }}
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
                        disabled={(this.state.currentUserPosition === 'Guest') ? true : false}
                        onClick={() => {
                          this.setState({
                            isOpenAddEventForm: true,
                            typeofDialog: 'event',
                            typeofAction: 'create',
                            isOpenEventActionMenu: null
                          })
                        }}>
                        <ListItemIcon><Add /></ListItemIcon>
                        <ListItemText primary="Tạo mới sự kiện" />
                      </MenuItem>
                      <MenuItem
                        disabled={(this.state.currentUserPosition !== 'Admin') ? true : false}
                        onClick={() => {
                          return axios.delete('/backend/event/delete-checked')
                            .then(res => {
                              if (res.data.code === 'I001') {
                                this.setState({
                                  isOpenEventActionMenu: null,
                                })
                                this.getEventData();
                              }
                            })
                            .catch(err => {
                              console.log(err)
                              this.setState({
                                isOpenEventActionMenu: null,
                                snackerBarStatus: true,
                                snackbarType: 'error',
                                snackbarMessage: 'Đã có lỗi từ máy chủ',
                                isButtonDisabled: false,
                                isLoading: false,
                              })
                            })
                        }}
                      >
                        <ListItemIcon><Delete /></ListItemIcon>
                        <ListItemText primary="Xóa sự kiện hoàn thành" />
                      </MenuItem>
                    </Menu>
                  </Toolbar>
                  <Divider />
                  <div style={{ marginTop: '1em', overflow: 'auto' }}>
                    <MuiThemeProvider theme={customColor}>
                      <MaterialTable
                        icons={tableIcons}
                        data={this.state.events}
                        columns={[
                          {
                            title: 'Ngày',
                            field: 'date',
                          },
                          {
                            title: 'Nội dung',
                            field: 'content',
                            cellStyle: { minWidth: 220 }
                          }
                        ]}
                        options={{
                          paging: false,
                          sorting: false,
                          grouping: false,
                          headerStyle: {
                            position: 'sticky',
                            top: 0,
                            color: '#9c27b0',
                            fontSize: 15
                          },
                          search: false,
                          maxBodyHeight: '18em',
                          minBodyHeight: '18em',
                          showTitle: false,
                          toolbar: false,
                          header: false,
                          selection: true,
                          selectionProps: rowData => ({
                            checked: rowData.isChecked,
                            color: 'primary'
                          }),
                          rowStyle: rowData => ({
                            backgroundColor: rowData.isChecked ? lighten('#9c27b0', 0.8) : ''
                          })
                        }}
                        onSelectionChange={(row, rowData) => {
                          return axios.post(`/backend/event/set-confirmed/${rowData._id}`, { 'isChecked': !rowData.isChecked })
                            .then(res => {
                              if (res.data.code === 'I001') {
                                this.getEventData();
                              }
                            })
                            .catch(err => {
                              console.log(err)
                              this.setState({
                                snackerBarStatus: true,
                                snackbarType: 'error',
                                snackbarMessage: 'Đã có lỗi từ máy chủ',
                                isButtonDisabled: false,
                                isLoading: false,
                              })
                            })
                        }}
                        localization={{
                          body: {
                            emptyDataSourceMessage: 'Không có dữ liệu!'
                          },
                          header: {
                            actions: 'Hoàn thành'
                          }
                        }}
                        actions={[
                          {
                            icon: () => { return <Edit style={{ color: '#9c27b0' }} /> },
                            tooltip: 'Chỉnh sửa',
                            hidden: (this.state.currentUserPosition === 'Guest')? true : false,
                            position: 'row',
                            onClick: (e, rowData) => {
                              this.setState({
                                isOpenAddEventForm: true,
                                typeofDialog: 'event',
                                typeofAction: 'edit',
                                dialogContent: rowData
                              })
                            }
                          },
                        ]}
                      />
                    </MuiThemeProvider>
                    <DialogForm
                      open={this.state.isOpenAddEventForm}
                      dialogType={this.state.typeofDialog}
                      dialogAction={this.state.typeofAction}
                      dialogContent={this.state.dialogContent}
                      callback={this.callbackEventTable}
                      func={this.createNewEvent}
                      editFunc={this.editEvent}
                      disabled={this.state.isButtonDisabled}
                      resetSelectedRow={(callback) => this.setState({ dialogContent: callback })}
                      style={{ color: '#9c27b0' }} />
                  </div>
                </div>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Report
              icon={<Description className={classes.icon} />}
              style={{
                background: 'linear-gradient(to bottom right, #f48fb1, #e91e63)',
                height: '6em',
                width: '6em',
                marginBottom: '-4em',
              }}
              children={
                <div style={(this.state.innerWidth <= 840) ? { height: 'auto' } : { height: '38em' }}>
                  <Toolbar disableGutters>
                    <div style={{ flex: 1, marginLeft: '6em' }} />
                    <div>
                      <Typography variant="h5" style={{ textAlign: 'right' }}>Tài liệu Xứ đoàn</Typography>
                      <Typography variant="subtitle2" style={{ textAlign: 'right' }}>Lưu trữ các tài liệu chi tiết</Typography>
                    </div>
                    <Tooltip title="Mở rộng">
                      <IconButton onClick={(e) => { this.setState({ isOpenDocumentActionMenu: e.target }) }} >
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={this.state.isOpenDocumentActionMenu}
                      open={Boolean(this.state.isOpenDocumentActionMenu)}
                      onClose={() => { this.setState({ isOpenDocumentActionMenu: null }) }}
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
                        disabled={(this.state.currentUserPosition === 'Guest') ? true : false}
                        onClick={() => {
                          this.setState({
                            isOpenDocumentActionMenu: null
                          })
                          this.handleUploadClick()
                        }}>
                        <ListItemIcon><Publish /></ListItemIcon>
                        <ListItemText primary="Upload tài liệu" />
                      </MenuItem>
                    </Menu>
                  </Toolbar>
                  <Divider />
                  <div id='drawer-container' style={{ marginTop: '1em', overflowY: 'auto', overflowX: 'hidden', position: 'relative', height: this.state.innerWidth <= 840 ? 'auto' : '33em' }}>
                    {(this.state.documents.length === 0) ?
                      (
                        <div align='center'>
                          <Typography variant='subtitle1'>Hiện không có dữ liệu</Typography>
                        </div>
                      ) :
                      (
                        <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
                          {this.state.documents.map(doc => (
                            <Grid item xs={6} sm={4} md={3} lg={2} key={doc._id}>
                              <div align='center'>
                                <div>
                                  <IconButton onClick={() => {
                                    this.setState({
                                      isOpenExpansionPanel: true,
                                      selectedDocumentId: doc._id
                                    })
                                  }}>
                                    {(doc.filename.includes('.xlsx') || doc.filename.includes('.xls')) ?
                                      (<Icon className={classes.documentIconTile}>
                                        <img src={googleSheets} alt='' />
                                      </Icon>) :
                                      ((doc.filename.includes('.docx') || doc.filename.includes('.doc')) ?
                                        (<Icon className={classes.documentIconTile}>
                                          <img src={googleDocs} alt='' />
                                        </Icon>) :
                                        ((doc.filename.includes('.pptx') || doc.filename.includes('.ppt')) ?
                                          (<Icon className={classes.documentIconTile}>
                                            <img src={googleSlides} alt='' />
                                          </Icon>) :
                                          ((doc.filename.includes('.pdf')) ?
                                            (<Icon className={classes.documentIconTile}>
                                              <img src={googlePdf} alt='' />
                                            </Icon>) :
                                            (<Description className={classes.documentIconTile} style={{ color: 'grey' }} />))))
                                    }
                                  </IconButton>
                                </div>
                                <div>
                                  <Chip
                                    label={doc.filename}
                                    key={doc._id} size='small'
                                    style={{ display: 'flex' }} />
                                </div>
                              </div>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    <Drawer
                      open={this.state.isOpenExpansionPanel}
                      anchor='left'
                      variant='temporary'
                      PaperProps={{ style: { position: 'absolute' } }}
                      BackdropProps={{ style: { position: 'absolute' } }}
                      ModalProps={{
                        container: document.getElementById('drawer-container'),
                        style: { position: 'absolute', overflow: 'hidden' }
                      }}
                      onClose={() => this.setState({ isOpenExpansionPanel: false, selectedDocumentId: '', isRename: false })} >
                      <div align='center' style={{ margin: '1em' }}>
                        <div>
                          {(this.state.documentName.includes('.xlsx') || this.state.documentName.includes('.xls')) ?
                            (<Icon className={classes.documentIconTile}>
                              <img src={googleSheets} alt='' />
                            </Icon>) :
                            ((this.state.documentName.includes('.docx') || this.state.documentName.includes('.doc')) ?
                              (<Icon className={classes.documentIconTile}>
                                <img src={googleDocs} alt='' />
                              </Icon>) :
                              ((this.state.documentName.includes('.pptx') || this.state.documentName.includes('.ppt')) ?
                                (<Icon className={classes.documentIconTile}>
                                  <img src={googleSlides} alt='' />
                                </Icon>) :
                                ((this.state.documentName.includes('.pdf')) ?
                                  (<Icon className={classes.documentIconTile}>
                                    <img src={googlePdf} alt='' />
                                  </Icon>) :
                                  (<Description className={classes.documentIconTile} style={{ color: 'grey' }} />))))
                          }
                        </div>
                        <div>
                          <TextField
                            className={classes.customInput}
                            margin='normal'
                            label='Tên'
                            size='small'
                            autoFocus={(this.state.isRename) ? true : false}
                            disabled={(this.state.isRename) ? false : true}
                            value={this.state.documentName}
                            onChange={(e) => {
                              this.setState({
                                documentName: e.target.value,
                              })
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  <Title style={{ color: 'black' }} />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                (this.state.isRename) ?
                                  (
                                    <InputAdornment posision='end'>
                                      <Tooltip title='Xác nhận'>
                                        <IconButton onClick={this.renameDocument}>
                                          <Check style={{ color: 'green' }} />
                                        </IconButton>
                                      </Tooltip>
                                    </InputAdornment>
                                  ) : null
                              ),
                              disableUnderline: (this.state.isRename) ? false : true
                            }} />
                        </div>
                        <div>
                          <TextField
                            className={classes.customInput}
                            margin='normal'
                            label='Ngày đăng tải'
                            size='small'
                            disabled
                            value={this.state.documentDate}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  <DateRange style={{ color: 'black' }} />
                                </InputAdornment>
                              ),
                              disableUnderline: true
                            }} />
                        </div>
                        <div>
                          <TextField
                            className={classes.customInput}
                            margin='normal'
                            label='Chỉnh sửa lần cuối'
                            size='small'
                            disabled
                            value={this.state.documentModifiedDate}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  <EventAvailable style={{ color: 'black' }} />
                                </InputAdornment>
                              ),
                              disableUnderline: true
                            }} />
                        </div>
                        <div>
                          <TextField
                            className={classes.customInput}
                            margin='normal'
                            label='Chủ sở hữu'
                            size='small'
                            disabled
                            value={this.state.documentUser}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  <Person style={{ color: 'black' }} />
                                </InputAdornment>
                              ),
                              disableUnderline: true
                            }} />
                        </div>
                        <div>
                          <TextField
                            className={classes.customInput}
                            margin='normal'
                            label='Kích thước'
                            size='small'
                            disabled
                            value={`${this.formatFileSize(Number(this.state.documentSize))} (${this.state.documentSize} B)`}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  <Speed style={{ color: 'black' }} />
                                </InputAdornment>
                              ),
                              disableUnderline: true
                            }} />
                        </div>
                        <div style={{ flex: 1 }} />
                        <Toolbar disableGutters >
                          <div style={{ flex: 1 }} />
                          {(!this.state.isRename) ?
                            (
                              <Tooltip title='Đổi tên'>
                                <IconButton onClick={() => this.setState({ isRename: true, oldDocumentName: this.state.documentName })}
                                  disabled={this.state.documentUser !== localStorage.getItem('username')? true : false}>
                                  <Edit style={{ color: '#e91e63' }} />
                                </IconButton>
                              </Tooltip>
                            ) :
                            (
                              <Tooltip title='Hủy bỏ'>
                                <IconButton onClick={() => this.setState({ isRename: false })}>
                                  <Clear style={{ color: 'red' }} />
                                </IconButton>
                              </Tooltip>
                            )
                          }
                          <Tooltip title='Tải xuống'>
                            <IconButton onClick={() => {
                              return axios.get(`/backend/document/download/by-id/${this.state.selectedDocumentId}`, {
                                responseType: 'blob'
                              })
                                .then(res => {
                                  console.log(res)
                                  let data = new Blob([res.data], { type: `${res.headers['content-type']}` })
                                  let csvURL = window.URL.createObjectURL(data);
                                  let link = document.createElement('a');
                                  link.href = csvURL;
                                  link.setAttribute('download', this.state.documentName);
                                  link.click();
                                })
                                .then(() => {
                                  if (this._ismounted) {
                                    this.setState({
                                      isRename: false,
                                      selectedDocumentId: '',
                                      isOpenExpansionPanel: false
                                    })
                                  }
                                })
                                .catch(err => {
                                  console.log(err)
                                  this.setState({
                                    snackerBarStatus: true,
                                    snackbarType: 'error',
                                    snackbarMessage: 'Đã có lỗi trong quá trình tải xuống',
                                    isLoading: false,
                                  })
                                })
                            }}>
                              {(this.state.documentName.includes('.xlsx') || this.state.documentName.includes('.xls')) ?
                                (<GetApp style={{ color: 'green' }} />) :
                                ((this.state.documentName.includes('.docx') || this.state.documentName.includes('.doc')) ?
                                  (<GetApp style={{ color: 'blue' }} />) :
                                  ((this.state.documentName.includes('.pptx') || this.state.documentName.includes('.ppt')) ?
                                    (<GetApp style={{ color: 'orange' }} />) :
                                    ((this.state.documentName.includes('.pdf')) ?
                                      (<GetApp style={{ color: 'red' }} />) :
                                      (<GetApp style={{ color: 'black' }} />))))}

                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Xóa'>
                            <IconButton onClick={() => {
                              const firebaseNotification = this.buildFireBaseNotification(
                                'Tài liệu',
                                `${localStorage.getItem('username')} vừa xóa tập tin ${this.state.documentName}`,
                                moment().format('DD/MM/YYYY hh:mm:ss'),
                                'Delete'
                              )
                              return axios.delete(`/backend/document/delete-by-id/${this.state.selectedDocumentId}`)
                                .then(res => {
                                  if (res.data.code === 'I001') {
                                    this.getDocumentData();
                                    this.setState({
                                      snackerBarStatus: true,
                                      snackbarType: 'success',
                                      snackbarMessage: 'Xóa tài liệu thành công',
                                      isRename: false,
                                      selectedDocumentId: '',
                                      isOpenExpansionPanel: false
                                    })
                                  }
                                  return axios.post(firebaseKey.endpoint, firebaseNotification, {
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `key=${firebaseKey.serverKey}`
                                    }
                                  }).then(res => { })
                                })
                                .catch(err => {
                                  console.log(err)
                                  this.setState({
                                    snackerBarStatus: true,
                                    snackbarType: 'error',
                                    snackbarMessage: 'Đã có lỗi trong quá trình xóa tài liệu',
                                    isLoading: false,
                                  })
                                })
                            }}
                            disabled={this.state.documentUser !== localStorage.getItem('username')? true : false}>
                              <Delete style={{ color: 'red' }} />
                            </IconButton>
                          </Tooltip>
                          <div style={{ flex: 1 }} />
                        </Toolbar>
                      </div>
                    </Drawer>
                  </div>
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={8}>
            <Report
              icon={<Class className={classes.icon} />}
              style={{
                background: 'linear-gradient(to bottom right, #64b5f6, #2196f3)',
                marginBottom: '-4em',
                height: '6em',
                width: '6em'
              }}
              children={
                <div style={(this.state.innerWidth <= 840) ? { height: 'auto' } : { height: '35em' }}>
                  <Toolbar disableGutters>
                    <div style={{ flex: 1, marginLeft: '6em' }} />
                    <div>
                      <Typography variant="h5" style={{ textAlign: 'right' }}>Lớp</Typography>
                      <Typography variant="subtitle2" style={{ textAlign: 'right' }}>Danh sách lớp và biểu đồ số lượng Thiếu nhi từng lớp</Typography>
                    </div>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton onClick={(e) => { this.setState({ isOpenClassActionMenu: e.target }) }} >
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={this.state.isOpenClassActionMenu}
                      open={Boolean(this.state.isOpenClassActionMenu)}
                      onClose={() => { this.setState({ isOpenClassActionMenu: null }) }}
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
                        disabled={(localStorage.type !== 'Admin') ? true : false}
                        onClick={() => {
                          this.setState({
                            isOpenAddClassForm: true,
                            typeofDialog: 'class',
                            typeofAction: 'create',
                            isOpenClassActionMenu: null
                          })
                        }}>
                        <ListItemIcon><Add /></ListItemIcon>
                        <ListItemText primary="Tạo mới lớp" />
                      </MenuItem>
                    </Menu>
                  </Toolbar>
                  <Divider />
                  <Grid container spacing={2} style={{ marginTop: '1em' }}>
                    <Grid item xs={12} md={6} lg={7}>
                      <InputLabel shrink>Hiển thị biểu đồ theo</InputLabel>
                      <Select
                        value={this.state.selectedPieChartType}
                        onChange={(e) => this.handleChangePieChart(e, 'selectedPieChartType')}
                        input={<InputBase />}>
                        <MenuItem value='Lớp'>Lớp</MenuItem>
                        <MenuItem value='Khối'>Khối</MenuItem>
                      </Select>
                      <div style={{ height: '28em' }}>
                        <canvas id='chart' />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={5}>
                      <div style={{ overflow: 'auto' }}>
                        <MaterialTable
                          icons={tableIcons}
                          columns={this.state.classTableColumn}
                          data={this.state.classes}
                          options={{
                            paging: false,
                            sorting: false,
                            headerStyle: {
                              position: 'sticky',
                              top: 0,
                              color: '#2196f3',
                              fontSize: 15
                            },
                            search: false,
                            maxBodyHeight: '30em',
                            minBodyHeight: '30em',
                            showTitle: false,
                            toolbar: false,
                          }}
                          localization={{
                            header: {
                              actions: ''
                            },
                            body: {
                              emptyDataSourceMessage: 'Không có dữ liệu!'
                            },
                          }}
                          actions={[
                            {
                              icon: () => { return <Edit style={{ color: '#2196f3' }} /> },
                              tooltip: 'Chỉnh sửa',
                              onClick: (e, rowData) => {
                                this.setState({
                                  isOpenAddClassForm: true,
                                  typeofAction: 'edit',
                                  dialogContent: rowData,
                                  typeofDialog: 'class'
                                })
                              }
                            },
                            {
                              icon: () => { return <Clear style={{ color: 'red' }} /> },
                              tooltip: 'Xóa',
                              onClick: (e, rowData) => {
                                const firebaseNotification = this.buildFireBaseNotification(
                                  'Lớp',
                                  `${localStorage.getItem('username')} vừa xóa lớp ${rowData.Value}`,
                                  moment().format('DD/MM/YYYY hh:mm:ss'),
                                  'Delete'
                                )
                                return axios.delete(`/backend/class/delete/by-id/${rowData.ID}`)
                                  .then(res => {
                                    if (res.data.code === 'I001') {
                                      this.getClassData(this.state.selectedPieChartType);
                                    }
                                    return axios.post(firebaseKey.endpoint, firebaseNotification, {
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `key=${firebaseKey.serverKey}`
                                      }
                                    }).then(res => { })
                                  })
                                  .catch(err => {
                                    if (err.response.status === 404) {
                                      this.setState({
                                        snackerBarStatus: true,
                                        snackbarType: 'error',
                                        snackbarMessage: 'Lớp đã xóa hoặc không tồn tại trong CSDL',
                                        isButtonDisabled: false,
                                        isLoading: false,
                                      })
                                    }
                                    else {
                                      this.setState({
                                        snackerBarStatus: true,
                                        snackbarType: 'error',
                                        snackbarMessage: 'Đã có lỗi từ máy chủ',
                                        isButtonDisabled: false,
                                        isLoading: false,
                                      })
                                    }
                                  })
                              }
                            }
                          ]}
                        />
                        <DialogForm
                          open={this.state.isOpenAddClassForm}
                          dialogType={this.state.typeofDialog}
                          dialogAction={this.state.typeofAction}
                          dialogContent={this.state.dialogContent}
                          callback={this.callbackClassTable}
                          func={this.createNewClass}
                          editFunc={this.editClass}
                          disabled={this.state.isButtonDisabled}
                          resetSelectedRow={(callback) => this.setState({ dialogContent: callback })}
                          style={{ color: '#2196f3' }} />
                      </div>
                    </Grid>
                  </Grid>
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <Report
              icon={<GTranslate className={classes.icon} />}
              style={{
                background: 'linear-gradient(to bottom right, #4db6ac, #009688)',
                height: '6em',
                width: '6em',
                marginBottom: '-4em',
              }}
              children={
                <div style={(this.state.innerWidth <= 840) ? { height: 'auto' } : { height: '35em' }}>
                  <Toolbar disableGutters={true}>
                    <div style={{ flex: 1, marginLeft: '6em' }} />
                    <div>
                      <Typography variant="h5" style={{ textAlign: 'right' }}>English corner</Typography>
                      <Typography variant="subtitle2" style={{ textAlign: 'right' }}>Trau dồi kiến thức Anh Ngữ thông qua Tin Mừng hằng ngày</Typography>
                    </div>
                  </Toolbar>
                  <Divider />
                  <div style={{ marginTop: '1em', overflowX: 'auto', height: this.state.innerWidth <= 840 ? 'auto' : '30em' }} >
                    <Grid container spacing={2} style={{ margin: 0, width: '100%' }}>
                      <Grid item md lg />
                      <Grid item xs={12} md={4} lg={8}>
                        {(this.state.isTumblrLoading) ?
                          <Skeleton variant="rect" width='100%' height={240} /> :
                          <img
                            src={this.state.tumblrImageURL}
                            alt=''
                            className={classes.image}
                            onClick={() => window.open(`https://${this.state.tumblrImagePage}`, '_blank')} />}
                      </Grid>
                      <Grid item md lg />
                      <Grid item xs={12}>
                        {(this.state.isTumblrLoading) ?
                          (<div>
                            {new Array(Number(this.state.tumblrBodyHeight.replace('em', ''))).fill(0).map((data, i) => (
                              <Skeleton variant="text" height={15} key={i} />
                            ))}
                          </div>) :
                          <div
                            id='content'
                            dangerouslySetInnerHTML={{ __html: this.state.tumbleContent }} />}
                      </Grid>
                    </Grid>
                  </div>
                </div>
              }
            />
          </Grid>
        </Grid>
        <SnackDialog
          variant={this.state.snackbarType}
          message={this.state.snackbarMessage}
          className={this.state.snackbarType}
          callback={this.callbackSnackerBarHanlder}
          open={this.state.snackerBarStatus}
        />
        <input
          id="filePicker2"
          type="file"
          onChange={e => this.createDocument(e)}
          accept={this.state.fileType}
          style={{ 'display': 'none' }} />
      </div>
    )
  }
}

export default withStyles(useStyle)(General);