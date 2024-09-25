try {
  const response = await fetch('/api/hello', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      example: 'Value'
    })
  });
  const json = await response.json();
  console.log(json);
  document.getElementById('app')!.innerHTML = json.message;
}
catch(error) {
  console.error(error);
  document.getElementById('app')!.innerHTML = 'ERROR';
}
