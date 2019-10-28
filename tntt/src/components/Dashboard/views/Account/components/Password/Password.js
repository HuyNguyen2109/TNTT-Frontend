import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField,
  Grid
} from '@material-ui/core';

const useStyles = () => ({
  root: {}
});

class Password extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  }

  handleChange = (e, type) => {
    let data;
    data = e.target.value
    const result = {};
    result[type] = data;
    this.setState(result);
  }

  render = () => {
    const { classes, className, ...rest } = this.props;

    return (
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form>
          <CardHeader
            subheader="Update password"
            title="Password"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={12} xs={12}>
                <TextField
                  fullWidth
                  label="Mật khẩu hiện tại"
                  name="currentPassword"
                  onChange={e => this.handleChange(e, "currentPassword")}
                  type="password"
                  value={this.state.currentPassword}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField
                  fullWidth
                  label="Mật khẩu mới"
                  name="newPassword"
                  onChange={e => this.handleChange(e, "newPassword")}
                  type="password"
                  value={this.state.newPassword}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField
                  fullWidth
                  label="Xác nhận lại mật khẩu mới "
                  name="confirmPassword"
                  onChange={e => this.handleChange(e, "confirmPassword")}
                  type="password"
                  value={this.state.confirmPassword}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              variant="outlined"
            >
              Update
          </Button>
          </CardActions>
        </form>
      </Card>
    );
  }
}

Password.propTypes = {
  className: PropTypes.string
};

export default withStyles(useStyles)(Password);
