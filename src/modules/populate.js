import {
  TVMAZE_BASE_URL,
  CAP_BASE_URL as INVOLVEMENT_BASE_API,
  APP_KEY as appID,
} from './url_config.js';
import renderPopUp from './comment_pop_up.js';

// ADD LIKE
const addLike = async (showID) => {
  const data = {
    method: 'POST',
    body: JSON.stringify({
      item_id: showID,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  };
  const response = await fetch(`${INVOLVEMENT_BASE_API}/${appID}/likes/`, data);
  return response;
};

// GET LIKE
const getLike = async () => {
  const requestURL = `${INVOLVEMENT_BASE_API}/${appID}/likes/`;
  const request = new Request(requestURL);

  const response = await fetch(request);
  const result = await response.json();

  return result;
};

const generate = async () => {
  const requestURL = TVMAZE_BASE_URL;
  const request = new Request(requestURL);

  const response = await fetch(request);
  const result = await response.json();

  return result;
};

const countNumberOfItems = (newData) => newData.length;

// DISPLAY SHOW COUNT ON HOME PAGE
const showHomeCounter = (newData) => {
  const homeCounter = document.querySelector('.home-counter');
  homeCounter.textContent = `(${countNumberOfItems(newData)})`;
};

const displayShows = async () => {
  const data = await generate();
  const likes = await getLike();

  const container = document.querySelector('.container');
  container.innerHTML = '';
  const newData = data.filter((show) => show.id < 22);

  newData.forEach((show) => {
    const like = likes
      .filter((like) => typeof like.item_id === 'string')
      .filter((like) => like.item_id === `${show.id}`)[0];
    const showCard = `
      <div id=${show.id} class="showCard">
      <img src=${show.image.medium} alt="TVshow thumbnail"/>
      <div class="title">
      <h2>${show.name}</h2>
      <div class="update-likes">
      <i class="fa-regular fa-heart like-button"></i><span class="likes">${
  like ? like.likes : 0
} likes</span>
      </div>
      </div>
      <button class="comment">Comments</button>
      </div>
      `;

    container.innerHTML += showCard;
  });
  showHomeCounter(newData);
};

const displayLikes = () => {
  const likeButtons = document.querySelectorAll('.like-button');

  likeButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      const currentShow = e.path[3];
      const id = currentShow.getAttribute('id');
      await addLike(id);

      const updatLikes = currentShow.children[1].children[1].children[1];
      const likes = await getLike();
      const like = likes
        .filter((like) => typeof like.item_id === 'string')
        .filter((like) => like.item_id === `${id}`)[0];
      updatLikes.textContent = `${like.likes} Likes`;
    });
  });
};

const diplayComments = async () => {
  await generate();

  const commentButtons = document.querySelectorAll('.comment');

  commentButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const currentShow = e.path[1];
      const id = currentShow.getAttribute('id');
      renderPopUp(id);
    });
  });
};

export { displayShows, diplayComments, displayLikes };
