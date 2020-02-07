import React from 'react';
import {
	Paper
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import CustomHeader from '../../../../Dashboard/components/CustomHeader/CustomHeader';


const useStyle = theme => ({
	root: {
		padding: theme.spacing(2)
	},
})

class Report extends React.Component {
	render = () => {
		const { classes, icon, style, children} = this.props

		return (
			<div>
				<CustomHeader style={style} 
				title={icon}
				subtitle=''
				innerTitleStyle={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100%'}}
				/>
				<Paper elevation={1} className={classes.root}>
					{children}
				</Paper>
			</div>
		)
	}
}

export default withStyles(useStyle)(Report);