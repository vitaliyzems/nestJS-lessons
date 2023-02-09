import { News } from 'src/news/dto/create-news.dto';

export function renderAllNews(newsArr: News[]): string {
  let html = '';
  newsArr.forEach(news => html += renredNewsBlock(news));
  return `
    <h1 style="padding: 10px 20px">Список новостей</h1>
    <div class="row" style="padding: 10px 20px">${html}</div>
  `;
}

function renredNewsBlock(news: News): string {
  return `
    <div class="col-lg-4 mb-2">
      <div class="card" style="width: 100%;">
    ${news.image
      ? `<img src="${news.image}" style="height: 150px; object-fit: cover" class="card-img-top" alt="...">`
      : ''
    }
        <div class="card-body">
          <h5 class="card-title">${news.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${news.author}</h6>
          <p class="card-text">${news.description}</p>
          <a href="/news/views/${news.id}" class="btn btn-primary">Перейти к новости</a>
        </div>
      </div>
    </div>
  `;
}