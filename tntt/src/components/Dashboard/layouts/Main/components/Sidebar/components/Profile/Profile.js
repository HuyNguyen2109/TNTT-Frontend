import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import logo from './default-user.png';
import axios from 'axios';

const useStyles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
});

class Profile extends React.Component {
  constructor(props) {
    super(props)

    this._isMounted = false;

    this.state = {
      fullname: '',
      type:'',
    }
  }

  componentDidMount = () => {
    this._isMounted = true
    this.getUser();
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  getUser = () => {
    axios
      .get(`/backend/user/get-user/${localStorage.getItem('username')}`)
      .then(result => {
        if(this._isMounted) {
          this.setState({
          fullname: result.data.data.fullname,
          type: result.data.data.type
        })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  render = () => {
    const { classes, className, ...rest } = this.props;

    return (
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Avatar
          alt="Person"
          className={classes.avatar}
          component={RouterLink}
          src={logo}
          to="/account"
        />
        <Typography
          className={classes.name}
          variant="h5"
          align="center"
        >
          {this.state.fullname}
        </Typography>
        <Typography variant="body2" align="center">{this.state.type}</Typography>
      </div>
    );
  }
};

export default withStyles(useStyles)(Profile);
