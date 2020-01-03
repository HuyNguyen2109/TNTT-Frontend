import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tooltip, IconButton } from '@material-ui/core'
import { Clear, Check } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

const useStyles = theme => ({
	root: {
		[theme.breakpoints.down('md')]: {
			width: 'auto',
			height: 'auto'
		}
	},
})

class DialogFrom extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			value: ''
		}
	}

	handleFormChange = (e, type) => {
    const result = {};
    let data = e.target.value;
    result[type] = data;
    this.setState(result);
  }

  createNew = () => {
  	this.props.func(this.state.value)
  	this.setState({
  		value: ''
  	})
  }

	handleClose = () => {
		this.setState({
			value:''
		})
		this.props.callback(false)
	}

	render = () => {
		const { classes, open, title, label } = this.props

		return (
			<Dialog open={open} onClose={this.handleClose} className={classes.root}>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					<TextField 
            fullWidth
            label={label}
            value={this.state.value}
            onChange={e => this.handleFormChange(e, 'value')}
          />
				</DialogContent>
				<DialogActions>
					<Tooltip title="Hủy bỏ">
            <IconButton disabled={this.props.disabled} onClick={this.handleClose}><Clear /></IconButton>
          </Tooltip>
          <Tooltip title="Xác nhận">
            <IconButton disabled={this.props.disabled} onClick={this.createNew}><Check style={{color: '#2196f3'}}/></IconButton>
          </Tooltip> 
				</DialogActions>
			</Dialog>
		)
	}
}

export default withStyles(useStyles)(DialogFrom);