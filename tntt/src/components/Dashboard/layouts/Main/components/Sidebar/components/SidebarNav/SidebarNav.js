/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { List, ListItem, Button, colors } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';

const useStyles = theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    variant: 'contained',
    color: theme.palette.white,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.white
    }
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
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
  constructor(props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  expandMenu = () => {
    this.setState({
      open: !this.state.open
    })
  }

  render = () => {
    const { classes, pages, className, ...rest } = this.props;

    return (
      <List
        {...rest}
        className={clsx(classes.root, className)}
      >
        {pages.map(page => (
          (page.title === 'Thiếu Nhi')?
            <React.Fragment key={page.title}>
              <ListItem
                className={classes.item}
                disableGutters
                key={page.title}
              >
                <Button
                  className={classes.button}
                  onClick={this.expandMenu}
                >
                  <div className={classes.icon}>{page.icon}</div>
                  {page.title}
                </Button>
              </ListItem>
              <Collapse in={this.state.open} timeout="auto">
                <List>
                  {pages[0].children.map(child => (
                    <ListItem
                      className={classes.item}
                      disableGutters
                      key={child.title}
                    >
                      <Button
                        activeClassName={classes.active}
                        className={classes.button}
                        component={CustomRouterLink}
                        to={child.href}
                      >
                        <div className={classes.icon} />
                        {child.title}
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
            :
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
