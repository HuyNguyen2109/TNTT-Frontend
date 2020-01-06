import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tooltip, IconButton, MenuItem } from '@material-ui/core'
import { Clear, Check } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const useStyles = theme => ({
	// root: {
	// 	[theme.breakpoints.down('md')]: {
	// 		width: 'auto',
	// 		height: 'auto'
	// 	}
	// },
	menu: {
    width: 50
  }
})

class DialogFrom extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			//for Class
			value: '',
			//for Funds
			date: moment(),
			title: '',
			price: 0,
			chosenFundType: '',
			fundTypes: [
				{
					type: 'Thu'
				},
				{
					type: 'Chi'
				}
			],
		}
	}

	handleFormChange = (e, type) => {
    const result = {};
    let data;
    if (type === "date") {
      data = e;
    }
    else {
      data = e.target.value;
    }
    result[type] = data;
    this.setState(result);
  }

  createNew = () => {
  	if(this.props.dialogType === 'class') {
  		this.props.func(this.state.value)
  	}
  	else if(this.props.dialogType === 'fund') {
  		const fundInformation = {
  			'date': moment(this.state.date).format('YYYY-MM-DD'),
  			'title': this.state.title,
  			'price': (this.state.chosenFundType === 'Chi')? this.state.price * -1 : this.state.price
  		}
  		this.props.func(fundInformation)
  	}
  	this.setState({
			value:'',
			date: moment(),
			title: '',
			price: 0,
		})
  }

	handleClose = () => {
		this.setState({
			value:'',
			date: moment(),
			title: '',
			price: 0,
		})
		this.props.callback(false)
	}

	render = () => {
		const { classes, open, dialogType, style } = this.props

		return (
			<Dialog open={open} onClose={this.handleClose} className={classes.root}>
				{(dialogType === 'class')? 
					<div>
						<DialogTitle>Tạo lớp giáo lý mới</DialogTitle>
						<DialogContent>
							<TextField 
		            fullWidth
		            autoFocus
		            label='Tên lớp'
		            value={this.state.value}
		            onChange={e => this.handleFormChange(e, 'value')}
		         />
						</DialogContent>		
					</div>
			  : 
					<div>
						<DialogTitle>Tạo nội dung thu/chi quỹ mới</DialogTitle>
						<DialogContent>
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDatePicker
                fullWidth
                format="dd/MM/yyyy"
                label="Ngày"
                value={this.state.date}
                onChange={e => this.handleFormChange(e, "date")}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }} />
							</MuiPickersUtilsProvider>
							<TextField 
		            fullWidth
		            autoFocus
		            label='Nội dung'
		            value={this.state.title}
		            onChange={e => this.handleFormChange(e, 'title')}
			         />
			        <TextField
	              select
	              label="Loại chi tiêu"
	              value={this.state.chosenFundType}
	              onChange={e => this.handleFormChange(e, "chosenFundType")}
	              fullWidth
	              SelectProps={{
	                MenuProps: {
	                  className: classes.menu
	                }
	              }}
	            >
	              {this.state.fundTypes.map(fundType => (
	                <MenuItem key={fundType.type} value={fundType.type}>
	                  {fundType.type}
	                </MenuItem>
	              ))}
	            </TextField>
	            <TextField 
		            fullWidth
		            autoFocus
		            label='Số tiền'
		            value={this.state.price}
		            onChange={e => this.handleFormChange(e, 'price')}
			         />
						</DialogContent>
					</div>}
			  <DialogActions>
					<Tooltip title="Hủy bỏ">
            <IconButton disabled={this.props.disabled} onClick={this.handleClose}><Clear /></IconButton>
          </Tooltip>
          <Tooltip title="Xác nhận">
            <IconButton disabled={this.props.disabled} onClick={this.createNew}><Check style={style}/></IconButton>
          </Tooltip> 
				</DialogActions>
			</Dialog>
		)
	}
}

export default withStyles(useStyles)(DialogFrom);