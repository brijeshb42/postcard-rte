<?php

/** @var \Laravel\Lumen\Routing\Router $router */
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;

if(!function_exists('public_path'))
{

  /**
   * Return the path to public dir
   * @param null $path
   * @return string
   */
  function public_path($path=null)
  {
    return rtrim(app()->basePath('public/'.$path), '/');
  }
}

function get_fonts() {
  $response = Http::withHeaders([
    'Accept' => 'application/json'
  ])->get('https://webfonts.googleapis.com/v1/webfonts', [
    'key' => env('FONT_KEY')
  ]);
  return $response->json()['items'];
}

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function() {
  $path = public_path('dist/index.html');
  return file_get_contents($path);
});

$router->get('/api/text/{id:\d+}', function ($id) {
  $row = DB::table('texts')->find($id);
  if ($row === null) {
    return response()->json(['error' => 'Does not exist'], 404);
  }
  return response()->json($row);
});

$router->post('/api/text/', function (Request $request) {
  $text = $request->json()->get('text');
  $config = $request->json()->get('config');
  $id = DB::table('texts')->insertGetId([
    'text'    => $text,
    'config'  => $config,
  ]);
  return response()->json(['id' => $id], 201);
});

$router->patch('/api/text/{id:\d+}', function (Request $request, $id) {
  $text = $request->json()->get('text');
  $config = $request->json()->get('config');
  $res = DB::table('texts')->where('id', $id)->update([
    'text'    => $text,
    'config'  => $config,
  ]);
  return response()->json(['success' => true], 201);
});

function get_or_fetch_fonts() {
  $value = Cache::get('fonts', '');
  if (!empty($value)) {
    return json_decode($value, true);
  }
  $fonts = get_fonts();
  Cache::put('fonts', json_encode($fonts), $seconds = 3600 * 24);
  return $fonts;
}

$router->get('/api/font', function (Request $request) {
  $value = Cache::get('fonts', '');
  $query = $request->query('q');

  if (empty($query)) {
    return response()->json(['result' => []]);
  }

  $fonts = get_or_fetch_fonts();
  $filtered_items = array_filter($fonts, function ($item) use ($query) {
    return str_contains(strtolower($item['family']), strtolower($query));
  });
  return response()->json(['success' => $filtered_items]);
});


$router->get('/api/variant', function(Request $request) {
  $fonts = get_or_fetch_fonts();
  $query = $request->query('font');

  if (empty($query)) {
    return response()->json(['result' => []]);
  }

  foreach ($fonts as $key => $val) {
    if ($val['family'] === $query) {
      $variants = $val['variants'];
      $variants = array_map(function($item) {
        return $item === 'regular' ? '400' : $item;
      }, $variants);
      $variants = array_filter($variants, function ($item) {
        return !preg_match("/[a-z]/i", $item);
      });

      return response()->json(['result' => array_unique($variants)]);
    }
  }

  return response()->json(['result' => []]);
});

