import React from 'react';
import moment from 'moment';
import axios from 'axios';
import AnimatedNumber from 'animated-number-react';
import {
  Grid
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Face, Group, AttachMoney, Help } from '@material-ui/icons';

import Report from './components/Report'

const useStyle = theme => ({
  root: {},
  container: {
    padding: theme.spacing(3),
  },
  icon: {
    width: '2em',
    height: '2em',
  },
})

class General extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      currentTime: moment().format('DD/MM/YYYY'),
      username: localStorage.getItem('username'),
      duration: 300,
      // Report results
      childrenTotalCount: 0,
      userTotalCount: 0,
      revenueTotalCount: 0
    }
  }

  componentDidMount = () => {
    return this.getData();
  }

  formatValue = (value, type) => Number(value).toFixed(0) + ' ' + type;

  getData = () => {
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
      })

  }

  render = () => {
    const { classes } = this.props;

    return (
      <div>
        <Grid container className={classes.container} spacing={4}>
          <Grid item xs={12} sm={3}>
            <Report 
              themeColor='linear-gradient(to right bottom, #7986cb, #3f51b5)'
              icon={<Face className={classes.icon}/>}
              title='Thiếu Nhi'
              subtitle={<AnimatedNumber value={this.state.childrenTotalCount} duration={this.state.duration} formatValue={value => this.formatValue(value, 'em')}/>}
              content={'Cập nhật lần cuối: ' + this.state.currentTime}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Report 
              themeColor='linear-gradient(to right bottom, #f06292, #e91e63)'
              icon={<Group className={classes.icon}/>}
              title='HT/GLV'
              subtitle={<AnimatedNumber value={this.state.userTotalCount} duration={this.state.duration} formatValue={value => this.formatValue(value, 'a/c')}/>}
              content={'Cập nhật lần cuối: ' + this.state.currentTime}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Report 
              themeColor='linear-gradient(to right bottom, #81c784, #4caf50)'
              icon={<AttachMoney className={classes.icon}/>}
              title='Quỹ'
              subtitle={<AnimatedNumber value={this.state.revenueTotalCount} duration={this.state.duration} formatValue={value => this.formatValue(value, 'đ')}/>}
              content={'Cập nhật lần cuối: ' + this.state.currentTime}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Report 
              themeColor='linear-gradient(to right bottom, #ffab91, #ff5722)'
              icon={<Help className={classes.icon}/>}
              title='Empty'
              subtitle='n/a'
              content={'Cập nhật lần cuối: ' + this.state.currentTime}/>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(useStyle)(General);