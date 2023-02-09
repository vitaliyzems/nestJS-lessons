import { News } from 'src/news/dto/create-news.dto';
import { renderComments } from '../comments/comments';

export function renderOneNews(news: News): string {
  let commentsHTML = '<h4>Нет комментариев</h4>';
  if (news.comments && news.comments.length !== 0) {
    commentsHTML = renderComments(news.comments);
  }
  return `
    <div>
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h1>${news.title}</h1>
          <span style="color: lightblue;">${news.author}</span>
        </div>
        <img src="${news.image}" alt="...">
      </div>
      <p>${news.description}</p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
        Molestiae ipsa repudiandae temporibus autem sint provident eaque! 
        Impedit sequi quam fugit expedita necessitatibus quos nam nostrum laboriosam aut soluta molestias nesciunt dolorem, 
        cumque distinctio perspiciatis reprehenderit explicabo quaerat debitis totam inventore consectetur vero numquam eveniet rerum! 
        Sint adipisci reprehenderit illum repellat!
      </p>
      <hr>
      ${commentsHTML}
    </div>
  `;
}