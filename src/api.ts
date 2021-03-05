const BASE_URL = process.env.NODE_ENV === 'development' ? '//localhost:8000/api' : '/api';

function getUrl(path: string) {
  return `${BASE_URL}${path}`;
}

function wrapFetch(fetchCall: Promise<Response>) {
  return fetchCall
  .then((resp: Response) => {
    if (resp.status >= 400) {
      throw new Error(resp.status.toString());
    }
    return resp.json();
  });
}

export function saveText(data: any, id?: string | number) {
  const config: RequestInit = {
    method: !id ? 'POST' : 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    mode: 'cors',
  };

  const url = !id ? getUrl('/text/') : getUrl(`/text/${id}`);
  return wrapFetch(fetch(url, config));
}

export function getText(id: string | number) {
  return wrapFetch(fetch(getUrl(`/text/${id}`)));
}

export function queryFont(query: string) {
  return wrapFetch(fetch(getUrl(`/font?q=${query}`)));
}

export function getVariantsForFont(font: string) {
  return wrapFetch(fetch(getUrl(`/variant?font=${font}`)));
}

