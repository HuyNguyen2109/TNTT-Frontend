import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tooltip, IconButton, MenuItem, Grid } from '@material-ui/core'
import { Clear, Check } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import NumberFormat from 'react-number-format';

const useStyles = theme => ({
  menu: {
    width: 30
  },
  customInput: {
    '& label.Mui-focused': { color: '#000000' },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#000000',
    },
  },
  title: {
    color: '#ffffff',
    padding: theme.spacing(2)
  }
})

class NumberFormatCustom extends React.Component {
  render = () => {
    const { inputRef, onChange, ...other } = this.props

    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          onChange({
            target: {
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
        suffix=" đ"
      />
    )
  }
}

class DialogFrom extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      //for Class
      _idClass: '',
      value: '',
      groups: ['Ấu', 'Thiếu', 'Nghĩa', 'Hiệp'],
      selectedGroup: 'Ấu',
      dialogClassTitle: 'Tạo lớp giáo lý mới',
      //for Funds
      _idFund: '',
      date: moment(),
      title: '',
      price: 0,
      chosenFundType: '',
      fundTypes: [
        {
          type: 'Thu'
        },
        {
          type: 'Chi'
        }
      ],
      dialogFundTitle: 'Tạo nội dung thu/chi quỹ mới',
      //for Event
      _idEvent: '',
      event: '',
      dialogEvenTitle: 'Tạo Thông báo/Sự kiện mới'
    }
  }

  componentDidMount = () => {
    this._isMounted = true
  }

  componentDidUpdate = (prevProps) => {
    if(this._isMounted && this.props.dialogAction === 'edit' && JSON.stringify(prevProps.dialogContent) !== JSON.stringify(this.props.dialogContent) && this.props.dialogContent !== '') {
      switch(this.props.dialogType) {
        case 'fund':
          this.setState({
            _idFund: this.props.dialogContent._id,
            date: moment(new Date(this.props.dialogContent.date.split('/')[2], this.props.dialogContent.date.split('/')[1] - 1, this.props.dialogContent.date.split('/')[0])).format(),
            title: this.props.dialogContent.title,
            price: this.reFormatNumber(this.props.dialogContent.price),
            chosenFundType: (Number(this.props.dialogContent.price.replace('tr', '')) > 0 || Number(this.props.dialogContent.price.replace('ng', '')) > 0)? 'Thu' : 'Chi',
            dialogFundTitle: 'Chỉnh sửa nội dung quỹ'
          })
          break;
        case 'class':
          this.setState({
            _idClass: this.props.dialogContent._id,
            value: this.props.dialogContent.Value,
            selectedGroup: this.props.dialogContent.group,
            dialogClassTitle: 'Chỉnh sửa lớp giáo lý'
          })
          break;
        case 'event': 
          this.setState({
            _idEvent: this.props.dialogContent._id,
            date: moment(new Date(this.props.dialogContent.date.split('/')[2], this.props.dialogContent.date.split('/')[1] - 1, this.props.dialogContent.date.split('/')[0])).format(),
            event: this.props.dialogContent.content,
            dialogEvenTitle: 'Chỉnh sửa thông báo'
          })
          break;
        default:
          return null
      }
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  }

  reFormatNumber = (number) => {
    if(number.indexOf('tr') > -1) return Number(number.replace('tr', '')) * 1000000;
    else if(number.indexOf('ng') > -1) return Number(number.replace('tr', '')) * 1000;
    else return Number(number);
  }

  handleFormChange = (e, type) => {
    const result = {};
    let data;
    if (type === "date") {
      data = e;
    }
    else {
      data = e.target.value;
    }
    result[type] = data;
    this.setState(result);
  }

  createNew = () => {
    if (this.props.dialogType === 'class') {
      const classInformation = {
        'group': this.state.selectedGroup,
        'class': this.state.value
      }
      this.props.func(classInformation)
    }
    else if (this.props.dialogType === 'fund') {
      const fundInformation = {
        'date': moment(this.state.date).format('YYYY-MM-DD'),
        'title': this.state.title,
        'price': (this.state.chosenFundType === 'Chi') ? this.state.price * -1 : this.state.price
      }
      this.props.func(fundInformation)
    }
    else {
      const eventInformation = {
        'date': moment(this.state.date).format('YYYY-MM-DD'),
        'content': this.state.event
      }
      this.props.func(eventInformation)
    }
    this.setState({
      value: '',
      date: moment(),
      title: '',
      price: 0,
      event: ''
    })
  }

  editData = () => {
    switch(this.props.dialogType){
      case 'fund':
        let editedFund = {
          '_id': this.state._idFund,
          'date': moment(this.state.date).format('YYYY-MM-DD'),
          'title': this.state.title,
          'price': (this.state.chosenFundType === 'Chi') ? this.state.price * -1 : this.state.price
        }
        return this.props.editFunc(editedFund)
      case 'class':
        let editedClass = {
          '_id': this.state._idClass,
          'group': this.state.selectedGroup,
          'class': this.state.value
        }
        return this.props.editFunc(editedClass)
      case 'event':
        let editedEvent = {
          '_id': this.state._idEvent,
          'date': moment(this.state.date).format('YYYY-MM-DD'),
          'content': this.state.event
        }
        return this.props.editFunc(editedEvent)
      default:
        return null
    }
  }

  handleClose = () => {
    this.props.callback(false)
    this.setState({
      value: '',
      date: moment(),
      title: '',
      price: 0,
    })
    this.props.resetSelectedRow('')
  }

  render = () => {
    const { classes, open, dialogType, style } = this.props

    return (
      <Dialog open={open} onClose={this.handleClose}>
        {(dialogType === 'class') ?
          <div>
            <DialogTitle className={classes.title} style={{ backgroundColor: style.color }}>{this.state.dialogClassTitle}</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={4}>
                  <TextField
                    className={classes.customInput}
                    fullWidth
                    autoFocus
                    select
                    margin='none'
                    label='Ngành'
                    value={this.state.selectedGroup}
                    onChange={e => this.handleFormChange(e, 'selectedGroup')}
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu
                      }
                    }}
                  >
                    {this.state.groups.map(group => (
                      <MenuItem key={group} value={group}>
                        {group}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} lg={8}>
                  <TextField
                    className={classes.customInput}
                    fullWidth
                    autoFocus
                    margin='none'
                    label='Tên lớp'
                    value={this.state.value}
                    onChange={e => this.handleFormChange(e, 'value')}
                  />
                </Grid>
              </Grid>
            </DialogContent>
          </div>
          :
          (dialogType === 'fund') ?
            <div>
              <DialogTitle className={classes.title} style={{ backgroundColor: style.color }}>{this.state.dialogFundTitle}</DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        className={classes.customInput}
                        fullWidth
                        format="dd/MM/yyyy"
                        label="Ngày"
                        margin='none'
                        value={this.state.date}
                        onChange={e => this.handleFormChange(e, "date")}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }} />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12} lg={3}>
                    <TextField
                      className={classes.customInput}
                      select
                      label="Loại chi tiêu"
                      margin='none'
                      value={this.state.chosenFundType}
                      onChange={e => this.handleFormChange(e, "chosenFundType")}
                      fullWidth
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu
                        }
                      }}
                    >
                      {this.state.fundTypes.map(fundType => (
                        <MenuItem key={fundType.type} value={fundType.type}>
                          {fundType.type}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} lg={5}>
                    <TextField
                      className={classes.customInput}
                      fullWidth
                      label='Số tiền'
                      margin='none'
                      value={this.state.price}
                      onChange={e => this.handleFormChange(e, 'price')}
                      InputProps={{
                        inputComponent: NumberFormatCustom
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className={classes.customInput}
                      fullWidth
                      autoFocus
                      multiline
                      rows={5}
                      rowsMax={10}
                      label='Nội dung'
                      margin='none'
                      placeholder='Nhập nội dung'
                      value={this.state.title}
                      onChange={e => this.handleFormChange(e, 'title')}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
            </div> :
            <div>
              <DialogTitle className={classes.title} style={{ backgroundColor: style.color }}>{this.state.dialogEvenTitle}</DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        className={classes.customInput}
                        fullWidth
                        format="dd/MM/yyyy"
                        label="Ngày"
                        margin='none'
                        value={this.state.date}
                        onChange={e => this.handleFormChange(e, "date")}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }} />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12} lg={8}>
                    <TextField
                      className={classes.customInput}
                      fullWidth
                      autoFocus
                      label='Nội dung'
                      margin='none'
                      value={this.state.event}
                      onChange={e => this.handleFormChange(e, 'event')}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
            </div>}
        <DialogActions>
          <Tooltip title="Hủy bỏ">
            <IconButton disabled={this.props.disabled} onClick={this.handleClose}><Clear /></IconButton>
          </Tooltip>
          <Tooltip title="Xác nhận">
            {this.props.dialogAction === 'create'?
            (
              <IconButton disabled={this.props.disabled} onClick={this.createNew} id="confirmButton"><Check style={style} /></IconButton>
            ) : (
              <IconButton disabled={this.props.disabled} onClick={this.editData} id="confirmButton"><Check style={style} /></IconButton>
            )}
          </Tooltip>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(useStyles)(DialogFrom);