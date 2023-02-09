import { ReplyComment } from 'src/comments/dto/reply-comment.dto';
import { Comment } from '../../comments/dto/create-comment.dto';

export function renderComments(comments: Comment[]): string {
  let commentsHTML = '<h4>Комментарии:</h4>';
  comments.forEach(comment => commentsHTML += renderCommentTemplate(comment));
  return commentsHTML;
}

function renderCommentTemplate(comment: Comment): string {
  return `
    <div>
      <h5 style="color: lightblue;">${comment.author}</h5>
      <p style="font-size: 14px;">${comment.message}</p>
      ${renderCommentReplys(comment)}
      <hr>
    </div>
  `;
}

function renderCommentReplys(comment: Comment): string {
  if (comment.reply.length === 0) {
    return '';
  }
  let html = '';
  comment.reply.forEach(comment => html += renderReplyComment(comment));
  return html;
}

function renderReplyComment(comment: ReplyComment) {
  return `
    <div style="display: flex;">
      <div style="display: flex; align-items: center; justify-content: center; font-size: 25px; padding: 0 20px;">&#10149;</div>
      <div>
        <h5 style="color: lightblue;">${comment.author}</h5>
        <p style="font-size: 14px;">${comment.message}</p>
      </div>
    </div>
  `;
}