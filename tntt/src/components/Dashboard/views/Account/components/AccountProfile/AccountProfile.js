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
  Grid,
} from '@material-ui/core';
import logo from '../AccountProfile/default-user.png';

const useStyles = theme => ({
  root: {},
  avatar: {
    width: 153,
    height: 153,
    margin: theme.spacing(1)
  },
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
                {this.state.currentTime} (+7)
              </Typography>
            </div>
            <Grid container alignItems="flex-start" justify="flex-end" direction="row" spacing={2}>
              <Avatar className={classes.avatar} src={logo}/>
            </Grid>
          </div>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            className={classes.uploadButton}
            color="primary"
            variant="text"
          >
            Cập nhật ảnh đại diện
          </Button>
          <Button variant="text">Xóa ảnh đại diện</Button>
        </CardActions>
      </Card>
    )
  }
};

AccountProfile.propTypes = {
  className: PropTypes.string
};

export default withStyles(useStyles)(AccountProfile);
