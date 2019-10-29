import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { Profile, SidebarNav } from './components';

const useStyles = theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
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

    }
  }

  render = () => {
    const { classes, open, variant, onClose, className, ...rest} = this.props;
    const pages = [
      {
        title: 'Thiếu Nhi',
        icon: <DashboardIcon />,
        children: [
          {
            title: 'item1',
            href: '/dashboard'
          },
          {
            title: 'item2',
            href: '#'
          },
          {
            title: 'item3',
            href: '#'
          },
          {
            title: 'item4',
            href: '#'
          }
        ]
      },
      {
        title: 'Danh sách GLV',
        href: '/users',
        icon: <PeopleIcon />
      },
      {
        title: 'Tài khoản của bạn',
        href: '/account',
        icon: <AccountBoxIcon />
      }
    ];

    return (
      <Drawer
        anchor="left"
        classes={{ paper: classes.drawer }}
        onClose={onClose}
        open={open}
        variant={variant}
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
          />
        </div>
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
