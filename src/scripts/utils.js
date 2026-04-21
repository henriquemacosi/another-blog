export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString(
    'pt-BR',
    { timeZone: 'UTC' },
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  );
}

export function formatBlogPosts(
  posts,
  {
    filterOutDrafts = true,
    filterOutFuturePosts = true,
    sortByDate = true,
    limit = undefined,
  } = {},
) {
  const filteredPosts = posts.reduce((acc, post) => {
    const { pubDate, draft } = post.data;

    // filterOutDrafts is true
    if (filterOutDrafts && draft) return acc;

    // filterOutFuturePost if true
    if (filterOutFuturePosts && new Date(post.data.pubDate) > new Date())
      return acc;

    // add post to acc
    acc.push(post);

    return acc;
  }, []);

  // sortByDate or randomize
  if (sortByDate) {
    filteredPosts.sort(
      (a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate),
    );
  } else {
    filteredPosts.sort(() => Math.random() - 0.5);
  }

  //  limit if number is passed
  if (typeof limit === 'number') {
    return filteredPosts.slice(0, limit);
  }
  return filteredPosts;
}
