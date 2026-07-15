/* ========================================
   Search Index Generator
   生成 db.json 用于搜索功能
   ======================================== */

hexo.extend.generator.register('search-index', function() {
  const posts = this.locals.get('posts').toArray();

  const searchData = posts.map(post => ({
    title: post.title,
    path: post.path,
    content: post.content ? post.content.replace(/<[^>]+>/g, '').substring(0, 2000) : '',
    tags: post.tags ? post.tags.map(t => t.name) : [],
    categories: post.categories ? post.categories.map(c => c.name) : [],
    date: post.date.format('YYYY-MM-DD')
  }));

  return {
    path: 'db.json',
    data: JSON.stringify({ posts: searchData })
  };
});
