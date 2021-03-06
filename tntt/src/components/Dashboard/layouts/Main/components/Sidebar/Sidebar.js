import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { Divider, Drawer, Typography } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import CodeIcon from '@material-ui/icons/Code';
import {
  Face
} from '@material-ui/icons'
import { Profile, SidebarNav } from './components';
import backgroundImage from '../../../../../../img/December.jpg';

const useStyles = theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('sm')]: {
      width: 240,
      flexShrink: 0,
    },
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
    marginTop: 0,
    zIndex: "4",
  },
  background: {
    position: "absolute",
    zIndex: "1",
    height: "100%",
    width: "100%",
    display: "block",
    top: "0",
    left: "0",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    "&:after": {
      position: "absolute",
      zIndex: "3",
      width: "100%",
      height: "100%",
      content: '""',
      display: "block",
      background: '#000000',
      opacity: ".8"
    }
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
});

class Sidebar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      classes: []
    };
  }

  render = () => {
    const { classes, open, variant, onClose, className, callback, ...rest} = this.props;
    const pages = [
      {
        title: 'Số liệu chung',
        icon: <DashboardIcon />,
        href: '/general',
      },
      {
        title: 'Thiếu Nhi',
        icon: <Face />,
        href: '/children',
      },
      {
        title: 'Huynh trưởng/GLV',
        href: '/users',
        icon: <PeopleIcon />
      },
      {
        title: 'Tài khoản của bạn',
        href: '/account',
        icon: <AccountBoxIcon />
      },
      {
        title: 'Dành cho Dev',
        href: '/for-dev',
        icon: <CodeIcon />
      }
    ];

    return (
      <Drawer
        anchor="left"
        classes={{ paper: classes.drawer }}
        onClose={onClose}
        open={open}
        variant={variant}
        elevation={10}
      >
        <div
          {...rest}
          className={clsx(classes.root, className)}
        >
          <Profile />
          <Divider className={classes.divider} />
          <SidebarNav
            className={classes.nav}
            pages={pages}
            callback={val => {callback(val)}}
            style={{'overflow': 'auto'}}
          />
          <div style={{flexGrow: 1}}/>
          <Typography variant="caption" color="primary" style={{display: 'flex', justifyContent: 'center'}}>Ứng dụng web v0.0.1</Typography>
        </div>
        <div className={classes.background} style={{ backgroundImage: "url(" + backgroundImage + ")" }} />
      </Drawer>
    );
  }

  
}

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default withStyles(useStyles)(Sidebar);
