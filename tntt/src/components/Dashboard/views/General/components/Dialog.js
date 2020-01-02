import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, Grid } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

const useStyles = theme => ({
	root: {
		padding: theme.spacing(5)
	}
})

class DialogFrom extends React.Component {
	constructor(props) {
		super(props)
	}

	handleClose = () => {
		this.props.callback(false)
	}

	render = () => {
		const { classes, open, title, children, callback } = this.props

		return (
			<Dialog open={open} onClose={this.handleClose} className={classes.root}>
				<DialogTitle>
					<Typography variant="subtitle1">{title}</Typography>
					<div style={{flexGrow: 1}} />
					<IconButton onClick={this.handleClose}><Clear /></IconButton>
				</DialogTitle>
				<DialogContent>{children}</DialogContent>
			</Dialog>
		)
	}
}

export default withStyles(useStyles)(DialogFrom);