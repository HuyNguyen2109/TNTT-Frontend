import React from 'react';
import moment from 'moment';
import axios from 'axios';
import AnimatedNumber from 'animated-number-react';
import Chart from 'chart.js';
import {
  Grid, Typography, Checkbox, IconButton, Tooltip, Backdrop, CircularProgress
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Face, Group, AttachMoney, Add, Remove, Publish, Delete, Clear, GetApp, CallMerge } from '@material-ui/icons';
import MaterialTable from 'material-table';
import _ from 'lodash';

import tableIcons from './components/tableIcon';
import Report from './components/Report'
import DialogForm from './components/Dialog';
import SnackDialog from '../../../SnackerBar';

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
    width: '100%',
    height: '100%'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
})

class General extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      currentTime: moment().format('DD/MM/YYYY hh:mm:ss'),
      username: localStorage.getItem('username'),
      duration: 200,
      // Report results
      childrenTotalCount: 0,
      userTotalCount: 0,
      childrenFundTotalCount: 0,
      internalFundTotalCount: 0,
      // option for Bar chart
      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 200
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 10,
            },
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.5)',
              zeroLineColor: 'rgba(255,255,255,0.5)',
              borderDash: [1, 2],
              zeroLineBorderDash: [1, 2], 
            },
            scaleLabel: {
              display: true,
              labelString: 'số lượng (em)',
              padding: 1,
              lineHeight: 1
            }
          }],
          xAxes: [{
            gridLines: {
              drawOnChartArea: false,
              display: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'lớp',
              padding: 1,
              lineHeight: 1
            }
          }]
        },
        title: {
          display: true,
          text: 'Biểu đồ Số lượng thiếu nhi theo lớp',
          position: 'bottom',
          padding: 3,
          fontStyle: 'normal',
          fontFamily: 'Arial',
        },
        layout: {
          padding: 2
        },
        legend: {
          display: false
        },
      },
      lineChartOptions: {
        responsive: true,
        animation: {
          duration: 200
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 20,
              beginAtZero: true
            },
            gridLines: {
              drawBorder: false,
              display: true,
              color: 'rgba(255,255,255,0.5)',
              zeroLineColor: 'rgba(255,255,255,0.5)',
              borderDash: [1, 2],
              zeroLineBorderDash: [1, 2], 
            },
            scaleLabel: {
              display: true,
              labelString: 'Quỹ (triệu)',
              padding: 1,
              lineHeight: 1
            }
          }],
          xAxes: [{
            gridLines: {
              drawOnChartArea: false,
              display: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Tháng',
              padding: 1,
              lineHeight: 1
            }
          }]
        },
        title: {
          display: true,
          text: 'Biểu đồ tổng quỹ Thiếu nhi theo tháng',
          position: 'bottom',
          padding: 3,
          fontStyle: 'normal',
          fontFamily: 'Arial',
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
      //for Children Fund Table
      childrenFunds: [],
      childrenFundColumns: [
        {
          title: 'Ngày',
          field: 'date',
          cellStyle: {minWidth: 20}
        },
        {
          title: 'Nội dung',
          field: 'title',
          cellStyle: {minWidth: 250}
        },
        {
          title: 'Số tiền',
          field: 'price',
          cellStyle: {minWidth: 50}
        }
      ],
      isOpenAddFundForm: false,
      // for Event Table
      isOpenAddEventForm: false,
      events: [],
      // for Documents Table
      documents: [],
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
      tumbleContent: '',
    }
  }

  componentDidMount = () => {
    this._ismounted = true;
    return this.getData();
  }

  componentWillUnmount = () => {
    this._ismounted = false;
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
    if(Math.abs(num) > 999 && Math.abs(num) < 999999) {
      return Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'ng';
    }
    else if (Math.abs(num) > 999999) {
      return Math.sign(num)*((Math.abs(num)/1000000).toFixed(1)) + 'tr';
    }
    else {
      return num
    };
  }

  getData = () => {
    let classLabels = [];
    let classData = [];
    this.setState({
      classes: [],
      events: [],
      documents: [],
      childrenFunds: [],
      isLoading: true,
    })

    if(this._ismounted === true) {
      return axios.all([
        axios.get('/backend/children/count', { params: { condition: 'all' } }),
        axios.get('backend/user/all'),
        axios.get('/backend/children-fund/all'),
        axios.get('/backend/event/all'),
        axios.get('/backend/document/all'),
        axios.get('/backend/database/tumblr/posts'),
        axios.get('/backend/class/all')
      ])
        .then(responses => {
          let dataResponses = [];
          responses.forEach(response => {
            dataResponses.push(response.data.data)
          })
          // Funds modifications
          let totalFunds = 0;
          let allFunds = dataResponses[2];
          let monthLabels = [];
          let fundData = [];
          allFunds = _.sortBy(allFunds, fund => fund.date);
          allFunds.forEach(fund => {
            fund.date = (fund.date === '')? '' : moment(fund.date).format('DD/MM/YYYY');
            totalFunds += fund.price;
            fund.price = this.priceFormat(fund.price);
          })
          
          //draw chart
          const groupedFunds = _.groupBy(dataResponses[2], fund => fund.date.split("/")[1])
          Object.values(groupedFunds).forEach(keys => {
            monthLabels.push(keys[0].date.split("/")[1] + '/' + keys[0].date.split("/")[2])
            let priceDetail = 0;
            keys.forEach(key => {
              priceDetail += Number(key.price.replace('tr', ''))
            })
            fundData.push(priceDetail.toFixed(1));
          })
          let fundDataAfterCalculated = [];
          for (let i = 0; i < fundData.length; i++) {
            fundData[i] = Number(fundData[i]);
            fundDataAfterCalculated.push(_.sum(fundData.slice(0, i+1)));
          }
          if(monthLabels.length > 6) {
            monthLabels = monthLabels.slice(-6, monthLabels.length);
            fundDataAfterCalculated = fundDataAfterCalculated.slice(-6, fundDataAfterCalculated.length);
          }
          if(window.ChildrenFundChart) {
            window.ChildrenFundChart.destroy();
          }
          Chart.defaults.global.defaultFontColor = 'white'
          let ctx = document.getElementById('childrenFund');
          window.ChildrenFundChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: monthLabels,
              datasets: [{
                label: 'Quỹ (triệu)',
                data: fundDataAfterCalculated,
                borderColor: 'rgba(255,255,255,0.9)',
                backgroundColor: 'rgba(255,255,255,0.9)',
                hoverBackgroundColor: 'rgba(255,255,255,0.9)',
                pointRadius: 5,
                showLine: true,
                fill: false,
                clip: 50
              }]
            },
            options: this.state.lineChartOptions
          })
          // End of Fund modifications
          // Event modifications
          let listOfEvents = dataResponses[3];
          listOfEvents.forEach(event => {
            event.date = (event.date === '')? '' : moment(event.date).format('DD/MM/YYYY');
          })
          // End of Event modifications
          // Document modifications
          let listOfDocuments = dataResponses[4];
          listOfDocuments.forEach(doc => {
            doc.date = (doc.date === '')? '' : moment(doc.date).format('DD/MM/YYYY hh:mm:ss');
          })
          // End of Document modifications
          // Tumblr post
          let div = document.getElementById('content')
          div.innerHTML = dataResponses[5].content;
          div.removeChild(document.querySelector('h2'));
          // End of Tumblr post
          // Class modifications
          let axiosRequests = [];
          dataResponses[6] = dataResponses[6].filter(el => el.Value !== "Chung");
          dataResponses[6].forEach(classEl => {
            classLabels.push(classEl.ID);
            axiosRequests.push(axios.get('/backend/children/count', { params: { condition: classEl.ID } }))})
          // End of class modifications
          this.setState({
            childrenTotalCount: dataResponses[0],
            userTotalCount: dataResponses[1].length,
            childrenFunds: allFunds,
            childrenFundTotalCount: totalFunds,
            isLoadingChildrenFundTable: false,
            events: listOfEvents,
            isLoadingEventTable: false,
            documents: listOfDocuments,
            isLoaingDocumentTable: false,
            tumblrImageURL: dataResponses[5].img,
            classes: dataResponses[6],
            isLoadingClassTable: false,
            isLoading: false
          })
          
          return axios.all(axiosRequests) 
        })
        .then((responseArr) => {
          responseArr.forEach(res => {
            classData.push(res.data.data)
          })
          //draw chart
          if(window.ChildrenCountChart) {
            window.ChildrenCountChart.destroy();
          }
          Chart.defaults.global.defaultFontColor = 'white'
          let ctx = document.getElementById('chart');
          window.ChildrenCountChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: classLabels,
              datasets: [{
                label: 'Sỉ số',
                data: classData,
                backgroundColor: 'rgba(255,255,255,0.9)',
                hoverBackgroundColor: 'rgba(255,255,255,0.9)',
                maxBarThickness: 8
              }]
            },
            options: this.state.barChartOptions
          }); 
        })
        .catch(err => {
          this.setState({
            snackerBarStatus: true,
            snackbarType: 'error',
            snackbarMessage: 'Đã có lỗi từ máy chủ',
            isLoading: false
          })
        });
    }
  }

  createNewClass = (className) => {
    this.setState({ isButtonDisabled: true, isLoading: true })
    let classID = '';
    let classNameSplit = className.split(' ');
    for(let i = 0; i < classNameSplit.length - 1; i++) {
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
        if(res.data.code === 'I001') {
          this.setState({ 
            isButtonDisabled: false,
            isOpenAddClassForm: false,
            childrenTotalCount: 0,
            userTotalCount: 0,
            childrenFundTotalCount: 0,
            internalFundTotalCount: 0,
          })
          this.getData();
        }
      })
      .catch(err => {
        if(err.response.status === 409) {
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
    
    return axios
      .post('/backend/children-fund/new-fund', fund)
      .then(res => {
        if(res.data.code === 'I001') {
          this.setState({ 
            isButtonDisabled: false,
            isOpenAddFundForm: false,
            childrenTotalCount: 0,
            userTotalCount: 0,
            childrenFundTotalCount: 0,
            internalFundTotalCount: 0,
          })
          this.getData();
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

  createNewEvent = (event) => {
    this.setState({ isButtonDisabled: true, isLoading: true })

    return axios
      .post('/backend/event/new-event', event)
      .then(res => {
        if(res.data.code === 'I001') {
          this.setState({
            isButtonDisabled: false,
            isOpenAddEventForm: false,
            childrenTotalCount: 0,
            userTotalCount: 0,
            childrenFundTotalCount: 0,
            internalFundTotalCount: 0,
          })
          this.getData();
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
    this.setState({ isLoaingDocumentTable: true, isLoading: true})
    const data = new FormData();
    data.append('date', moment().format('YYYY-MM-DD hh:mm:ss')) 
    data.append('username', localStorage.getItem('username'))
    data.append('file', e.target.files[0])

    return axios.post('/backend/document/create', data)
      .then(res => {
        if (res.data.code === "I001") {
          this.getData()
          this.setState({
            snackerBarStatus: true,
            snackbarType: 'success',
            snackbarMessage: 'Tải lên thành công',
          })
        }
      })
      .catch(err => {
        if(err.response.status === 409) {
          this.setState({
            snackerBarStatus: true,
            snackbarType: 'error',
            snackbarMessage: 'File đã có sẵn trên máy chủ, vui lòng đổi tên file nếu đó là bản cập nhật',
            isButtonDisabled: false,
            isLoaingDocumentTable: false,
          })
        }
        else {
          console.log(err)
          this.setState({
            snackerBarStatus: true,
            snackbarType: 'error',
            snackbarMessage: 'Đã có lỗi từ máy chủ',
            isButtonDisabled: false,
            isLoaingDocumentTable: false,
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

  render = () => {
    const { classes } = this.props;

    return (
      <div>
        <Backdrop className={classes.backdrop} open={this.state.isLoading} onClick={() => this.setState({isLoading: false})}>
          <CircularProgress color='primary' />
          <Typography variant='subtitle1'>Đang lấy dữ liệu từ máy chủ...</Typography>
        </Backdrop>
        <Grid container className={classes.container} spacing={4}>
          <Grid item xs={12} sm={6} lg={3}>
            <Report 
              icon={<Face className={classes.icon}/>}
              children={
                <div>
                  <Typography variant='subtitle2' style={{
                    textAlign: 'right'
                  }}>Thiếu Nhi</Typography>
                  <Typography variant='h5' style={{
                    textAlign: 'right'
                    }}><AnimatedNumber 
                      value={this.state.childrenTotalCount} 
                      duration={this.state.duration} 
                      formatValue={value => this.formatValue(value, 'em')}/>
                  </Typography>
                  <Typography variant='body2' style={{
                    textAlign: 'left', 
                    fontSize: '12px',
                    paddingTop: '1em'
                  }}>{'Cập nhật: ' + this.state.currentTime}</Typography>
                </div>
              }
              style={{
                background: 'linear-gradient(to right bottom, #7986cb, #3f51b5)',
                width: '6em',
                height: '6em',
                marginBottom: '-4em',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Report 
              icon={<Group className={classes.icon}/>}
              children={
                <div>
                  <Typography variant='subtitle2' style={{
                    textAlign: 'right'
                  }}>HT/GLV</Typography>
                  <Typography variant='h5' style={{
                    textAlign: 'right'
                    }}><AnimatedNumber 
                      value={this.state.userTotalCount} 
                      duration={this.state.duration} 
                      formatValue={value => this.formatValue(value, 'a/c')}/>
                  </Typography>
                  <Typography variant='body2' style={{
                    textAlign: 'left', 
                    fontSize: '12px',
                    paddingTop: '1em'
                  }}>{'Cập nhật: ' + this.state.currentTime}</Typography>
                </div>
              }
              style={{
                background: 'linear-gradient(to right bottom, #f06292, #e91e63)',
                width: '6em',
                height: '6em',
                marginBottom: '-4em',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Report 
              icon={<AttachMoney className={classes.icon}/>}
              children={
                <div>
                  <Typography variant='subtitle2' style={{
                    textAlign: 'right'
                  }}>Quỹ Thiếu Nhi</Typography>
                  <Typography variant='h5' style={{
                    textAlign: 'right'
                    }}><AnimatedNumber 
                      value={this.state.childrenFundTotalCount} 
                      duration={this.state.duration} 
                      formatValue={value => this.formatValue(value, 'đ')}/>
                  </Typography>
                  <Typography variant='body2' style={{
                    textAlign: 'left', 
                    fontSize: '12px',
                    paddingTop: '1em'
                  }}>{'Cập nhật: ' + this.state.currentTime}</Typography>
                </div>
              }
              style={{
                background: 'linear-gradient(to right bottom, #81c784, #4caf50)',
                width: '6em',
                height: '6em',
                marginBottom: '-4em',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Report 
              icon={<AttachMoney className={classes.icon}/>}
              children={
                <div>
                  <Typography variant='subtitle2' style={{
                    textAlign: 'right'
                  }}>Quỹ nội bộ</Typography>
                  <Typography variant='h5' style={{
                    textAlign: 'right'
                    }}><AnimatedNumber 
                      value={this.state.internalFundTotalCount} 
                      duration={this.state.duration} 
                      formatValue={value => this.formatValue(value, 'đ')}/>
                    </Typography>
                  <Typography variant='body2' style={{
                    textAlign: 'left', 
                    fontSize: '12px',
                    paddingTop: '1em'
                  }}>{'Cập nhật: ' + this.state.currentTime}</Typography>
                </div>
              }
              style={{
                background: 'linear-gradient(to right bottom, #ffab91, #ff5722)',
                width: '6em',
                height: '6em',
                marginBottom: '-4em',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <Report 
              icon={<canvas id='chart'/>}
              style={{
                background: 'linear-gradient(to right bottom, #64b5f6, #2196f3)',
                marginBottom: '-13em',
                height: '15em',
              }}
              children={
                <div style={{marginTop: '13em'}}>
                  <MaterialTable 
                    title="Danh sách lớp"
                    icons={tableIcons}
                    columns={this.state.classTableColumn}
                    data={this.state.classes}
                    isLoading={this.state.isLoadingClassTable}
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
                      maxBodyHeight: '200px',
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
                        icon: () => { return <Add /> },
                        tooltip: 'Thêm lớp',
                        isFreeAction: true,
                        hidden: (localStorage.type !== 'Admin')? true : false,
                        onClick: () => { this.setState({
                          isOpenAddClassForm: true,
                          typeofDialog: 'class'
                        }) } 
                      },
                      {
                        icon: () => { return <Remove style={{color: 'red'}} />},
                        tooltip: 'Xóa',
                        onClick: (e, rowData) => {
                          return axios.delete(`/backend/class/delete/by-id/${rowData.ID}`)
                            .then(res => {
                              if(res.data.code === 'I001') {
                                this.setState({
                                  childrenTotalCount: 0,
                                  userTotalCount: 0,
                                  childrenFundTotalCount: 0,
                                  internalFundTotalCount: 0,
                                  isLoadingClassTable: true
                                })
                                this.getData();
                              }
                            })
                            .catch(err => {
                              if(err.response.status === 404) {
                                this.setState({
                                  snackerBarStatus: true,
                                  snackbarType: 'error',
                                  snackbarMessage: 'Lớp đã xóa hoặc không tồn tại trong CSDL',
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
                      }
                    ]}
                  />
                  <Typography variant='body2' style={{
                    textAlign: 'left', 
                    fontSize: '12px',
                    paddingTop: '1em'
                  }}>{'Cập nhật: ' + this.state.currentTime}</Typography>
                  <DialogForm 
                    open={this.state.isOpenAddClassForm} 
                    dialogType={this.state.typeofDialog}
                    callback={this.callbackClassTable}
                    func={this.createNewClass}
                    disabled={this.state.isButtonDisabled}
                    style={{color: '#2196f3'}}/>
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <Report 
              icon={<canvas id='childrenFund'/>}
              style={{
                background: 'linear-gradient(to right bottom, #ffcc80, #ff9800)',
                marginBottom: '-13em',
                height: '15em',
              }}
              children={
                <div style={{marginTop: '13em'}}>
                  <MaterialTable 
                    title='Chi tiết quỹ TN'
                    icons={tableIcons}
                    columns={this.state.childrenFundColumns}
                    data={this.state.childrenFunds}
                    isLoading={this.state.isLoadingChildrenFundTable}
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
                      maxBodyHeight: '200px',
                    }}
                    localization={{
                      body: {
                        emptyDataSourceMessage: 'Không có dữ liệu!'
                      },
                    }}
                    actions={[
                      {
                        icon: () => { return <Add /> },
                        tooltip: 'Thêm sự kiện',
                        isFreeAction: true,
                        hidden: (localStorage.type !== 'Admin')? true : false,
                        onClick: () => { 
                          this.setState({
                            isOpenAddFundForm: true,
                            typeofDialog: 'fund'
                          })
                        } 
                      },
                      {
                        icon: () => { return <CallMerge />},
                        tooltip: 'Tổng kết quỹ đến hiện tại',
                        isFreeAction: true,
                        hidden: (localStorage.type !== 'Admin')? true : false,
                        onClick: () => {
                          return axios.post('/backend/children-fund/merge-fund')
                            .then(res => {
                              if(res.data.code === 'I001') {
                                this.setState({ isLoadingChildrenFundTable: true })
                                this.getData();
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
                      }
                    ]}
                  />
                  <Typography variant='body2' style={{
                    textAlign: 'left', 
                    fontSize: '12px',
                    paddingTop: '1em'
                  }}>{'Cập nhật: ' + this.state.currentTime}</Typography>
                  <DialogForm 
                    open={this.state.isOpenAddFundForm} 
                    dialogType={this.state.typeofDialog}
                    callback={this.callbackFundTable}
                    func={this.createNewFund}
                    disabled={this.state.isButtonDisabled}
                    style={{color: '#ff9800'}}/>
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <Report 
              icon="Học Tiếng Anh cùng Lời Chúa"
              style={{
                background: 'linear-gradient(to right bottom, #4db6ac, #009688)',
                height: '4em',
                marginBottom: '-2em',
              }}
              children={
                <div style={{marginTop: '2em'}}>
                  <img src={this.state.tumblrImageURL} alt='' className={classes.image} onClick={() => window.open(this.state.tumblrImageURL, '_blank')}/>
                  <div style={{overflowX: 'auto', height: '12em'}} id='content'></div>
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={6}>
            <Report 
              icon='Thông báo/sự kiện từ Xứ Đoàn'
              style={{
                background: 'linear-gradient(to right bottom, #ce93d8, #9c27b0)',
                height: '4em',
                marginBottom: '-2em',
              }}
              children={
                <div style={{marginTop: '2em'}}>
                  <MaterialTable 
                    title = {
                      <div>
                        <Tooltip title="Thêm sự kiện mới">
                        <IconButton  
                          disabled={(localStorage.type !== 'Admin')? true : false} 
                          onClick={() => {
                            this.setState({
                              isOpenAddEventForm: true,
                              typeofDialog: 'event'
                            })
                          }}>
                            <Add /></IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa các sự kiện đã hoàn thành">
                        <IconButton 
                          disabled={(localStorage.type !== 'Admin')? true : false}
                          onClick={() => {
                            return axios.delete('/backend/event/delete-checked')
                              .then(res => {
                              if(res.data.code === 'I001') {
                                this.setState({
                                  childrenTotalCount: 0,
                                  userTotalCount: 0,
                                  childrenFundTotalCount: 0,
                                  internalFundTotalCount: 0,
                                  isLoadingEventTable: true
                                })
                                this.getData();
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
                          }}>
                            <Delete /></IconButton> 
                      </Tooltip>
                      </div>
                    }
                    icons={tableIcons}
                    isLoading={this.state.isLoadingEventTable}
                    data={this.state.events}
                    columns={[
                      {
                        title: 'Ngày',
                        field: 'date',
                      },
                      {
                        title: 'Nội dung',
                        field: 'content',
                        cellStyle: {minWidth: 220}
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
                      maxBodyHeight: '300px',
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
                              if(res.data.code === 'I001') {
                                this.setState({
                                  childrenTotalCount: 0,
                                  userTotalCount: 0,
                                  childrenFundTotalCount: 0,
                                  internalFundTotalCount: 0,
                                  isLoadingEventTable: true
                                })
                                this.getData();
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
                      },
                    ]}
                    components={{
                      Action: props => (
                        <Checkbox 
                          checked={props.data.isChecked}
                          disabled={props.data.isChecked}
                          onChange={(e) => props.action.onClick(e, props.data)}/>
                      )
                    }}
                  />
                  <Typography variant='body2' style={{
                    textAlign: 'left', 
                    fontSize: '12px',
                    paddingTop: '1em'
                  }}>{'Cập nhật: ' + this.state.currentTime}</Typography>
                  <DialogForm 
                    open={this.state.isOpenAddEventForm} 
                    dialogType={this.state.typeofDialog}
                    callback={this.callbackEventTable}
                    func={this.createNewEvent}
                    disabled={this.state.isButtonDisabled}
                    style={{color: '#9c27b0'}}/>
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={6}>
            <Report 
              icon="Tài liệu Xứ Đoàn"
              style={{
                background: 'linear-gradient(to right bottom, #f48fb1, #e91e63)',
                height: '4em',
                marginBottom: '-2em',
              }}
              children={
                <div style={{marginTop: '2em'}}>
                  <MaterialTable
                    title={
                      <Tooltip title="Tải lên">
                        <IconButton 
                          disabled={(localStorage.type !== 'Admin')? true : false}
                          onClick={this.handleUploadClick}
                        ><Publish /></IconButton>
                      </Tooltip>
                    } 
                    icons={tableIcons}
                    data={this.state.documents}
                    isLoading={this.state.isLoaingDocumentTable}
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
                      maxBodyHeight: '300px',
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
                        icon: () => { return <Clear style={{color: 'red'}} /> },
                        tooltip: 'Xóa tài liệu',
                        onClick: (e, rowData) => {

                          return axios.delete(`/backend/document/delete-by-id/${rowData._id}`)
                          .then(res => {
                            if(res.data.code === 'I001') {
                              this.setState({ isLoaingDocumentTable: true})
                              this.getData();
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
                            })
                          })
                        }
                      },
                      {
                        icon: () => { return <GetApp /> },
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
                              }) 
                            })
                        }
                      }
                    ]}
                  />
                  <Typography variant='body2' style={{
                    textAlign: 'left', 
                    fontSize: '12px',
                    paddingTop: '1em'
                  }}>{'Cập nhật: ' + this.state.currentTime}</Typography>
                  <input id="filePicker" type="file" onChange={e => this.createDocument(e)} accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .txt" style={{ 'display': 'none' }} />
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
      </div>
    )
  }
}

export default withStyles(useStyle)(General);