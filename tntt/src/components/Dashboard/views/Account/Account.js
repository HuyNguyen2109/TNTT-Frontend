import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios';

import { AccountProfile, AccountDetails, Password, Feedback } from './components';

const useStyles = theme => ({
  root: {
    padding: theme.spacing(3)
  }
});


class Account extends React.Component {
  getUser = () => {
    return axios.get(`/backend/user/get-user/${localStorage.getItem('username')}`)
  }

  render = () => {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            lg={4}
            md={6}
            xl={4}
            xs={12}
          >
            <AccountProfile userdata={this.getUser()} />
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xl={8}
            xs={12}
          >
            <AccountDetails userdata={this.getUser()}/>
            <Password />
            <Feedback userdata={this.getUser()}/>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(useStyles)(Account);
