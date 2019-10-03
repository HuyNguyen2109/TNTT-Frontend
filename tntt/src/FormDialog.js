import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class FormDialog extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: "",
      email: "",
    }
  }

  handleClose = () => {
    this.props.callback(false);
  };

  handleChange = (e, type) => {
    const data = e.target.value;
    const result = {};
    result[type] = data;
    this.setState(result);
  };

  handleCloseWithSubcribe = () => {
    // Fecth data from TextField
    console.log(this.state.username + '/' + this.state.email)
    // Then fire this action below
    this.props.callback(false);
  }

  render = () => {
    return (
      <Dialog open={this.props.status} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Bạn đã quên mật khẩu của mình?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vui lòng điền email và tên đăng nhập mà bạn đã đăng ký vào biểu mẫu dưới đây.
            Ban quản trị Xứ đoàn sẽ gửi đến bạn email sớm nhất có thể để giúp bạn 
            đăng nhập lại tài khoản của mình
          </DialogContentText>
          <TextField
            margin="dense"
            id="name"
            label="Tên đăng nhập"
            type="username"
            fullWidth
            onChange={e => this.handleChange(e, "username")}
          />
          <TextField
            margin="dense"
            id="name"
            label="Email"
            type="email"
            fullWidth
            onChange={e => this.handleChange(e, "email")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Hủy
          </Button>
          <Button onClick={this.handleCloseWithSubcribe} color="primary">
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default FormDialog;