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
  constructor() {
    super();

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

  handleChange = () => {
    console.log("aaa")
  }

  render = () => {
    const classes = this.props;
    const { className, ...rest } = this.props;

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
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="First name"
                  margin="dense"
                  name="firstName"
                  onChange={this.handleChange}
                  required
                  value="{values.firstName}"
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
                  label="Last name"
                  margin="dense"
                  name="lastName"
                  onChange={this.handleChange}
                  required
                  value="{values.lastName}"
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
                  label="Email Address"
                  margin="dense"
                  name="email"
                  onChange={this.handleChange}
                  required
                  value="{values.email}"
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
                  label="Phone Number"
                  margin="dense"
                  name="phone"
                  onChange={this.handleChange}
                  type="number"
                  value="{values.phone}"
                  variant="outlined"
                />
              </Grid>
              {/* <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Select State"
                  margin="dense"
                  name="state"
                  onChange={this.handleChange}
                  required
                  select
                  // eslint-disable-next-line react/jsx-sort-props
                  SelectProps={{ native: true }}
                  value="{values.state}"
                  variant="outlined"
                >
                  {states.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid> */}
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Country"
                  margin="dense"
                  name="country"
                  onChange={this.handleChange}
                  required
                  value="{values.country}"
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
