const BASE_URL = process.env.NODE_ENV === 'development' ? '//localhost:8000/api' : '/api';

function getUrl(path: string) {
  return `${BASE_URL}${path}`;
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
  return fetch(url, config)
    .then((resp: Response) => {
      if (resp.status >= 400) {
        throw new Error(resp.status.toString());
      }
      return resp.json();
    });
}

export function getText(id: string | number) {
  return fetch(getUrl(`/text/${id}`))
    .then((resp: Response) => {
      if (resp.status >= 400) {
        throw new Error(resp.status.toString());
      }
      return resp.json();
    });
}

