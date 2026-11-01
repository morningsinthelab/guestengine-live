"""Verify the actual nginx container: python scripts/cutover-http.test.py [http://127.0.0.1:3126]."""
import concurrent.futures
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:3126'
ROOT = Path(__file__).resolve().parent.parent

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None

opener = urllib.request.build_opener(NoRedirect())
def get(path):
    try:
        response = opener.open(BASE + path, timeout=15)
    except urllib.error.HTTPError as error:
        response = error
    return response.status, response.headers, response.read().decode()

routes = json.loads((ROOT / 'docs/legacy-guest-urls.json').read_text())
def check_guest(route):
    path = urlparse(route['from']).path
    status, headers, body = get(path)
    assert status == 200, (path, status)
    assert headers['Link'] == '<' + route['to'] + '>; rel="canonical"', path
    assert 'href="' + route['to'] + '"' in body, path
    assert '__GUEST_' not in body, path
    assert headers['Cache-Control'] == 'no-store', path
    for old, new in [('.md', '/profile.md'), ('.json', '/data.json'), ('/transcript/', '/transcript')]:
        status, headers, _ = get(path + old + '?ref=test')
        assert status == 301 and headers['Location'] == route['to'] + new + '#', (path + old, status, headers.get('Location'))

with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    list(pool.map(check_guest, routes))
for path in ['/directory', '/directory/', '/directory/all', '/directory/all/', '/directory/index.html', '/directory/all/index.html']:
    status, headers, _ = get(path)
    assert status == 301 and headers['Location'] == 'https://mornings.network/shows/center-stage/guests#', path
_, headers, _ = get('/directory/all/?q=Jesse+Levey&segment=center-stage&topic=Business&token=do-not-forward')
assert headers['Location'] == 'https://mornings.network/shows/center-stage/guests?q=Jesse+Levey&topic=Business&segment=center-stage#'
status, headers, body = get('/manage/profile/aj-zagglin')
assert status == 200 and headers['X-Robots-Tag'] == 'noindex, nofollow'
assert headers['Link'] == '<https://mornings.network/shows/center-stage/guests/aj-zeglen>; rel="canonical"'
assert 'content="https://mornings.network/shows/center-stage/guests/aj-zeglen"' in body
assert get('/profile/unmapped-guest')[0] == 200
assert get('/guest-profile-bridge')[0] == 404
assert get('/.git/config')[0] == 404
print(f'Passed {len(routes)} HTML bridges and {len(routes) * 3} export redirects, directory filters, owner metadata and unmapped fallback.')
