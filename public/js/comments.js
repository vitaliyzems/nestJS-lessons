('use strict');
const e = React.createElement;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      message: '',
      editableId: null,
      editedMessage: ''
    };
    // Парсим URL, извлекаем id новости
    this.idNews = parseInt(window.location.href.split('/').reverse()[0]);
    const bearerToken = Cookies.get('authorization');
    // Указываем адрес сокет сервера
    this.socket = io('http://localhost:3000', {
      query: {
        newsId: this.idNews
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: 'Bearer' + bearerToken
          }
        }
      }
    });
  }
  componentDidMount() {
    this.getAllComments();
    // Указываем комнату
    // this.socket.emit('create', this.idNews.toString());
    // Подписываемся на событие появления нового комментария
    this.socket.on('newComment', (message) => {
      const comments = this.state.comments;
      comments.push(message);
      this.setState(comments);
    });
    this.socket.on('removeComment', (payload) => {
      const { id } = payload;
      const comments = this.state.comments.filter(comment => comment.id !== id);
      this.setState({ comments });
    })
    this.socket.on('editComment', (payload) => {
      const { comment } = payload;
      const findedCommentIdx = this.state.comments.findIndex(c => c.id === comment.id);
      const comments = [...this.state.comments];
      comments[findedCommentIdx] = comment;
      this.setState({ comments });
    })
  }

  async getAllComments() {
    const response = await fetch(`http://localhost:3000/comment/all/${this.idNews}`);
    if (response.ok) {
      const comments = await response.json();
      this.setState({ comments })
    }
  }

  onChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  sendMessage = () => {
    if (!this.state.message) {
      return;
    }
    // Отправляем на сервер событие добавления комментария
    this.socket.emit('addComment', {
      newsId: this.idNews,
      message: this.state.message,
    });
    this.setState({ message: '' });
  };

  getEditForm = (comment) => {
    this.setState({ editableId: comment.id, editedMessage: comment.message });
  }

  editComment = async (event, id) => {
    event.preventDefault();
    if (!this.state.editedMessage) {
      alert('Поле не может быть пустым');
      return;
    }
    const data = { message: this.state.editedMessage };
    await fetch(`http://localhost:3000/comment/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    this.setState({ editableId: null, editedMessage: '' });
  }

  removeComment = async (id) => {
    await fetch(`http://localhost:3000/comment/${id}`, {
      method: 'DELETE'
    })
  };


  render() {
    const userId = parseInt(getCookie('id'));
    const role = getCookie('role');
    return (
      <>
        {
          this.state.comments.length === 0 && <div>Комментариев пока нет</div>
        }
        <div>
          {this.state.comments.map((comment, index) => {
            return (
              <div key={comment + index} className="card mb-1">
                <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{comment.author.firstName}</strong>
                    {
                      this.state.editableId === comment.id ?
                        (
                          <form onSubmit={(event) => this.editComment(event, comment.id)}>
                            <input
                              type="text"
                              name="editedMessage"
                              value={this.state.editedMessage}
                              onChange={this.onChange}
                            ></input>
                            <input type="submit" value="Изменить"></input>
                          </form>
                        )
                        :
                        (
                          <div>{comment.message}</div>
                        )
                    }
                  </div>
                  <div>
                    {
                      comment.author && comment.author.id == userId && (
                        <button
                          onClick={() => this.getEditForm(comment)}
                          style={{ height: '30px', padding: '0 5px', border: 'none', fontWeight: 'bold', marginRight: '10px' }}
                        >
                          Редактировать
                        </button>
                      )
                    }
                    {
                      comment.author && (role == 'admin' || comment.author.id == userId) && (
                        <button
                          onClick={() => this.removeComment(comment.id)}
                          style={{ width: '30px', height: '30px', border: 'none', color: 'red', fontWeight: 'bold' }}
                        >
                          &times;
                        </button>
                      )
                    }
                  </div>
                </div>
              </div>
            );
          })}
          <hr />
          <div>
            <div className="form-floating mb-1">
              <textarea
                className="form-control"
                placeholder="Leave a comment here"
                value={this.state.message}
                name="message"
                onChange={this.onChange}
                style={{ resize: 'none' }}
              ></textarea>
              <label htmlFor="floatingmessagearea2">Комментарий</label>
            </div>
            <button
              onClick={this.sendMessage}
              className="btn btn-outline-info btn-sm px-4 me-sm-3 fw-bold mt-2"
            >
              Send
            </button>
          </div>
        </div>
      </>
    );
  }
}

// Указываем блок с id = app, куда скрипт произведёт вставку вёрстке в методе render
const domContainer = document.querySelector('#app');
ReactDOM.render(e(Comments), domContainer);