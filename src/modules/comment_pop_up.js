import { TVMAZE_BASE_URL, CAP_BASE_URL, APP_KEY } from './url_config.js';

const getTvShowInfo = async (id) => {
  const response = await fetch(`${TVMAZE_BASE_URL}/${id}`);
  const data = await response.json().catch((err) => err);
  return data;
};

const getComments = async (id) => {
  const response = await fetch(
    `${CAP_BASE_URL}/${APP_KEY}/comments?item_id=${id}`,
  );
  const data = await response.json().catch((err) => [err]);
  return data;
};

const displayComments = (comments, container) => {
  if (comments.length > 0) {
    Object.keys(comments).forEach((key) => {
      container.innerHTML += `
      <h5>${comments[key].creation_date} &nbsp; &nbsp; ${comments[key].username} &nbsp; :  &nbsp; ${comments[key].comment}</h5>`;
    });
  }
};

const refreshComments = (numComCtn, container, id) => {
  getComments(id).then((comments) => {
    numComCtn.innerHTML = comments.length;
    container.innerHTML = '';
    comments.forEach((comment) => {
      container.innerHTML += `
        <h5>${comment.creation_date} &nbsp; &nbsp; ${comment.username} &nbsp; :  &nbsp; ${comment.comment}</h5>`;
    });
  });
};

const createComment = async (id, userName, message) => {
  const userPost = {
    item_id: id,
    username: userName,
    comment: message,
  };
  const response = await fetch(`${CAP_BASE_URL}/${APP_KEY}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userPost),
  });
  const data = await response.json().catch((err) => err);
  return data;
};

const constructTvShowInfoDOM = (tvShow, comments) => {
  const popUpCtn = document.getElementById('ctn-tv-info-window');
  const main = document.querySelector('main');
  const nav = document.querySelector('nav');
  const body = document.querySelector('body');
  body.style.overflow = 'hidden';
  main.classList.add('blur');
  nav.classList.add('blur');
  popUpCtn.classList.add('show');
  popUpCtn.innerHTML = '';
  const showInfoDiv = `
        <div class="ctn-tv-info">
            <div class="ctn-icn">
            <i class="fa-solid fa-xmark fa-xl"></i>
            </div>
            <div class="ctn-img">
                <img class="popup-img" src="${tvShow.image.original}" alt="tvshow_preview">
            </div>
            <h3 class="tvshow-name">${tvShow.name}</h3>
            <div class="tvshow_info">
                <h5 class="tvshow_item">Type : <span>${tvShow.type}</span></h5>
                <h5 class="tvshow_item">Languages : <span>${tvShow.language}</span></h5>
                <h5 class="tvshow_item">Duration : <span>${tvShow.runtime}</span></h5>
                <h5 class="tvshow_item">Genre : <span>${tvShow.genres}</span></h5>
            </div>
            <div class="ctn-comment">
                <div class="ctn-comments-head">
                    <h3 class="comments-head">Comments (<span class="num-comment">${comments.length}</span>) </h3>
                </div>
                <div class="comment-list"></div>
            </div>
            <h3 class="add-comment">Add a comment</h3>
            <form class="comment-form" action="${CAP_BASE_URL}/${APP_KEY}/comments" method="post">
                <input class="name-area" type="text" name="name" id="name" required>
                <textarea class="comment-area" type="text" name="comment" id="comment" required></textarea>
                <input class="sub-button" type="submit" name="Comment">
                <span id="progres-text" class="progres-text">Submitting...</span>
            </form>
        </div>`;

  popUpCtn.innerHTML += showInfoDiv;

  const sd = popUpCtn.querySelector('.ctn-icn');
  const commentList = popUpCtn.querySelector('.comment-list');
  const numComment = popUpCtn.querySelector('.num-comment');
  const progres = popUpCtn.querySelector('.progres-text');

  const nameField = popUpCtn.querySelector('.name-area');
  const commentField = popUpCtn.querySelector('.comment-area');
  const submitButton = popUpCtn.querySelector('form');
  const sButton = popUpCtn.querySelector('.sub-button');

  submitButton.addEventListener('submit', async (e) => {
    e.preventDefault();
    progres.style.display = 'block';
    sButton.style.display = 'none';
    await createComment(tvShow.id, nameField.value, commentField.value);
    nameField.value = '';
    commentField.value = '';
    refreshComments(numComment, commentList, tvShow.id);
    progres.style.display = 'none';
    sButton.style.display = 'block';
  });

  displayComments(comments, commentList);

  sd.addEventListener('click', () => {
    body.style.overflow = 'auto';
    main.classList.remove('blur');
    nav.classList.remove('blur');
    popUpCtn.classList.remove('show');
  });
};

const renderPopUp = (id) => {
  Promise.all([getTvShowInfo(id), getComments(id)]).then((data) => {
    if (data[1].error) {
      constructTvShowInfoDOM(data[0], []);
    } else {
      constructTvShowInfoDOM(data[0], data[1]);
    }
  });
};

export default renderPopUp;
