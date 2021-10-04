const input1 = document.querySelector('#one');
const input2 = document.querySelector('#two');
const submit = document.querySelector('button');
const form = document.querySelector('form');

let user1="";
let user2="";
window.sessionStorage.setItem('User#1',"");
window.sessionStorage.setItem('User#2',"");

input1.addEventListener('change', () =>{
    user1 = input1.value;
    window.sessionStorage.setItem('User#1',user1);
    let data = window.sessionStorage.getItem('User#1');//test
    console.log(data);//test
})

input2.addEventListener('change', () =>{
    user2 = input2.value;
    window.sessionStorage.setItem('User#2',user2);
    let data = window.sessionStorage.getItem('User#2');//test
    console.log(data);//test
})


form.addEventListener('submit', (e) => {
    if(user1==""){
        e.preventDefault();
         alert("Enter something in Username#1");
         
    }
})