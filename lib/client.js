(function(){
  function get(url){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    if (xhr.status !== 200) throw new Error('failed to load ' + url + ': ' + xhr.status);
    return xhr.responseText;
  }
  var urls = ["https://raw.githubusercontent.com/hopefullstack-collab/dsh-plugin-company-example/main/lib/client.chunk.0.js", "https://raw.githubusercontent.com/hopefullstack-collab/dsh-plugin-company-example/main/lib/client.chunk.1.js", "https://raw.githubusercontent.com/hopefullstack-collab/dsh-plugin-company-example/main/lib/client.chunk.2.js", "https://raw.githubusercontent.com/hopefullstack-collab/dsh-plugin-company-example/main/lib/client.chunk.3.js", "https://raw.githubusercontent.com/hopefullstack-collab/dsh-plugin-company-example/main/lib/client.chunk.4.js", "https://raw.githubusercontent.com/hopefullstack-collab/dsh-plugin-company-example/main/lib/client.chunk.5.js"];
  var text = '';
  for (var i = 0; i < urls.length; i++) text += get(urls[i]);
  (0, eval)(text);
})();
