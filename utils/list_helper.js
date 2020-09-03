const dummy = (blogs) => {
  return 1;
};


const totalLikes = (blogpostList) => {
  let totalLikesCount = 0;

  for (let i = 0; i < blogpostList.length; i++) {
    totalLikesCount += blogpostList[i].likes;
  }

  return totalLikesCount;
};


const favoriteBlog = (blogpostList) => {

  let currentLikes = 0;
  let mostLikes = 0;

  for (let i = 0; i < blogpostList.length; i++) {
    currentLikes = blogpostList[i].likes
    if (currentLikes > mostLikes) {
      mostLikes = currentLikes
    }
  }

  for (let i = 0; i < blogpostList.length; i++) {
    if (blogpostList[i].likes === mostLikes) {
      return blogpostList[i];
    }
  }


}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
