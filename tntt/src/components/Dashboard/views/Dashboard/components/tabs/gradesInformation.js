import React from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import {
  withStyles,
} from '@material-ui/core/styles';
import {
  Grid,
  Button,
  Paper,
  TextField,
  MenuItem
} from '@material-ui/core';
import {
  Add,
  Delete,
  Cancel,
  Update,
} from '@material-ui/icons/';

import tableIcons from '../tableIcon';

const useStyles = (theme) => ({
  root: {
    margin: theme.spacing(4),
  },
  gradeTypeMenu: {
    width: 200
  },
  formButton: {
    marginTop: theme.spacing(2),
  },
})

class GradesInformation extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      grades: [],
      grade: {
        'key': Math.random(),
        'title': '',
        'point': 0
      },
      isAddClicked: false,
      //for TableData
      gradeColumn: [
        {
          title: 'Lọai điểm',
          field: 'title'
        },
        {
          title: 'Điểm',
          field: 'point'
        }
      ],
    };
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.type === 'edit' && JSON.stringify(prevProps.selectedData) !== JSON.stringify(this.props.selectedData)) {
      const name = this.props.selectedData.name
      
      return axios
        .get(`/backend/children/grade/by-name/${name}`)
        .then(result => {
          const gradesArr = result.data.data;
          gradesArr.forEach(grade => {
            delete grade.key;
          });
          this.setState({
            grades: gradesArr
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  handleCloseFloatingForm = () => {
    this.setState({
      grades: []
    })
    this.props.callback(false);
    this.props.resetSelectedRow('');
  }

  render = () => {
    const { classes, value, index } = this.props;

    return (
      <div
        key="basic"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpabel-${index}`}
        aria-labelledby={`simple-tab-${index}`}>
        <MaterialTable
          title="Bảng điểm chi tiết"
          icons={tableIcons}
          columns={this.state.gradeColumn}
          data={this.state.grades}
          options={{
            showFirstLastPageButtons: false,
            paging: false,
            search: false,
            sorting: false,
            headerStyle: {
              position: 'sticky',
              top: 0,
              fontSize: 14,
            },
            emptyRowsWhenPaging: false,
          }}
          localization={{
            body: {
              emptyDataSourceMessage: 'Không có dữ liệu!'
            },
          }}
        />
        <Grid container alignItems="flex-start" justify="flex-end" direction="row">
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.formButton}
            style={{ marginRight: '1em' }}
            onClick={this.updateData}
          ><Update className={classes.iconInButton} fontSize="small" />Cập nhật</Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            className={classes.formButton}
            onClick={this.handleCloseFloatingForm}>
            <Cancel className={classes.iconInButton} fontSize="small" />Hủy bỏ</Button>
        </Grid>
      </div>
    )
  };
};

export default withStyles(useStyles)(GradesInformation);