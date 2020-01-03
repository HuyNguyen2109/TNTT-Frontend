import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import {
  Paper,
  Avatar,
  Typography,
  Divider,
  Fab,
} from '@material-ui/core';
import logo from '../AccountProfile/default-user.png';

const useStyles = theme => ({
  root: {
    paddingTop: '7em',
  },
  avatar: {
    width: 130,
    height: 130,
    margin: theme.spacing(1),
    marginBottom: '-3em',
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxShadow: '0 16px 38px -12px rgba(0,0,0,0.56), 0 4px 25px 0px rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.2)'
  },
  content: {
    textAlign: 'center',
    paddingBottom: '2em'
  },
  uploadButton: {
    margin: theme.spacing(1),
    color: theme.palette.white,
  }
});

class AccountProfile extends React.Component {
  constructor(){
    super();

    this.state = {
      holyname: '',
      fullname: '',
      birthday: '1990-01-01',
      holyBirthday: '1990-01-01',
      email: '',
      phoneNumber: '',
      type: '',
      currentTime: '',
      //set default color
      themeColor: 'linear-gradient(to right bottom, #a1887f, #795548)'
    };
  };

  componentDidMount = () => {
    this.displayTime();
    this.props.userdata.then(result => {
      this.setState({
        //for display on website
        fullname: result.data.data.fullname,
        holyname: result.data.data.holyname,
        //for calculating the progress
        birthday: result.data.data.birthday,
        holyBirthday: result.data.data.holy_birthday,
        phoneNumber: result.data.data.phone_number,
        email: result.data.data.email,
        type: result.data.data.type
      })
    })
  };

  displayTime = () => {
    this.setState({
      currentTime: moment().format('hh:mm:ss A')
    })
    setTimeout(this.displayTime, 1000);
  }

  render = () => {
    const { classes, className, ...rest } = this.props;

    return (
      <div align="center" style={{marginTop: '-40px'}}>
        <Avatar className={classes.avatar} src={logo}/>
        <Paper
        {...rest}
        className={clsx(classes.root, className)}
        elevation={5}
        >
          <Typography
            className={classes.locationText}
            color="textSecondary"
            variant="body1"
            style={{paddingBottom: '2em'}}
          >
            {this.state.type}
          </Typography>
          <Typography
            variant="h6"
          >
            {`${this.state.holyname} ${this.state.fullname}`}
          </Typography>
          <Typography
            className={classes.dateText}
            color="textSecondary"
            variant="subtitle1"
            style={{paddingBottom: '1em'}}
          >
            {this.state.currentTime} (+7)
          </Typography>
          <Divider />
          <Fab
            className={classes.uploadButton}
            style={{background: this.state.themeColor}}
            variant="extended"
          >
            Cập nhật ảnh đại diện
          </Fab>
        </Paper>
      </div>
    )
  }
};

AccountProfile.propTypes = {
  className: PropTypes.string
};

export default withStyles(useStyles)(AccountProfile);
