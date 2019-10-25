import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
  LinearProgress
} from '@material-ui/core';
import logo from '../AccountProfile/default-user.png';

const useStyles = theme => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
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
    };
  };

  componentDidMount = () => {
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
  }

  render = () => {
    const { classes } = this.props; 
    const { className, ...rest } = this.props;

    return (
      <Card
      {...rest}
      className={clsx(classes.root, className)}
      >
        <CardContent>
          <div className={classes.details}>
            <div>
              <Typography
                gutterBottom
                variant="h4"
              >
                {`${this.state.holyname} ${this.state.fullname}`}
              </Typography>
              <Typography
                className={classes.locationText}
                color="textSecondary"
                variant="body1"
              >
                {this.state.type}
              </Typography>
              <Typography
                className={classes.dateText}
                color="textSecondary"
                variant="body1"
              >
                {moment().format('hh:mm A')} (+7)
              </Typography>
            </div>
            <Avatar
              className={classes.avatar}
              src={logo}
            />
          </div>
          <div className={classes.progress}>
            <Typography variant="body1">Profile Completeness: 70%</Typography>
            <LinearProgress
              value={70}
              variant="determinate"
            />
          </div>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            className={classes.uploadButton}
            color="primary"
            variant="text"
          >
            Upload picture
          </Button>
          <Button variant="text">Remove picture</Button>
        </CardActions>
      </Card>
    )
  }
};

AccountProfile.propTypes = {
  className: PropTypes.string
};

export default withStyles(useStyles)(AccountProfile);
