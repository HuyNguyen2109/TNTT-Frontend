import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';

const useStyles = (theme) => ({
  root: {}
});

class AccountDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      holyname: '',
      fullname: '',
      birthday: '',
      holyBirthday: '',
      phoneNumber: '',
      class: '',
      email: '',
    };
  }


  componentDidMount = () => {
    this.props.userdata.then(result => {
      this.setState({
        username: result.data.data.username,
        holyname: result.data.data.holyname,
        birthday: result.data.data.birthday,
        holyBirthday: result.data.data.holy_birthday,
        phoneNumber: result.data.data.phone_number,
        class: result.data.data.class,
        email: result.data.data.email
      })
    })
  }

  handleChange = (e, type) => {
    let data;
    data = e.target.value
    const result = {};
    result[type] = data;
    this.setState(result);
  }

  render = () => {
    const { classes, userdata, className, ...rest } = this.props;

    return (
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form
          autoComplete="off"
          noValidate
        >
          <CardHeader
            subheader="The information can be edited"
            title="Profile"
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={12}
                xs={12}
              >
                <TextField
                  disabled={true}
                  fullWidth
                  label="Tên tài khoản"
                  margin="dense"
                  name="username"
                  required
                  value={this.state.username}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Tên thánh"
                  margin="dense"
                  name="holyName"
                  onChange={e=>this.handleChange(e, "holyname")}
                  required
                  value={this.state.holyname}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Email"
                  margin="dense"
                  name="email"
                  onChange={e=>this.handleChange(e, "email")}
                  required
                  value={this.state.email}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  margin="dense"
                  name="phone"
                  required
                  onChange={e=>this.handleChange(e, "phoneNumber")}
                  value={this.state.phoneNumber}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Sinh Nhật"
                  margin="dense"
                  name="birthday"
                  onChange={e=>this.handleChange(e, "birthday")}
                  required
                  type="date"
                  value={this.state.birthday}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Bổn mạng"
                  margin="dense"
                  name="holyBirthday"
                  onChange={e=>this.handleChange(e, "holyBirthday")}
                  required
                  type="date"
                  value={this.state.holyBirthday}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  disabled={true}
                  fullWidth
                  label="Lớp"
                  margin="dense"
                  name="class"
                  required
                  value={this.state.class}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              variant="contained"
            >
              Save details
        </Button>
          </CardActions>
        </form>
      </Card>
    );
  };
};

export default withStyles(useStyles)(AccountDetails);
