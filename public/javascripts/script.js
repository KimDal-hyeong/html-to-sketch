var a = document.getElementById('downloader');
var input = document.getElementById('FieldBox__input');
var button = document.getElementById('SubmitBtn');

function requestHTMLtoSketch() {

  var value = input.value;

  if (value.length < 3) {
    customAlert('Please check address.');
    return;
  }

  startLoading();

  $.ajax({
    method: "GET",
    url: '/html2sketch?url=http://' + value,
  }).done(function (data) {

    var blob = b64toBlob(data.fileData, 'application/zip');
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = data.fileName;
    a.click();

  }).fail(function (data) {
    customAlert(data.responseJSON.message);
  }).always(function () {
    stopLoading();
  })

}

function startLoading() {
  button.classList.add('SubmitBtn--loading');
}

function stopLoading() {
  input.value = '';
  button.classList.remove('SubmitBtn--loading');
}

function customAlert(message) {
  var alertElm = document.getElementById('Alert');
  var alertMessageElm = document.getElementById('Alert__message');

  alertMessageElm.innerHTML = message;

  alertElm.style.display = 'none';
  setTimeout(function () {
    alertElm.style.display = 'block';
  }, 100);
}

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}