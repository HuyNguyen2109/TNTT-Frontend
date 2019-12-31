import React from 'react';
import {
	Typography, Paper
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import CustomHeader from '../../../../Dashboard/components/CustomHeader/CustomHeader';


const useStyle = theme => ({
	root: {
		height: '120px',
		padding: theme.spacing(2)
	},
})

class Report extends React.Component {
	render = () => {
		const { classes, icon, themeColor, title, subtitle, content} = this.props

		return (
			<div>
				<CustomHeader style={{
					background: themeColor,
					width: '6em',
					height: '6em',
					marginBottom: '-4em',
				}} 
				title={icon}
				subtitle=''
				innerTitleStyle={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100%'}}
				/>
				<Paper elevation={5} className={classes.root}>
					<Typography variant='subtitle2' style={{
						textAlign: 'right'
					}}>{title}</Typography>
					<Typography variant='h4' style={{
						textAlign: 'right'
					}}>{subtitle}</Typography>
					<Typography variant='body2' style={{
						textAlign: 'left', 
						fontSize: '12px',
						paddingTop: '1em'
					}}>{content}</Typography>
				</Paper>
			</div>
		)
	}
}

export default withStyles(useStyle)(Report);