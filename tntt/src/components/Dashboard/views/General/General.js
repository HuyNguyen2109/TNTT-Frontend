import React from 'react';
import moment from 'moment';
import axios from 'axios';
import AnimatedNumber from 'animated-number-react';
import Chart from 'chart.js';
import {
  Grid, Typography, Checkbox, IconButton, Tooltip, Divider,
  Toolbar, MenuItem, Menu, ListItemIcon, ListItemText, Select, InputBase, LinearProgress, Table, TableHead, TableCell, TableBody, TableRow
} from '@material-ui/core';
import { withStyles, lighten } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import {
  Face, Group, AttachMoney, Add, Remove, Publish,
  Delete, Clear, GetApp, ShowChart, MoreVert, InfoOutlined,
  ArrowUpward, ArrowDownward, Edit, Class, GTranslate, Description, EventAvailable, Today,
} from '@material-ui/icons';
import MaterialTable from 'material-table';
import _ from 'lodash';

import tableIcons from './components/tableIcon';
import Report from './components/Report'
import DialogForm from './components/Dialog';
import SnackDialog from '../../../SnackerBar';
import 'moment/locale/vi';

const useStyle = theme => ({
  root: {},
  container: {
    padding: theme.spacing(3),
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
      username: localStorage.getItem('username'),
      duration: 1000,
      // Report results
      childrenTotalCount: 0,
      userTotalCount: 0,
      childrenFundTotalCount: 0,
      internalFundTotalCount: 0,
      // option for Bar chart
      doughnutChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 200
        },
        layout: {
          padding: 2
        },
        title: {
          display: true,
          position: 'bottom',
          fontSzie: 14,
          text: 'Biểu đồ số lượng Thiếu nhi từng lớp'
        },
        legend: {
          display: true,
          position: 'left'
        },
      },
      lineChartOptions: {
        responsive: true,
        animation: {
          duration: 1000
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
        }
      ],
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
      // type of dialog
      typeofDialog: '',
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
      //for calendar
      currentDisplayTime: '',
      currentDisplayDate: moment().locale('vi').format('dddd, DD MMMM YYYY'),
      weekdayShort: [],
      calendarContent: [],
    }

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this._ismounted = false;
  }

  componentDidMount = () => {
    this._ismounted = true;
    this.updateWindowDimensions();
    this.displayTime();
    this.displayCalendar();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    this.getChildrenData()
    this.getMemberData()
    this.getFundData(this.state.selectedMonths)
    this.getClassData()
    this.getEventData()
    this.getDocumentData()
    this.getTumblrPost();
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
    this._ismounted = false;
  }

  updateWindowDimensions() {
    if (this._ismounted) {
      this.setState({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
      });
      if (window.ChildrenFundChart) {
        this.getFundData(6);
        this.getClassData();
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

  displayTime = () => {
    if (this._ismounted === true) {
      let localeMoment = moment().locale('vi')
      this.setState({
        currentDisplayTime: localeMoment.format('LTS'),
      })
      setTimeout(this.displayTime, 1000);
    }
  }

  displayCalendar = () => {
    if (this._ismounted === true) {
      let firstDay = moment().startOf('month').format('d');
      let blanks = [];
      let daysInMonth = [];
      for (let i = 0; i < firstDay; i++) {
        blanks.push(<TableCell key={i + Math.floor(Math.random() * 100000)} style={{ fontSize: 11, textAlign: 'center' }}>{''}</TableCell>);
      }
      for (let d = 1; d <= moment().daysInMonth(); d++) {
        if (d === Number(moment().format('D'))) daysInMonth.push(<TableCell key={d} style={{ fontSize: 11, textAlign: 'center', color: 'white', backgroundColor: '#9c27b0' }}>{d}</TableCell>);
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
      })
    }
  }

  getChildrenData = () => {
    if (this._ismounted === true) {
      return axios.get('/backend/children/count', { params: { condition: 'all' } })
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

  getClassData = () => {
    let classLabels = [];
    let classData = [];
    let unconfirmedData = 0;
    let colors = [];
    if (this._ismounted === true) {
      return axios.get('/backend/children/count', { params: { condition: 'all' } })
        .then(res => {
          unconfirmedData = res.data.data

          return axios.get('/backend/class/all')
        })
        .then(classes => {
          // Class modifications
          let classesArr = [];
          let axiosRequests = [];
          classesArr = classes.data.data.filter(el => el.Value !== "Chung");
          this.setState({ classes: classesArr })
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
          classLabels.unshift('Chưa có lớp/Đã xong');
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
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  getFundData = (numberOfMonths) => {
    if (this._ismounted === true) {
      let months = [];
      let n = 0;
      while (n < numberOfMonths) {
        months.push(moment().subtract(n, 'months').format('MM/YYYY'));
        n += 1;
      }
      months = months.reverse()

      return axios.all([
        axios.get('/backend/children-fund/all'),
        axios.get('/backend/internal-fund/all'),
      ])
        .then(responses => {
          let dataResponses = [];
          responses.forEach(response => {
            dataResponses.push(response.data.data)
          })
          // get 6 previous months from now

          // Funds modifications
          let totalFunds = 0;
          let allFunds = dataResponses[0];
          let fundData = [];
          let totalImport = 0;
          let totalExport = 0;
          let totalInternalImport = 0;
          let totalInternalExport = 0;
          allFunds = _.sortBy(allFunds, fund => fund.date);
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
          let internalFundData = [];
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
          for (let i = 0; i < months.length; i++) {
            if (transformChildrenFundArr[i] === undefined) {
              fundData.unshift(0)
            }
            else {
              let priceDetail = 0;
              transformChildrenFundArr[i].data.forEach(key => {
                if (key.price.indexOf('tr') > -1) {
                  return priceDetail += Number(key.price.replace('tr', ''))
                }
                else if (key.price.indexOf('ng') > -1) {
                  return priceDetail += Number(key.price.replace('ng', '')) * 1000 / 1000000
                }
                else return priceDetail += Number(key.price)
              })
              fundData.push(priceDetail.toFixed(1));
            };

            if (transformInternalFundArr[i] === undefined) {
              internalFundData.unshift(0)
            }
            else {
              let priceDetail = 0;
              transformInternalFundArr[i].data.forEach(key => {
                if (key.price.indexOf('tr') > -1) {
                  return priceDetail += Number(key.price.replace('tr', ''))
                }
                else if (key.price.indexOf('ng') > -1) {
                  return priceDetail += Number(key.price.replace('ng', '')) * 1000 / 1000000
                }
                else return priceDetail += Number(key.price)
              })
              internalFundData.push(priceDetail.toFixed(1));
            }
          }

          let fundDataAfterCalculated = [];
          let internalFundDataAfterCalculated = [];
          for (let i = 0; i < fundData.length; i++) {
            fundData[i] = Number(fundData[i]);
            fundDataAfterCalculated.push(_.sum(fundData.slice(0, i + 1)));
          }
          for (let i = 0; i < internalFundData.length; i++) {
            internalFundData[i] = Number(internalFundData[i]);
            internalFundDataAfterCalculated.push(_.sum(internalFundData.slice(0, i + 1)));
          }

          this.setState({
            fundDifference: Number(fundDataAfterCalculated[fundDataAfterCalculated.length - 1]) - Number(fundDataAfterCalculated[fundDataAfterCalculated.length - 2]),
            internalFundDifferences: Number(internalFundDataAfterCalculated[internalFundDataAfterCalculated.length - 1] - Number(internalFundDataAfterCalculated[internalFundDataAfterCalculated.length - 2]))
          })

          if (window.ChildrenFundChart) {
            window.ChildrenFundChart.destroy();
          }
          Chart.defaults.global.defaultFontColor = 'black'
          let ctx = document.getElementById('childrenFund');
          window.ChildrenFundChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: months,
              datasets: [{
                label: 'Quỹ Thiếu Nhi (triệu)',
                data: fundDataAfterCalculated,
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
                data: internalFundDataAfterCalculated,
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
            childrenFunds: allFunds,
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
    if (this._ismounted === true) {
      return axios.get('/backend/database/tumblr/posts')
        .then(res => {
          // Tumblr post
          // let div = document.getElementById('content')
          // div.innerHTML = res.data.data.content;
          // div.removeChild(document.querySelector('h2'));
          // End of Tumblr post

          this.setState({
            tumblrImageURL: res.data.data.img,
            tumblrImagePage: res.data.data.url,
            tumbleContent: res.data.data.content,
            isTumblrLoading: false,
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({ isTumblrLoading: false })
        })
    }
  }

  createNewClass = (className) => {
    this.setState({ isButtonDisabled: true, isLoading: true })
    let classID = '';
    let classNameSplit = className.split(' ');
    for (let i = 0; i < classNameSplit.length - 1; i++) {
      classID += classNameSplit[i].charAt(0).toUpperCase();
    };
    classID += classNameSplit[classNameSplit.length - 1].toUpperCase();
    const newClass = {
      'ID': this.removeVietnameseLetter(classID),
      'Value': this.capitalizeWord(className),
      'path': `/dashboard/${classID}`
    }

    return axios.post('/backend/class/add', newClass)
      .then(res => {
        if (res.data.code === 'I001') {
          this.setState({
            isButtonDisabled: false,
            isOpenAddClassForm: false,
          })
          this.getClassData();
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

  createNewFund = (fund) => {
    this.setState({ isButtonDisabled: true, isLoading: true })

    if (this.state.selectedFundType === 'QTN') {
      return axios
        .post('/backend/children-fund/new-fund', fund)
        .then(res => {
          if (res.data.code === 'I001') {
            this.setState({
              isButtonDisabled: false,
              isOpenAddFundForm: false,
              selectedFundType: 'QTN'
            })
            this.getFundData(6);
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
      return axios
        .post('/backend/internal-fund/new-fund', fund)
        .then(res => {
          if (res.data.code === 'I001') {
            this.setState({
              isButtonDisabled: false,
              isOpenAddFundForm: false,
              selectedFundType: 'QTN'
            })
            this.getFundData(6);
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

  createNewEvent = (event) => {
    this.setState({ isButtonDisabled: true, isLoading: true })

    return axios
      .post('/backend/event/new-event', event)
      .then(res => {
        if (res.data.code === 'I001') {
          this.setState({
            isButtonDisabled: false,
            isOpenAddEventForm: false,
          })
          this.getEventData();
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

  createDocument = (e) => {
    const data = new FormData();
    data.append('date', moment().format('YYYY-MM-DD hh:mm:ss'))
    data.append('username', localStorage.getItem('username'))
    data.append('file', e.target.files[0])

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
    document.getElementById('filePicker').click();
  }

  handleChangeValue = (e, type) => {
    const result = {};
    let data = e.target.value;
    result[type] = data;
    result['childrenFunds'] = [];
    this.setState(result);
    if (e.target.value === 'QTN') {
      return axios.get('/backend/children-fund/all')
        .then(res => {
          let allFunds = res.data.data;
          allFunds = _.sortBy(allFunds, fund => fund.date);
          allFunds.forEach(fund => {
            fund.date = (fund.date === '') ? '' : moment(fund.date).format('DD/MM/YYYY');
            fund.price = this.priceFormat(fund.price);
          })
          this.setState({ childrenFunds: allFunds })
        })
    }
    else {
      return axios.get('/backend/internal-fund/all')
        .then(res => {
          let allFunds = res.data.data;
          allFunds = _.sortBy(allFunds, fund => fund.date);
          allFunds.forEach(fund => {
            fund.date = (fund.date === '') ? '' : moment(fund.date).format('DD/MM/YYYY');
            fund.price = this.priceFormat(fund.price);
          })
          this.setState({ childrenFunds: allFunds })
        })
    }
  }

  handleChangeMonth = (e, type) => {
    let result = {};
    result[type] = e.target.value;
    this.setState(result)
    this.getFundData(e.target.value)
  }

  render = () => {
    const { classes } = this.props;

    return (
      <div>
        <Grid container className={classes.container} spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
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
                  }}>{'Cập nhật: ' + this.state.currentTime}</Typography>
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
          <Grid item xs={12} md={6} lg={3}>
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
                  }}>{'Cập nhật: ' + this.state.currentTime}</Typography>
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
          <Grid item xs={12} md={6} lg={3}>
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
                    <ArrowUpward style={{ color: 'green', fontSize: '12px' }} /> :
                    <ArrowDownward style={{ color: 'red', fontSize: '12px' }} />}
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
          <Grid item xs={12} md={6} lg={3}>
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
                    <ArrowUpward style={{ color: 'green', fontSize: '12px' }} /> :
                    <ArrowDownward style={{ color: 'red', fontSize: '12px' }} />}
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
                <div style={(this.state.innerWidth < 500) ? { height: '37em' } : { height: '35em' }}>
                  <Toolbar disableGutters={true}>
                    <div style={{ flex: 1, marginLeft: '7em' }} />
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
                      <Select
                        value={this.state.selectedMonths}
                        onChange={(e) => this.handleChangeMonth(e, 'selectedMonths')}
                        input={<InputBase />}
                        style={{ justifyContent: 'right' }}>
                        <MenuItem value={6}>6 tháng</MenuItem>
                        <MenuItem value={9}>9 tháng</MenuItem>
                        <MenuItem value={12}>12 tháng</MenuItem>
                      </Select>
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
                width: '6em'
              }}
              children={
                <div style={(this.state.innerWidth < 500) ? { height: 'auto' } : { height: '18em' }}>
                  <Toolbar disableGutters={true}>
                    <Select
                      value={this.state.selectedFundType}
                      onChange={(e) => this.handleChangeValue(e, 'selectedFundType')}
                      input={<InputBase />}
                      style={{ marginLeft: '7em' }}>
                      <MenuItem value='QTN'>Quỹ TN</MenuItem>
                      <MenuItem value='QR'>Quỹ nội bộ</MenuItem>
                    </Select>
                    <div style={{ flex: 1 }} />
                    <div>
                      <Typography variant="h5" style={{ textAlign: 'right' }}>Quỹ</Typography>
                      <Typography variant="subtitle2" style={{ textAlign: 'right' }}>Nhật ký thu/chi quỹ</Typography>
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
                        disabled={(localStorage.getItem('type') !== 'Admin') ? true : false}
                        onClick={() => {
                          this.setState({
                            isOpenAddFundForm: true,
                            typeofDialog: 'fund',
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
                        maxBodyHeight: '11em',
                        minBodyHeight: '11em',
                        showTitle: false,
                        toolbar: false,
                      }}
                      localization={{
                        body: {
                          emptyDataSourceMessage: 'Không có dữ liệu!'
                        },
                        header: {
                          actions: 'Chỉnh sửa'
                        }
                      }}
                      actions={[
                        {
                          icon: () => { return <Edit style={{ color: '#ff9800' }} /> },
                          tooltip: 'Chỉnh sửa',
                          onClick: () => {
                            alert('Clicked')
                          }
                        },
                        {
                          icon: () => { return <Clear style={{ color: 'red' }} /> },
                          tooltip: 'Xóa',
                          onClick: (e, rowData) => {
                            return axios.delete(`/backend/children-fund/delete/${rowData._id}`)
                              .then(res => {
                                if (res.data.code === 'I001') {
                                  this.getFundData(6)
                                }
                              })
                              .catch(err => {
                                this.setState({
                                  snackerBarStatus: true,
                                  snackbarType: 'error',
                                  snackbarMessage: 'Đã có lỗi từ máy chủ. Không thể xóa!',
                                })
                              })
                          }
                        }
                      ]}
                    />
                    <DialogForm
                      open={this.state.isOpenAddFundForm}
                      dialogType={this.state.typeofDialog}
                      callback={this.callbackFundTable}
                      func={this.createNewFund}
                      disabled={this.state.isButtonDisabled}
                      style={{ color: '#ff9800' }} />
                  </div>
                </div>
              }
            />
            <Report
              icon={<InfoOutlined className={classes.icon} />}
              style={{
                background: 'linear-gradient(to bottom right, #ffcc80, #ff9800)',
                marginBottom: '-4em',
                height: '6em',
                width: '6em',
                marginTop: '2em'
              }}
              children={
                <div style={(this.state.innerWidth < 500) ? { height: 'auto' } : { height: '11em' }}>
                  <Toolbar disableGutters={true}>
                    <div style={{ flex: 1, marginLeft: '7em' }} />
                    <div>
                      <Typography variant="h5" style={{ textAlign: 'right' }}>{`Quỹ năm ${moment().subtract(1, 'years').format('YYYY')}`}</Typography>
                      <Typography variant="subtitle2" style={{ textAlign: 'right' }}>Tổng kết sơ bộ</Typography>
                    </div>
                  </Toolbar>
                  <Divider />
                  <div style={{ marginTop: '1em' }}>
                    {(this.state.selectedFundType === 'QTN') ?
                      (
                        <React.Fragment>
                          <Typography variant="body2">{`Tổng thu: ${this.priceFormat(this.state.totalImport)}`}</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(this.state.totalImport / (this.state.childrenFundTotalCount)) * 100}
                            classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }}
                            style={{ height: 10 }} />
                          <Typography variant="body2">{`Tổng chi: ${this.priceFormat(this.state.totalExport)}`}</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(Math.abs(this.state.totalExport) / (this.state.childrenFundTotalCount)) * 100}
                            classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }}
                            style={{ height: 10 }} />
                          <Typography variant="body2">{`Tồn: ${this.priceFormat(this.state.subtractChildrenFund)}`}</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(this.state.subtractChildrenFund / (this.state.childrenFundTotalCount)) * 100}
                            classes={{ colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary }}
                            style={{ height: 10 }} />
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
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <Report
              icon={<EventAvailable className={classes.icon} />}
              style={{
                background: 'linear-gradient(to bottom right, #ce93d8, #9c27b0)',
                height: '6em',
                width: '6em',
                marginBottom: '-4em',
              }}
              children={
                <div style={(this.state.innerWidth < 500) ? { height: 'auto' } : { height: '15em' }}>
                  <Toolbar disableGutters={true}>
                    <div style={{ flex: 1, marginLeft: '7em' }} />
                    <div>
                      <Typography variant="h5" style={{ textAlign: 'right' }}>Thông báo</Typography>
                      <Typography variant="subtitle2" style={{ textAlign: 'right' }}>Sự kiện/Thông báo đến từ Xứ Đoàn</Typography>
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
                        disabled={(localStorage.getItem('type') !== 'Admin' && localStorage.getItem('type') !== 'Member') ? true : false}
                        onClick={() => {
                          this.setState({
                            isOpenAddEventForm: true,
                            typeofDialog: 'event',
                            isOpenEventActionMenu: null
                          })
                        }}>
                        <ListItemIcon><Add /></ListItemIcon>
                        <ListItemText primary="Tạo mới sự kiện" />
                      </MenuItem>
                      <MenuItem
                        disabled={(localStorage.getItem('type') !== 'Admin' && localStorage.getItem('type') !== 'Member') ? true : false}
                        onClick={() => {
                          return axios.delete('/backend/event/delete-checked')
                            .then(res => {
                              if (res.data.code === 'I001') {
                                this.setState({
                                  childrenTotalCount: 0,
                                  userTotalCount: 0,
                                  childrenFundTotalCount: 0,
                                  internalFundTotalCount: 0,
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
                        maxBodyHeight: '10em',
                        minBodyHeight: '10em',
                        showTitle: false,
                        toolbar: false,
                        header: false,
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
                          icon: '',
                          tooltip: 'Hoàn thành',
                          onClick: (e, rowData) => {
                            return axios.post(`/backend/event/update-by-id/${rowData._id}`)
                              .then(res => {
                                if (res.data.code === 'I001') {
                                  this.setState({
                                    childrenTotalCount: 0,
                                    userTotalCount: 0,
                                    childrenFundTotalCount: 0,
                                    internalFundTotalCount: 0,
                                  })
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
                          }
                        },
                      ]}
                      components={{
                        Action: props => (
                          <Tooltip title="Đánh dấu hoàn thành">
                            <Checkbox
                              checked={props.data.isChecked}
                              disabled={props.data.isChecked}
                              onChange={(e) => props.action.onClick(e, props.data)} />
                          </Tooltip>
                        )
                      }}
                    />
                    <DialogForm
                      open={this.state.isOpenAddEventForm}
                      dialogType={this.state.typeofDialog}
                      callback={this.callbackEventTable}
                      func={this.createNewEvent}
                      disabled={this.state.isButtonDisabled}
                      style={{ color: '#9c27b0' }} />
                  </div>
                </div>
              }
            />
            <Report
              icon={<Today className={classes.icon} />}
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
                    <div style={{ flex: 1, marginLeft: '7em' }} />
                    <div>
                      <Typography variant="h5" style={{ textAlign: 'right' }}>{this.state.currentDisplayTime}</Typography>
                      <Typography variant="subtitle2" style={{ textAlign: 'right' }}>{this.state.currentDisplayDate}</Typography>
                    </div>
                  </Toolbar>
                  <Divider />
                  <Table padding='none' style={{marginRight: '1em'}}>
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
                <div style={(this.state.innerWidth < 500) ? { height: 'auto' } : { height: '35em' }}>
                  <Toolbar disableGutters>
                    <div style={{ flex: 1, marginLeft: '7em' }} />
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
                    <Grid item xs={12} md={6} lg={8}>
                      <div style={{ height: '28em' }}>
                        <canvas id='chart' />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
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
                              icon: () => { return <Remove style={{ color: 'red' }} /> },
                              tooltip: 'Xóa',
                              onClick: (e, rowData) => {
                                return axios.delete(`/backend/class/delete/by-id/${rowData.ID}`)
                                  .then(res => {
                                    if (res.data.code === 'I001') {
                                      this.setState({
                                        childrenTotalCount: 0,
                                        userTotalCount: 0,
                                        childrenFundTotalCount: 0,
                                        internalFundTotalCount: 0,
                                      })
                                      this.getClassData();
                                    }
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
                          callback={this.callbackClassTable}
                          func={this.createNewClass}
                          disabled={this.state.isButtonDisabled}
                          style={{ color: '#2196f3' }} />
                      </div>
                    </Grid>
                  </Grid>
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={6}>
            <Report
              icon={<GTranslate className={classes.icon} />}
              style={{
                background: 'linear-gradient(to bottom right, #4db6ac, #009688)',
                height: '6em',
                width: '6em',
                marginBottom: '-4em',
              }}
              children={
                <div style={(this.state.innerWidth < 500) ? { height: 'auto' } : { height: '20em' }}>
                  <Toolbar disableGutters={true}>
                    <div style={{ flex: 1, marginLeft: '7em' }} />
                    <div>
                      <Typography variant="h5" style={{ textAlign: 'right' }}>English corner</Typography>
                      <Typography variant="subtitle2" style={{ textAlign: 'right' }}>Trau dồi kiến thức Anh Ngữ thông qua Tin Mừng hằng ngày</Typography>
                    </div>
                  </Toolbar>
                  <Divider />
                  <div style={{ marginTop: '1em' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={12} lg={6}>
                        {(this.state.isTumblrLoading) ?
                          <Skeleton variant="rect" width='100%' height={240} /> :
                          <img
                            src={this.state.tumblrImageURL}
                            alt=''
                            className={classes.image}
                            onClick={() => window.open(`https://${this.state.tumblrImagePage}`, '_blank')} />}
                      </Grid>
                      <Grid item xs={12} md={12} lg={6}>
                        {(this.state.isTumblrLoading) ?
                          (<div>
                            <Skeleton variant="text" height={15} />
                            <Skeleton variant="text" height={15} />
                            <Skeleton variant="text" height={15} />
                            <Skeleton variant="text" height={15} />
                            <Skeleton variant="text" height={15} />
                            <Skeleton variant="text" height={15} />
                            <Skeleton variant="text" height={15} />
                            <Skeleton variant="text" height={15} />
                            <Skeleton variant="text" height={15} />
                            <Skeleton variant="text" height={15} />
                          </div>) :
                          <div
                            style={{ overflowX: 'auto', height: '15em' }}
                            id='content'
                            dangerouslySetInnerHTML={{ __html: this.state.tumbleContent }} />}
                      </Grid>
                    </Grid>
                  </div>
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={6}>
            <Report
              icon={<Description className={classes.icon} />}
              style={{
                background: 'linear-gradient(to bottom right, #f48fb1, #e91e63)',
                height: '6em',
                width: '6em',
                marginBottom: '-4em',
              }}
              children={
                <div style={(this.state.innerWidth < 500) ? { height: 'auto' } : { height: '20em' }}>
                  <Toolbar disableGutters>
                    <div style={{ flex: 1, marginLeft: '7em' }} />
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
                        disabled={(localStorage.type !== 'Admin') ? true : false}
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
                  <div style={{ marginTop: '1em', overflow: 'auto' }}>
                    <MaterialTable
                      icons={tableIcons}
                      data={this.state.documents}
                      columns={[
                        {
                          title: 'Tên tài liệu',
                          field: 'filename'
                        },
                        {
                          title: 'Người đăng tải',
                          field: 'username',
                        },
                        {
                          title: 'Chỉnh sửa lần cuối',
                          field: 'date'
                        },
                      ]}
                      options={{
                        paging: false,
                        sorting: false,
                        headerStyle: {
                          position: 'sticky',
                          top: 0,
                          color: '#e91e63',
                          fontSize: 15
                        },
                        search: false,
                        maxBodyHeight: '15em',
                        minBodyHeight: '15em',
                        toolbar: false,
                        showTitle: false,
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
                          icon: () => { return <Edit style={{ color: '#e91e63' }} /> },
                          tooltip: 'Đổi tên',
                          onClick: (e, rowData) => {
                            alert('Clicked!')
                          }
                        },
                        {
                          icon: () => { return <GetApp style={{ color: 'green' }} /> },
                          tooltip: 'Tải xuống',
                          onClick: (e, rowData) => {
                            return axios.get(`/backend/document/download/by-id/${rowData._id}`)
                              .then(res => {
                                let link = document.createElement('a');
                                link.href = res.data.data;
                                link.setAttribute('download', rowData.filename);
                                link.click();
                              })
                              .then(() => {
                                this.setState({
                                  snackerBarStatus: true,
                                  snackbarType: 'success',
                                  snackbarMessage: 'Tải xuống thành công',
                                })
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
                          }
                        },
                        {
                          icon: () => { return <Clear style={{ color: 'red' }} /> },
                          tooltip: 'Xóa tài liệu',
                          onClick: (e, rowData) => {

                            return axios.delete(`/backend/document/delete-by-id/${rowData._id}`)
                              .then(res => {
                                if (res.data.code === 'I001') {
                                  this.getDocumentData();
                                  this.setState({
                                    snackerBarStatus: true,
                                    snackbarType: 'success',
                                    snackbarMessage: 'Xóa tài liệu thành công',
                                  })
                                }
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
                          }
                        }
                      ]}
                    />
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
        <input id="filePicker" type="file" onChange={e => this.createDocument(e)} accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .txt" style={{ 'display': 'none' }} />
      </div>
    )
  }
}

export default withStyles(useStyle)(General);