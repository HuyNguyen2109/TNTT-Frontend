/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { List, ListItem, Button } from '@material-ui/core';

const useStyles = theme => ({
  root: {
  },
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 10,
  },
  button: {
    color: theme.palette.white,
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
  },
  icon: {
    color: theme.palette.white,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.white,
    backgroundColor: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.white
    },
    '&:hover': {
      background: theme.palette.primary.main
    },
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  list: {
    
  }
});

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

class SidebarNav extends React.Component {
  render = () => {
    const { classes, pages, className, ...rest } = this.props;

    return (
      <List
        {...rest}
        className={clsx(classes.root, className)}
      >
        {pages.map(page => (
            <ListItem
              className={classes.item}
              disableGutters
              key={page.title}
            >
              <Button
                activeClassName={classes.active}
                className={classes.button}
                component={CustomRouterLink}
                to={page.href}
              >
                <div className={classes.icon}>{page.icon}</div>
                {page.title}
              </Button>
            </ListItem>
        ))}
      </List>
    );
  }
}

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default withStyles(useStyles)(SidebarNav);
