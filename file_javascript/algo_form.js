const form = document.querySelector("#main_from");
form.addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.querySelector('#name').value;
  const amount =  document.querySelector('#amout').value;
  const date = document.querySelector('#dates').value;

  const times = document.querySelector('#times').value;

console.log(name);
console.log(amount);
console.log(date);
console.log(times);
})

console.log(form);
