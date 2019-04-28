import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'

const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer
const bookType = ipcRenderer.sendSync('get-bookType')
 
export default class BookInfo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.props.bookInfo,
      ...{
        type: '',
        number: '1',
        master: '',
        titleError: false,
        authorError: false,
        typeError: false,
        numberError: false,
        coverError: false
      }
    }

    this.saveInfo = this.props.saveInfo.bind(this)
  }

  handleChange = name => event => {
    if (this.state[name + 'Error']) {
      this.setState({
        [name + 'Error']: false
      })
    }

    this.setState({
      [name]: event.target.value.trim()
    })
  }

  isBookInfoValid () {
    let errorName = ''
    let doubanImgRe = /https:\/\/.*.doubanio.com\/.*/

    if (this.state.title === '') {
      errorName = 'titleError'
    } else if (this.state.author === '') {
      errorName = 'authorError'
    } else if (this.state.type === '') {
      errorName = 'typeError'
    } else if (isNaN(this.state.number) || this.state.number === '') {
      errorName = 'numberError'
    } else if (!doubanImgRe.test(this.state.cover)) {
      errorName = 'coverError'
    }

    // console.log(errorName)
    if (errorName !== '') {
      this.setState({
        [errorName]: true
      })
      return false
    } else {
      return true
    }
  }
  
  render() {
    return (
      <div id='book-info-form'>
        <div id="book-isbn">{'ISBN: ' + this.state.isbn}</div>
        <TextField 
          id='master'
          label='书主'
          className='short'
          value={this.state.master}
          onChange={this.handleChange('master')}
          margin='normal'
        />
        <TextField 
          id='type'
          label='类型'
          className='short'
          select
          value={this.state.type}
          error={this.state.typeError}
          onChange={this.handleChange('type')}
          margin='normal'
        >
          {bookType.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField 
          id='number'
          label='数量'
          className='short'
          type='number'
          value={this.state.number}
          error={this.state.numberError}
          onChange={this.handleChange('number')}
          margin='normal'
        />
        <TextField
          id='title'
          label='书名'
          className='short'
          value={this.state.title}
          error={this.state.titleError}
          onChange={this.handleChange('title')}
          margin="normal"
        />
        <TextField
          id='author'
          label='作者'
          className='short'
          value={this.state.author}
          error={this.state.authorError}
          onChange={this.handleChange('author')}
          margin="normal"
        />
        <TextField
          id='summary'
          label='简介'
          className='long'
          multiline
          value={this.state.summary}
          onChange={this.handleChange('summary')}
          margin="normal"
        />
        <img src={this.state.cover} alt="封面" referrerPolicy ="never"/>
        <TextField
          id='cover'
          label='封面链接'
          className='long'
          value={this.state.cover}
          error={this.state.coverError}
          onChange={this.handleChange('cover')}
          margin="normal"
        />
        <div id='button-zone'>
          <Button
            variant="outlined"
            onClick={this.saveInfo}
          >
            保存
          </Button>
          <Button
            variant="outlined"
            onClick={this.props.cancel}
          >
            取消
          </Button>
        </div>
      </div>
    )
  }
}