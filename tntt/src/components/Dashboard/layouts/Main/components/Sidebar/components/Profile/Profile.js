import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import { Avatar, Typography, Badge } from '@material-ui/core';
import masterLogo from './logo.png';
import axios from 'axios';

const useStyles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content',
    color: theme.palette.white
  },
  avatar: {
    width: 100,
    height: 100
  },
  name: {
    marginTop: theme.spacing(1)
  },
  badge: {
    marginBottom: '-2em'
  }
});

class Profile extends React.Component {
  constructor(props) {
    super(props)

    this._isMounted = false;

    this.state = {
      fullname: '',
      type:'',
      avatarURL: ''
    }
  }

  componentDidMount = () => {
    this._isMounted = true
    this.getUser();
    this.getUserAvatar();
  }

  componentWillUnmount = () => {
    this._isMounted = false
  }

  formatUserType = (type) => {
    switch(type) {
      case 'root':
        return 'Lâp trình viên';
      case 'Admin':
        return 'Ban điều hành';
      case 'Leader': 
        return 'Trưởng ngành';
      case 'Member':
        return 'Thành viên';
      default:
        return 'Khách';
    }
  }

  getUserAvatar = () => {
    return axios.get(`/backend/user/avatar/by-name/${localStorage.getItem('username')}`, {
      responseType: 'blob'
    })
      .then(res => {
        let data = new Blob([res.data], { type: `${res.headers['content-type']}` })
        let avatarUrl = window.URL.createObjectURL(data) || window.webkitURL.createObjectURL(data);
        if (this._isMounted) {
          this.setState({
            avatarURL: avatarUrl
          })
        }
      })
      .catch(err => {
        if(localStorage.getItem('username') === 'root') {
          console.log('')
        }
      })
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
          localStorage.setItem('currentClass', result.data.data.class)
        }
        localStorage.setItem('type', result.data.data.type);
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
        <Badge badgeContent={<Avatar alt="Person" src={masterLogo} className={classes.badge}/>}>
          <Avatar
          alt="Person"
          className={classes.avatar}
          component={RouterLink}
          src={this.state.avatarURL}
          to="/account"
        />
        </Badge>
        <Typography
          className={classes.name}
          variant="h5"
          align="center"
        >
          {this.state.fullname}
        </Typography>
        <Typography variant="body2" align="center">{this.formatUserType(this.state.type)}</Typography>
      </div>
    );
  }
};

export default withStyles(useStyles)(Profile);
