import React from 'react';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField,
  Grid,
} from '@material-ui/core';
import { Send } from '@material-ui/icons/';
import SnackDialog from '../../../../../SnackerBar';
import CustomHeader from '../../../../../Dashboard/components/CustomHeader/CustomHeader';

const useStyle = (theme) => ({
  root: {
    paddingTop: theme.spacing(2)
  },
  iconInButton: {
    margin: theme.spacing(1)
  },
  customInput: {
    '& label.Mui-focused': { color: '#795548' },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#795548',
      },
    },
  },
})

class Feedback extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      feedbackText: '',

      snackerBarStatus: false,
      snackbarMessage: "",
      snackbarType: "success",
      isButtonClicked: false,

      email: '',
      username: '',
      //for Theme Color
      themeColor: 'linear-gradient(to right bottom, #a1887f, #795548)',
      outlinedThemeColor: '#795548'
    }
  }

  componentDidMount = () => {
    this.props.userdata.then(result => {
      this.setState({
        username: result.data.data.username,
        email: result.data.data.email,
      })
    })
  }

  handleChange = (e, type) => {
    const result = {}
    const data = e.target.value;
    result[type] = data;
    this.setState(result);
  }

  callbackSnackerBarHanlder = (callback) => {
    this.setState({ snackerBarStatus: callback });
  }

  sendFeedback = () => {
    this.setState({isButtonClicked : true})
    const feedbackEmail = {
      email: this.state.email,
      subject: `Phản hồi từ tài khoản: ${this.state.username}/${this.state.email}`,
      text: this.state.feedbackText
    }

    return axios
      .post('/backend/email/send', feedbackEmail)
      .then((result) => {
        if(result.data.code === 'I001') {
          this.setState({
            snackerBarStatus: true,
            snackbarMessage: "Phản hồi đã được gửi thành công, cám ơn sự hợp tác của bạn",
            snackbarType: "success",
            feedbackText: '',
            isButtonClicked: false
          })
        }
      })
      .catch((err) => {
        this.setState({
          snackerBarStatus: true,
          snackbarMessage: "Đã có lỗi xảy ra",
          snackbarType: "error",
          isButtonClicked: false
        })
      })
  }

  render = () => {
    const { classes, className, ...rest } = this.props; 

    return (
      <div className={clsx(classes.root, className)}>
        <CustomHeader style={{
          background: this.state.themeColor,
        }} title="Ý kiến phản hồi" 
          subtitle="Đóng góp ý kiến giúp trang web hoàn thiện hơn"/>
        <Card
          {...rest}
          elevation={5}>
          <form style={{paddingTop: '3em'}}>
            <CardContent>
              <TextField
                className={classes.customInput}
                variant="outlined" 
                multiline
                fullWidth
                rows="2"
                placeholder="Ý kiến của bạn"
                margin="normal"
                value={this.state.feedbackText}
                onChange={e => this.handleChange(e, 'feedbackText')}/>
            </CardContent>
            <Divider />
            <CardActions>
              <Grid container alignItems="flex-start" justify="flex-end" direction="row" spacing={2}>
                <Button 
                  variant="contained"
                  style={{background: this.state.themeColor, color: '#FFFFFF'}}
                  disabled={(this.state.feedbackText !== '' && this.state.isButtonClicked === false)? false : true}
                  onClick={this.sendFeedback}
                  ><Send className={classes.iconInButton} fontSize="small" />Gửi</Button>
              </Grid>
            </CardActions>
          </form>
          <SnackDialog
            variant={this.state.snackbarType}
            message={this.state.snackbarMessage}
            className={this.state.snackbarType}
            callback={this.callbackSnackerBarHanlder}
            open={this.state.snackerBarStatus}
            type={this.state.floatingFormType}
          />
        </Card>
      </div>
    )
  }
}

export default withStyles(useStyle)(Feedback);
