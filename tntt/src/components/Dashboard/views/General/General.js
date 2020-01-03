import React from 'react';
import moment from 'moment';
import axios from 'axios';
import AnimatedNumber from 'animated-number-react';
import Chart from 'chart.js';
import {
  Grid, Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Face, Group, AttachMoney, Help, Add, Remove } from '@material-ui/icons';
import MaterialTable from 'material-table';

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
  }
})

class General extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      currentTime: moment().format('DD/MM/YYYY hh:mm:ss'),
      username: localStorage.getItem('username'),
      duration: 300,
      // Report results
      childrenTotalCount: 0,
      userTotalCount: 0,
      childrenFundTotalCount: 0,
      internalFundTotalCount: 0,
      // option for Bar chart
      barChartOptions: {
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
            }
          }],
          xAxes: [{
            gridLines: {
              drawOnChartArea: false,
              display: false,
            },
          }]
        },
        title: {
          display: true,
          text: 'Số lượng thiếu nhi theo lớp',
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
      // for snackBar
      snackbarMessage: '',
      snackbarType: 'success',
      snackerBarStatus: false
    }
  }

  componentDidMount = () => {
    return this.getData();
  }

  formatValue = (value, type) => Number(value).toFixed(0) + ' ' + type;

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

  getData = () => {
    let classLabels = [];
    let classData = [];

    return axios
      .get('/backend/children/count', {
          params: {
            condition: 'all'
          }
        })
      .then(count => {
        this.setState({
          childrenTotalCount: count.data.data
        });

        return axios.get('backend/user/all')
      })
      .then(users => {
        const count = users.data.data.length;
        this.setState({
          userTotalCount: count
        });

        return axios.get('/backend/class/all')
      })
      .then(classes => {
        const axiosRequests = [];
        let classesArr = classes.data.data;
        classesArr = classesArr.filter(el => el.Value !== "Chung");
        classesArr.forEach(classEl => {
          classLabels.push(classEl.ID);
          axiosRequests.push(axios
          .get('/backend/children/count', {
            params: {
              condition: classEl.ID
            }
          }))
        })
        this.setState({
          classes: classesArr
        })

        return axios.all(axiosRequests);
      })
      .then((responseArr) => {
        responseArr.forEach(res => {
          classData.push(res.data.data)
        })
        let myChart;
        Chart.defaults.global.defaultFontColor = 'white'
        let ctx = document.getElementById('chart');
        ctx.innerHTML = '';
        myChart = new Chart(ctx, {
          type: 'bar',
          responsive: true,
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
  }

  createNewClass = (className) => {
    this.setState({ isButtonDisabled: true })
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

  callbackClassTable = (callback) => {
    this.setState({
      isOpenAddClassForm: callback
    })
  }

  callbackSnackerBarHanlder = (callback) => {
    this.setState({ snackerBarStatus: callback });
  }

  render = () => {
    const { classes } = this.props;

    return (
      <div>
        <Grid container className={classes.container} spacing={4}>
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={4}>
            <Report 
              icon={<canvas id='chart'/>}
              style={{
                background: 'linear-gradient(to right bottom, #64b5f6, #2196f3)',
                marginBottom: '-8em',
                height: '10em',
              }}
              children={
                <div style={{marginTop: '8em'}}>
                  <MaterialTable 
                    title="Danh sách lớp"
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
                      maxBodyHeight: '150px',
                    }}
                    localization={{
                      header: {
                        actions: ''
                      }
                    }}
                    actions={[
                      {
                        icon: () => { return <Add /> },
                        tooltip: 'Thêm lớp',
                        isFreeAction: true,
                        hidden: (localStorage.type !== 'Admin')? true : false,
                        onClick: () => { this.setState({
                          isOpenAddClassForm: true
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
                    title="Tạo lớp giáo lý mới"
                    label="Tên lớp"
                    callback={this.callbackClassTable}
                    func={this.createNewClass}
                    disabled={this.state.isButtonDisabled}/>
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