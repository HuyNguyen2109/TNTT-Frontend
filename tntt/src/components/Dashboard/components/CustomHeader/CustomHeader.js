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
		color: theme.palette.white,
	},
})

class CustomHeader extends React.Component {
	constructor(props) {
		super(props)

		this.state = {

		};
	}

	render = () => {
		const { classes, style, innerTitleStyle, innerSubtitleStyle, title, subtitle } = this.props;

		return (
			<Paper style={style} className={classes.root} elevation={5}>
				<Typography variant="h6" style={innerTitleStyle}>{title}</Typography>
				{(subtitle === '')? null : <Typography variant="subtitle2" style={innerSubtitleStyle}>{subtitle}</Typography>}	
			</Paper>
		)
	}
}

export default withStyles(useStyle)(CustomHeader);