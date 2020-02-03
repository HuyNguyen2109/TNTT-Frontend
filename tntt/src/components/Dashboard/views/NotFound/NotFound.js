import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import backgroundImage from '../../../../img/99840.jpg';
import { withStyles } from '@material-ui/core/styles';

const useStyles = (theme) => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    paddingTop: 150,
    textAlign: 'center'
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  },
  bg: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%'
  },
})

class NotFound extends React.Component {
  backtoMain = () => {
    return this.props.history.goBack();
  }

  render = () => {
    const { classes } = this.props;

    return (
      <div className={classes.bg}>
        <div className={classes.root}>
          <Grid
            container
            justify="center"
            spacing={4}
          >
            <Grid
              item
              lg={6}
              xs={12}
            >
              <div className={classes.content}>
                <Typography variant="h1">
                  404: Trang bạn đang tìm kiếm hiện không tồn tại
                </Typography>
                <Typography variant="subtitle2" style={{color: 'white'}}>
                  Bạn được chuyển đến trang này do sai đường dẫn hoặc lỗi mạng.
                  Vì bất kì lí do gì, xin tải lại trang hoặc dùng thanh điều hướng trình duyệt
                </Typography>
                <Button color="primary" variant="contained" style={{ marginTop: '3em' }} onClick={this.backtoMain}>Quay lại trang chủ</Button>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(NotFound);
