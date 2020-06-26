<?php  
  function get_proxy_site_page( $url )
  {
    $options = [
      CURLOPT_RETURNTRANSFER => true,     // return web page
      CURLOPT_HEADER         => true,     // return headers
      CURLOPT_FOLLOWLOCATION => true,     // follow redirects
      CURLOPT_ENCODING       => "",       // handle all encodings
      CURLOPT_AUTOREFERER    => true,     // set referer on redirect
      CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
      CURLOPT_TIMEOUT        => 120,      // timeout on response
      CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, $options);
    $remoteSite = curl_exec($ch);
    $header = curl_getinfo($ch);
    curl_close($ch);

    $header['content'] = substr($remoteSite, strpos($remoteSite, '<meta'));
    return str_replace('="/Vilisov-BBD/', '="https://the-sociophobic.github.io/Vilisov-BBD/', $header);
  }

  $proxiedPage = get_proxy_site_page('https://the-sociophobic.github.io/Vilisov-BBD');
  $body = substr($proxiedPage['content'], strpos($proxiedPage['content'], '<noscript>'));
  $header = substr($proxiedPage['content'], 0, strpos($proxiedPage['content'], '<noscript>'));

  include 'coinCodes.php';
  $imageIndex = array_search($_SERVER['QUERY_STRING'], $coinCodes);
  if ($imageIndex !== false) {
    $header = str_replace(
      'https://sun9-30.userapi.com/c858520/v858520632/1bfbc7/HLmNC4xFQPU.jpg',
      'https://apollonia.today/ubi/og-images/' . $imageIndex . '.png',
      $header);
  }

  echo "<html><head>" . $header . "</head><body>" . $body . "</body></html>";
?>
