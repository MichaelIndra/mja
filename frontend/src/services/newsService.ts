// import { EArticleType, INewsArticle } from '../types';

// class NewsService {
//   getArticlesByType(articleType: EArticleType): Promise<INewsArticle[]> {
//     return fetch('/data/articles.json')
//       .then((response) => {
//         return response.json();
//       })
//       .then((serverArticles) => {
//         const newsArticles = serverArticles
//           .filter(
//             (serverArticle: any) => serverArticle.articleType === articleType,
//           )
//           .map(this.map);

//         return newsArticles;
//       });
//   }

//   getFavorites(): Promise<INewsArticle[]> {
//     return fetch('/data/articles.json')
//       .then((response) => {
//         return response.json();
//       })
//       .then((serverArticles) => {
//         const newsArticles = serverArticles
//           .filter((serverArticle: any) => serverArticle.isFavourite === true)
//           .map(this.map);

//         return newsArticles;
//       });
//   }

//   private map(serverArticle: any): INewsArticle {
//     return {
//       id: serverArticle.id,
//       title: serverArticle.title,
//       content: serverArticle.content,
//       dateString: serverArticle.dateString,
//       baseImageName: serverArticle.baseImageName,
//       articleType: serverArticle.articleType,
//       isFavourite: serverArticle.isFavourite,
//     } as INewsArticle;
//   }
// }

// export default new NewsService();
