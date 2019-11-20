import React from 'react';
import {
  withStyles,
} from '@material-ui/core/styles';
import {
  Collapse,
  Tabs,
  Tab
} from '@material-ui/core';

import BasicInformation from './tabs/basicInformation';

const useStyles = theme => ({
  root: {
    flexGrow: 1,
  },
  menu: {
    width: 200,
  },
  formButton: {
    marginTop: theme.spacing(2),
  },
});

class FloatingForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: 0
    }
  }

  a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  handleChangeTab = (e, tab) => {
    this.setState({
      value: tab
    })
  }

  render = () => {
    const { classes, open, type } = this.props;
    return (
      <Collapse in={open} className={classes.root}>
        <Tabs value={this.state.value} onChange={(e, value) => this.handleChangeTab(e, value)}>
          <Tab label="Thông tin chung" {...this.a11yProps(0)} />
          <Tab label="Điểm" {...this.a11yProps(1)} disabled={(type === 'edit')? false : true}/>
        </Tabs>
        <BasicInformation value={this.state.value} index={0} callback={this.props.callback} type={this.props.type}/>
      </Collapse>
    )
  }
};

export default withStyles(useStyles)(FloatingForm);