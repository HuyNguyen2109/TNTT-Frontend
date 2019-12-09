import React from 'react';
import { withStyles } from '@material-ui/styles';
import {
  Paper,
  Grid,

} from '@material-ui/core'

const useStyles = (theme) => ({
  root: {
    padding: theme.spacing(4),
    width: '100%'
  },
  content: {
    marginTop: theme.spacing(1),
    overflow: 'auto',
    maxHeight: 750
  }
});

class UserList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      windowHeight: 0,
      windowWidth: 0,
    };
  }

  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener('resize',this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions = () => {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth
    })
  }

  render = () => {
    const { classes } = this.props;

    return (
      <div className={(this.state.windowWidth < 500)? {padding: 0, width: '100%'} : classes.root}>
        <Paper className={classes.root}>
          <div className={classes.content}>
            aaa
          </div>
        </Paper>
      </div>
    )
  }
}

export default withStyles(useStyles)(UserList);
