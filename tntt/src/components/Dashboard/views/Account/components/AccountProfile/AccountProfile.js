import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
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
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  }
});

class AccountProfile extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      username: '',
      fullname: '',
      type:'',
    };
  };

  componentDidMount = () => {
    console.log('AccountProfile');
  }

  render = () => {
    const { classes, className, ...rest } = this.props;

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
                Nguyen Nhut Huy
              </Typography>
              <Typography
                className={classes.locationText}
                color="textSecondary"
                variant="body1"
              >
                Ho Chi Minh
              </Typography>
              <Typography
                className={classes.dateText}
                color="textSecondary"
                variant="body1"
              >
                {moment().format('hh:mm A')} (Timezone)
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

export default withStyles(useStyles)(AccountProfile);
