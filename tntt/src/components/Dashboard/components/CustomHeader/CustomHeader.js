import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

const useStyle = theme => ({
	root: {
		padding: theme.spacing(1),
		marginLeft: '15px',
		marginRight: '15px',
		marginBottom: '-2em',
		position: 'relative',
		color: theme.palette.white
	},
})

class CustomHeader extends React.Component {
	constructor(props) {
		super(props)

		this.state = {

		};
	}

	render = () => {
		const { classes, style, title, subtitle } = this.props;

		return (
			<Paper style={style} className={classes.root} elevation={5}>
				<Typography variant="h6">{title}</Typography>
				<Typography variant="subtitle2">{subtitle}</Typography>	
			</Paper>
		)
	}
}

export default withStyles(useStyle)(CustomHeader);