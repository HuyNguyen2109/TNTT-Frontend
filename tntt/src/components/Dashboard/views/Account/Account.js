import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axios from 'axios';

import { AccountProfile, AccountDetails } from './components';

const useStyles = theme => ({
  root: {
    padding: theme.spacing(4)
  }
});


class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      holyname: '',
      fullname: '',
      birthday: '',
      holyBirthday: '',
      phoneNumber: '',
      class: '',
      password: '',
      type: '',
      email: ''
    };
  }

  componentDidMount = () => {
    this.getUser();
    console.log(this.state.fullname);
  }

  getUser = () => {
    axios
      .get(`/backend/user/get-user/${localStorage.getItem('username')}`)
      .then(result => {
        console.log(result)
        this.setState({
          fullname: result.data.data.fullname,
          type: result.data.data.type
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render = () => {
    const classes = this.props;

    return (
      <div className={classes.root} style={{padding: 35}}>
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
            <AccountProfile />
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xl={8}
            xs={12}
          >
            <AccountDetails />
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(useStyles)(Account);
