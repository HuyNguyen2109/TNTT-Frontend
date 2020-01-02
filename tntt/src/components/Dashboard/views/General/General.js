import React from 'react';
import moment from 'moment';
import axios from 'axios';
import AnimatedNumber from 'animated-number-react';
import Chart from 'chart.js';
import {
  Grid, Typography, TextField, Button
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Face, Group, AttachMoney, Help, Add, Remove } from '@material-ui/icons';
import MaterialTable from 'material-table';

import tableIcons from './components/tableIcon';
import Report from './components/Report'
import DialogForm from './components/Dialog';

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
              stepSize: 10
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
        }
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
      newClassName: '',
      newClassID: '',
      newClassPath: '',
    }
  }

  componentDidMount = () => {
    return this.getData();
  }

  formatValue = (value, type) => Number(value).toFixed(0) + ' ' + type;

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
        Chart.defaults.global.defaultFontColor = 'white'
        let ctx = document.getElementById('chart');
        let myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: classLabels,
            datasets: [{
                label: 'Sỉ số',
                data: classData,
                backgroundColor: 'rgba(255,255,255,0.9)',
                hoverBackgroundColor: 'rgba(255,255,255,0.9)',
                maxBarThickness: 6
            }]
          },
          options: this.state.barChartOptions
      });
      })
  }

  callbackClassTable = (callback) => {
    this.setState({
      isOpenAddClassForm: callback
    })
  }

  handleNewClassChange = (e) => {
    this.setState=({
      newClassName: e.target.value
    })
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
                      maxBodyHeight: '200px',
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
                        onClick: () => { this.setState({
                          isOpenAddClassForm: true
                        }) } 
                      },
                      {
                        icon: () => { return <Remove style={{color: 'red'}} />},
                        tooltip: 'Xóa',
                        onClick: (e, rowData) => {console.log(rowData)}
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
                    title="Test"
                    children={
                      <div>
                        <TextField 
                          fullWidth
                          label="Tên lớp"
                          value={this.state.newClassName}
                          onChange={this.handleNewClassChange}
                        />
                        <Button variant="contained" style={{backgroundColor: '#2196f3', color: 'white'}}>Xác nhận</Button>
                      </div>
                    } 
                    callback={this.callbackClassTable}/>
                </div>
              }
            />
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(useStyle)(General);