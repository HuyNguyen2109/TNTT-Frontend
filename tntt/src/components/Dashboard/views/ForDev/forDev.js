import React from 'react';
import axios from 'axios';
import {
  Paper, Grid, MenuItem, Typography, TextField, Button, Avatar, Toolbar, Tooltip, IconButton, LinearProgress, CircularProgress
} from '@material-ui/core';
import {
  Cached, ClearAll, Clear, Check
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import CustomHeader from '../../../Dashboard/components/CustomHeader/CustomHeader';
import SnackDialog from '../../../SnackerBar';

const useStyle = theme => ({
  master: {
    padding: theme.spacing(3)
  },
  root: {
    padding: theme.spacing(2)
  },
  menu: {
    width: 200
  },
  button: {
    margin: theme.spacing(1)
  },
  avatar: {
    width: 80,
    height: 80,
    margin: theme.spacing(3),
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 16px 38px -12px rgba(0,0,0,0.56), 0 4px 25px 0px rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.2)'
  },
  circleProgress: {
    position: 'absolute',
    zIndex: 2,
  }
})

class forDev extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      color500: '#2196f3',
      color300: '#64b5f6',
      subtitle: 'INFO',
      logs: [],
      typeOfLogs: ['INFO', 'DEBUG', 'ERROR'],
      selectedLogType: 'INFO',
      // for snackBar
      snackbarMessage: '',
      snackbarType: 'success',
      snackerBarStatus: false,
      isLoading: true,
      isBackup: false,
      isRestore: false,
    }
  }

  componentDidMount = () => {
    return this.getLogs(this.state.selectedLogType)
  }

  getLogs = (type) => {
    return axios.get(`/backend/log/all/${type}`)
      .then(result => {
        const logsArr = result.data.data.logs
        this.setState({ logs: logsArr, isLoading: false })
      })
      .catch(err => {
        console.log(err);
      })
  }

  handleChange = (e, type) => {
    const result = {};
    result[type] = e.target.value;
    result['isLoading'] = true;
    this.setState(result);
    if (e.target.value === 'DEBUG') {
      this.setState({
        color500: '#ff9800',
        color300: '#ffb74d'
      })
    }
    else if (e.target.value === 'ERROR') {
      this.setState({
        color500: '#f44336',
        color300: '#e57373'
      })
    } else {
      this.setState({
        color500: '#2196f3',
        color300: '#64b5f6',
      })
    }

    return this.getLogs(e.target.value);
  }

  callbackSnackerBarHanlder = (callback) => {
    this.setState({ snackerBarStatus: callback });
  }

  render = () => {
    const { classes } = this.props

    return (
      <Grid container spacing={4} className={classes.master}>
        <Grid item xs={12} md={12} lg={8}>
          <CustomHeader style={{
            background: `linear-gradient(to right bottom, ${this.state.color300}, ${this.state.color500})`,
            marginBottom: '-2em',
            height: '4em',
          }}
            title='Nhật ký'
            subtitle=''
            innerTitleStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
          />
          <Paper elevation={5} className={classes.root}>
            <div style={{ marginTop: '2em' }}>
              <Toolbar>
                <Grid container spacing={1} alignItems="flex-end">
                  <Grid item>
                    <Typography variant="subtitle1">Loại nhật ký:</Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      select
                      value={this.state.selectedLogType}
                      onChange={e => this.handleChange(e, "selectedLogType")}
                      fullWidth
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu
                        }
                      }}
                    >
                      {this.state.typeOfLogs.map(log => (
                        <MenuItem key={log} value={log}>
                          {log}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
                <div style={{flexGrow: 1}}></div>
                <Tooltip title="Cập nhật">
                  <IconButton onClick={() => {
                    this.setState({ isLoading: true })
                    this.getLogs(this.state.selectedLogType)
                  }}><Cached /></IconButton>
                </Tooltip>
                <Tooltip title="Xóa nhật ký">
                  <IconButton onClick={() => {
                    return axios.delete('/backend/log/clear')
                    .then(res => {
                      if (res.data.code === 'I001') {
                        this.setState({
                          snackerBarStatus: true,
                          snackbarType: 'success',
                          snackbarMessage: 'Xóa nhật ký thành công',
                        });
                        this.getLogs(this.state.selectedLogType, this.state.tablePage, this.state.itemPerPage)

                      }
                    })
                    .catch(err => {
                      this.setState({
                        snackerBarStatus: true,
                        snackbarType: 'error',
                        snackbarMessage: 'Lỗi',
                      });
                    })
                  }}><ClearAll /></IconButton>
                </Tooltip>
              </Toolbar>
              <Typography variant="subtitle1">Nội dung nhật ký</Typography>
              {(this.state.isLoading)? <LinearProgress style={{backgroundColor: this.state.color500}}/> : null}
              <Paper style={{height: '40em'}}>
                <div style={{overflowY: 'auto', height: '100%'}}>
                  {(this.state.logs.length !== 0)? this.state.logs.map(line => (<p>{line}</p>)) : null}
                </div>
              </Paper>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <CustomHeader style={{
            background: 'linear-gradient(to right bottom, #4db6ac, #009688)',
            marginBottom: '-2em',
            height: '4em',
          }}
            title='Cơ sở dữ liệu'
            subtitle=''
            innerTitleStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
          />
          <Paper elevation={5} className={classes.root}>
            <div style={{ marginTop: '2em' }} align="center">
              <Avatar className={classes.avatar}>
                {(this.state.isBackup)? 
                  <Clear fontSize='large' style={{color: 'red', position: 'relative'}} /> :
                  <Check fontSize='large' style={{color: 'green', position: 'relative'}} />
                }
                {(this.state.isBackup)? <CircularProgress size={90} className={classes.circleProgress}/>: null}
              </Avatar>
              <Typography variant="subtitle1">Cơ sở dữ liệu hiện chưa được sao lưu</Typography>
              <Button variant='contained' style={{ background: 'linear-gradient(to right bottom, #81c784, #4caf50)', color: 'white' }} className={classes.button}
                onClick={() => {
                  return axios.get('/backend/database/backup')
                    .then(res => {
                      if (res.data.code === 'I001') {
                        this.setState({
                          snackerBarStatus: true,
                          snackbarType: 'success',
                          snackbarMessage: 'Sao lưu thành công',
                          isBackup: !this.state.isBackup
                        })
                      }
                    })
                    .catch(err => {
                      this.setState({
                        snackerBarStatus: true,
                        snackbarType: 'error',
                        snackbarMessage: 'Lỗi',
                      })
                    })
                }}>Sao lưu</Button>
              <Button variant='contained' style={{ background: 'linear-gradient(to right bottom, #e57373, #f44336)', color: 'white' }} className={classes.button}
                >Phục hồi</Button>
            </div>
          </Paper>
        </Grid>
        <SnackDialog
          variant={this.state.snackbarType}
          message={this.state.snackbarMessage}
          className={this.state.snackbarType}
          callback={this.callbackSnackerBarHanlder}
          open={this.state.snackerBarStatus}
        />
      </Grid>
    )
  }
}

export default withStyles(useStyle)(forDev);