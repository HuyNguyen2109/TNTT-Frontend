import React from 'react';
import {
  withStyles,
} from '@material-ui/core/styles';
import {
  Collapse,
  Tabs,
  Tab,
  Dialog
} from '@material-ui/core';

import BasicInformation from './tabs/basicInformation';
import GradesInformation from './tabs/gradesInformation';

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
  tab: {
    backgroundColor: '#9c27b0',
  },
  tabSelected: {
    "&:hover": {
      color: "#9c27b0",
      opacity: 1
    },
    "&$selected": {
      color: "#9c27b0",
      fontWeight: theme.typography.fontWeightMedium
    },
    "&:focus": {
      color: "#9c27b0"
    }
  }
});

class FloatingForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: 0,
      selectedData: {}
    }
  }

  componentDidUpdate = (prevProps) => {
    if(this.props.type === 'edit' && this.props.selectedData !== prevProps.selectedData) {
      this.setState({
        selectedData: this.props.selectedData
      })
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
        <Tabs value={this.state.value} onChange={(e, value) => this.handleChangeTab(e, value)} classes={{ indicator: classes.tab }}>
          <Tab label="Thông tin chung" {...this.a11yProps(0)} className={classes.tabSelected}/>
          <Tab label="Điểm & Điểm danh" {...this.a11yProps(1)} className={classes.tabSelected} disabled={(type === 'edit')? false : true}/>
        </Tabs>
        <BasicInformation 
          value={this.state.value} 
          index={0} 
          callback={this.props.callback} 
          type={this.props.type} 
          selectedData={this.state.selectedData} 
          updateStatus={this.props.updateStatus} 
          resetSelectedRow={this.props.resetSelectedRow}/>
        <GradesInformation
          value={this.state.value}
          callback={this.props.callback}
          selectedData={this.state.selectedData}
          updateStatus={this.props.updateStatus} 
          resetSelectedRow={this.props.resetSelectedRow}
          type={this.props.type}
          index={1}/>
      </Collapse>
    )
  }
};

export default withStyles(useStyles)(FloatingForm);