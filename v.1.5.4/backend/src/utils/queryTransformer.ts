import { OPERATORS } from './constants';

export function convertQuery(query: any) {
    if (query) {
      query = query.replace(/%7C%7C/g, '||').replace(/%2C/g, ',');
      const splitQuery = query.split('&');
      const queries: any = {
        page: null,
        per_page: null,
        cache: 0,
        sort: [],
        join: [],
        filters: [],
      };
      for (const text of splitQuery) {
        const tmp = text.split('=');
        if (tmp[0] === 'sort' || tmp[0] === 'join') {
          queries[tmp[0]].push(tmp[1]);
        } else if (tmp[0].includes('filter')) {
          const tmpSplit = tmp[1].split('||');
          const operators: any = OPERATORS;
          const field = tmpSplit[0];
          let operator;
          let value;
          if (operators[tmpSplit[1]]) {
            operator = operators[tmpSplit[1]];
          } else {
            return Promise.reject({ statusCode: 400, message: `Operator ${tmpSplit[1]} tidak didukung.` });
          }
          if (operator === 'LIKE') {
            value = `%${tmpSplit[2]}%`;
          } else {
            value = tmpSplit[2];
          }
          if (value === 'true') {
            value = 1;
          } else if (value === 'false') {
            value = 0;
          }
          queries.filters.push({
            field,
            operator,
            value,
          });
        } else if (tmp[0] === 'page' || tmp[0] === 'per_page' || tmp[0] === 'cache') {
          queries[tmp[0]] = Number(tmp[1]);
        } else {
          queries[tmp[0]] = tmp[1];
        }
      }
      return queries;
    } else {
      return null;
    }
  }
