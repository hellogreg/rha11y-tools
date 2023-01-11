function getFileSize(url) {
  var fileSize = "";
  var http = new XMLHttpRequest();
  http.open("HEAD", url, false); // false = Synchronous

  http.send(null); // it will stop here until this http request is complete

  // when we are here, we already have a response, b/c we used Synchronous XHR

  if (http.status === 200) {
    fileSize = http.getResponseHeader("content-length");
    console.log("fileSize = " + fileSize);
  }
  return fileSize;
}
//getFileSize(node.src)
