import React from 'react';
import axios from 'axios';
import {
	Paper, Grid, MenuItem, Typography, TextField, Button
} from '@material-ui/core';
import {
	Cached, ClearAll
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';

import CustomHeader from '../../../Dashboard/components/CustomHeader/CustomHeader';
import tableIcons from './tableIcon';

const useStyle = theme => ({
	master: {
		padding: theme.spacing(3)
	},
	root: {
		padding: theme.spacing(2)
	},
	menu: {
		width: 200
	},
  center: {
    justifyContent: 'center',
    display: 'flex'
  }
})

class forDev extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			color500: '#2196f3',
			color300: '#64b5f6',
			subtitle: 'INFO',
			logs: [],
			typeOfLogs: ['INFO', 'DEBUG', 'ERROR'],
			selectedLogType: 'INFO',
			itemPerPage: 50,
			tablePage: 0,
			count: 0,
			isLoading: true
		}
	}

	componentDidMount = () => {
		return this.getLogs(this.state.selectedLogType, this.state.tablePage, this.state.itemPerPage)
	}

	getLogs = (type, page, itemPerPage) => {
		return axios.get(`/backend/log/all/${type}`, {
			params: {
				page: page,
				itemPerPage: itemPerPage
			}
		})
			.then(result => {
				const logs = result.data.data.logs
				const count = result.data.data.length;
				this.setState({ logs: logs, count: count, isLoading: false})
			})
			.catch(err => {
				console.log(err);
			})
	}

	handleChange = (e, type) => {
		const result = {};
    result[type] = e.target.value;
    result['isLoading'] = true;
    this.setState(result);
    if(e.target.value === 'DEBUG') {
    	this.setState({
    		color500: '#ff9800',
    		color300: '#ffb74d'
    	})
    }
    else if(e.target.value === 'ERROR') {
    	this.setState({
    		color500: '#f44336',
    		color300: '#e57373'
    	})
    } else {
      this.setState({
        color500: '#2196f3',
        color300: '#64b5f6',
      })
    }

    return this.getLogs(e.target.value, this.state.tablePage, this.state.itemPerPage);
	}

	handleChangePage = (page) => {
		this.setState({ tablePage: page, isLoading: true})
		return this.getLogs(this.state.selectedLogType, page, this.state.itemPerPage); 
	}

	handleChangeRowsPerPage = (pageSize) => {
		this.setState ({ itemPerPage: pageSize, isLoading: true})
		return this.getLogs(this.state.selectedLogType, this.state.tablePage, pageSize);
	}

	render = () => {
		const { classes } = this.props

		return (
			<Grid container spacing={4} className={classes.master}>
				<Grid item xs={12} md={12} lg={8}>
          <CustomHeader style={{
            background: `linear-gradient(to right bottom, ${this.state.color300}, ${this.state.color500})`,
            marginBottom: '-2em',
            height: '4em',
          }} 
          title='Nhật ký'
          subtitle=''
          innerTitleStyle={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100%'}}
          />
          <Paper elevation={5} className={classes.root}>
            <div style={{marginTop: '2em'}}>
              <MaterialTable 
                title={
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item>
                      <Typography variant="subtitle1">Loại nhật ký:</Typography>
                    </Grid>
                    <Grid item>
                      <TextField
                        select
                        value={this.state.selectedLogType}
                        onChange={e => this.handleChange(e, "selectedLogType")}
                        fullWidth
                        SelectProps={{
                          MenuProps: {
                            className: classes.menu
                          }
                        }}
                      >
                        {this.state.typeOfLogs.map(log => (
                          <MenuItem key={log} value={log}>
                            {log}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                }
                columns={[
                  {
                    title: 'Nội dung',
                    field: 'content'
                  }
                ]}
                onChangePage={(page) => this.handleChangePage(page)}
                onChangeRowsPerPage={pageSize => this.handleChangeRowsPerPage(pageSize)}
                totalCount={this.state.count}
                isLoading={this.state.isLoading}
                options={{
                  search: false,
                  showFirstLastPageButtons: true,
                  pageSizeOptions: [50, 100, 150],
                  pageSize: this.state.itemPerPage,
                  headerStyle: {
                    position: 'sticky',
                    top: 0,
                    color: '#000000',
                    fontSize: 15
                  },
                  maxBodyHeight: '250px',
                  emptyRowsWhenPaging: false,
                }}
                icons={tableIcons}
                data={this.state.logs}
                page={this.state.tablePage}
                localization={{
                  pagination: {
                    previousTooltip: "Trang trước",
                    nextTooltip: "Trang sau",
                    firstTooltip: "Trang đầu",
                    lastTooltip: "Trang cuối",
                    labelRowsSelect: "Dòng"
                  },
                  body: {
                    emptyDataSourceMessage: 'Không có dữ liệu!'
                  },
                }}
                actions={[
                  {
                    icon: () => { return <Cached />},
                    tooltip: 'Cập nhật',
                    isFreeAction: true,
                    onClick: () => {
                      this.setState({ isLoading: true, tablePage: 0, itemPerPage: 50});
                      this.getLogs(this.state.selectedLogType, this.state.tablePage, this.state.itemPerPage)
                    }
                  },
                  {
                    icon: () => { return <ClearAll />},
                    tooltip: 'Xóa nhật ký',
                    isFreeAction: true,
                    onClick : () => {
                      return axios.delete('/backend/log/clear')
                        .then(res => {
                          if(res.data.code === 'I001') {
                            alert('Cleared')
                            this.setState({ isLoading: true, tablePage: 0, itemPerPage: 50});
                            this.getLogs(this.state.selectedLogType, this.state.tablePage, this.state.itemPerPage)
                          }
                        })
                        .catch(err => {
                          alert('Error!')
                        })
                    }
                  }
                ]}
              />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <CustomHeader style={{
              background: 'linear-gradient(to right bottom, #4db6ac, #009688)',
              marginBottom: '-2em',
              height: '4em',
            }}
            title='Cơ sở dữ liệu'
            subtitle=''
            innerTitleStyle={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100%'}}
          />
          <Paper elevation={5} className={classes.root}>
            <div style={{marginTop: '2em'}}>
              <Button  variant='contained' style={{backgroundColor: 'green'}} 
                onClick={() => {
                  return axios.get('/backend/database/backup')
                    .then(res => {
                      if(res.data.code === 'I001') {
                        console.log(res.data.data)
                        alert('successs')
                      }
                    })
                    .catch(err => {
                      alert(err)
                    })
                }}
              >Sao lưu</Button>
              <Button  variant='contained' style={{backgroundColor: 'red'}}>Phục hồi</Button>
            </div>
          </Paper>
        </Grid>
			</Grid>
		)
	}
}

export default withStyles(useStyle)(forDev);