<?php

/** @var \Laravel\Lumen\Routing\Router $router */
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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

