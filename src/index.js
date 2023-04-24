//^ Add imports
// //* Описаний в документації
import SimpleLightbox from 'simplelightbox';
// //* Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import GalleryAPI from './js/GalleryAPI';
import LoadMoreBtn from './js/LoadMoreBtn';

//^ Add consts

const searchFormEL = document.querySelector('#search-form');
const ulEl = document.querySelector('.gallery');
const endText = document.querySelector('.end-text');

const galleryAPI = new GalleryAPI();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

let simpleLightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

//^ Add EventListeners

searchFormEL.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

//^Add Functions

function onSearch(e) {
  e.preventDefault();

  galleryAPI.searchQuery =
    e.currentTarget.elements.searchQuery.value.trim();
  galleryAPI.resetPage();

  if (galleryAPI.searchQuery === '') {
    NoEmptySearch();
   
    searchFormEL.reset();
    return;
  }

  galleryAPI
    .getPopularPhotos()
    .then(data => {
      if (data.totalHits === 0) {
        onError();
        clearGalleryMarkup();
        loadMoreBtn.hide();
        searchFormEL.reset();
      } else {
        endText.classList.add('is-hidden');
        clearGalleryMarkup();

        Notiflix.Notify.success(`Wow! We found ${data.totalHits} images.`);

        renderImageGallery(data.hits);
        simpleLightbox.refresh();
        loadMoreBtn.show();
      }
    })
    .catch(onError)
    .finally(() => searchFormEL.reset());
}

async function onLoadMore() {
  const data = await galleryAPI.getPopularPhotos();
  let totalImages = galleryAPI.perPage * (galleryAPI.page - 1);

  if (data.totalHits <= totalImages) {
    endOfSearch();
    renderImageGallery(data.hits);
    simpleLightbox.refresh();
    loadMoreBtn.hide();

    endText.classList.remove('is-hidden');
  } else {
    loadMoreBtn.disable();
    renderImageGallery(data.hits);

    simpleLightbox.refresh();
    loadMoreBtn.enable();
  }
}

function clearGalleryMarkup() {
  ulEl.innerHTML = '';
}

function NoEmptySearch() {
  Notiflix.Notify.failure(
    'The search string cannot be empty. Please specify your search query.'
  );
}

function onError() {
  Notiflix.Notify.failure(
    'Ooops, there are no images matching your search query. Please try again.'
  );
}

function endOfSearch() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

function renderImageGallery(images) {
  const markup = images
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
        <a class="gallery__item" href=${largeImageURL}>
          <img src=${webformatURL} alt=${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>${likes}
          </p>
          <p class="info-item">
            <b>Views</b>${views}
          </p>
          <p class="info-item">
            <b>Comments</b>${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>${downloads}
          </p>
        </div>
      </div>`
    )
    .join('');

  ulEl.insertAdjacentHTML('beforeend', markup);
}