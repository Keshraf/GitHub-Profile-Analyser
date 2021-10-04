//Variables
const user = sessionStorage.getItem('User#1');
const user2 = sessionStorage.getItem('User#2');
let userData;
let repoData;
let langData;
let repoNames =[];
let repoStars = [];
let repoCommits=[];
let repoURL =[];
let repoDate =[];
let repoHTML =[];
let repoLangURL=[];
let repoLang=[];
let repository=[];
let totalStars = 0;

let svg=document.querySelector('#logo');

svg.addEventListener('click',function(){
    window.location.replace("../index.html");
})

    if(user2==""){
        let comp = document.querySelector('.comparison-box');
        comp.style.display = 'none';
    }

//USER INFO
const name = document.querySelector('#name-heading');
const follower = document.querySelector('#follower-info');
const following = document.querySelector('#following-info');
const stars = document.querySelector('#stars-info');
const repo = document.querySelector('#repo-info');
const lang = document.querySelector('#lang-info');
const joined = document.querySelector('#joined-info');
const pullRequests = document.querySelector('#pr-info');
const profile = document.querySelector('#profile-link');
const profileImage = document.querySelector('#profile-image');

//CHARTS
const langChart = document.querySelector('#lang-chart');
const starsChart = document.querySelector('#stars-chart');
const commitsChart = document.querySelector('#commits-chart');



const fetchData = async (user) =>{
    const data = await axios.get(`https://api.github.com/users/${user}`);
    return data.data;
}

const fetchRepo = async (user) =>{
    const data = await axios.get(`https://api.github.com/users/${user}/repos`);
    return data.data;
}

const fetchEvent = async (URL) =>{
    const data = await axios.get(URL);
    return data.data;
}

const fetchCommit = async (URL) =>{
    try {
        const data = await axios.get(URL);
        return data.data.length;
    } catch (error) {
        return 0;
    }
    
}

const fetchLang = async (URL) =>{
    const data = await axios.get(URL);
    return data.data;
}

async function Get(){
    userData = await fetchData(user); 
    console.log("User Data", await userData);

    repoData = await fetchRepo(user); 
    console.log("Repo Data", await repoData);

    change(await userData);
    pullRequest(await userData);
    await dataExtract(await repoData);

    console.log("RepoLang1",repoLang)
    langData = languages(repoLang); 
    console.log("LangData",await langData); 
    
    let langLabels = Object.keys(await langData);
    let langValues =  Object.values(await langData);

    for(let d=0;d<repoStars.length;d++){
        totalStars=totalStars+repoStars[d];
    }
    stars.innerText=totalStars;

    const theLang = new Chart(langChart,{
        type:'bar',
        data:{
            labels:  langLabels,
            datasets: [{
                label:"Most Used Language",
                data: langValues,
                backgroundColor:[
                    "rgba(49, 164, 230, 1)",
                    "rgba(85, 203, 203, 1)",
                    "rgba(84, 202, 118, 1)",
                    "rgba(245, 196, 82, 1)",
                    "rgba(242, 99, 127, 1)",
                    "rgba(146, 97, 243, 1)"
            ]
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: false,
            plugins:{
                legend:{
                    position:"top"
                }
            }
         }
    })

    let highestLang=0;
    let indexLang=0;
    for(let d=0;d<langValues.length;d++){
        if(langValues[d]>highestLang){
            highestLang=langValues[d];
            indexLang=d;
        }
    }
    lang.innerText = `${langLabels[indexLang]}`;

    const theCommit = new Chart(commitsChart,{
        type:'polarArea',
        data:{
            labels:  repoNames,
            datasets: [{
                label:"Commits",
                data: repoCommits,
                backgroundColor:[
                    "rgba(49, 164, 230, 1)",
                    "rgba(85, 203, 203, 1)",
                    "rgba(84, 202, 118, 1)",
                    "rgba(245, 196, 82, 1)",
                    "rgba(242, 99, 127, 1)",
                    "rgba(146, 97, 243, 1)"
            ]
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: false,
            plugins:{
                legend:{
                    position:"left"
                }
            }
         }
    })

    const theStar = new Chart(starsChart,{
        type:'pie',
        data:{
            labels:  repoNames,
            datasets: [{
                label:"Stars",
                data: repoStars,
                backgroundColor:[
                    "rgba(49, 164, 230, 1)",
                    "rgba(85, 203, 203, 1)",
                    "rgba(84, 202, 118, 1)",
                    "rgba(245, 196, 82, 1)",
                    "rgba(242, 99, 127, 1)",
                    "rgba(146, 97, 243, 1)"
            ]
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: false,
            plugins:{
                legend:{
                    position:"left"
                }
            }
         }
    })

    

}

Get();

const change = (e) =>{
    follower.innerText= e.followers;
    following.innerText= e.following;
    name.innerText= e.login;
    repo.innerText = e.public_repos;
    let dateCreate = String(e.created_at);
    let date = dateCreate.slice(0,10);
    joined.innerText = date;
    profile.setAttribute('href',e.html_url)
    profileImage.setAttribute('src',e.avatar_url)
}

const pullRequest = async (e) => {
    let eventsURL = e.events_url;
    let length = eventsURL.length;
    let eventURL = eventsURL.slice(0,(length-10));
    console.log("PullRequest",eventURL);
    const eventData = await fetchEvent(eventURL);
    console.log("EVENTS",eventData);
    let n=0;
    for(let i=0;i<eventData.length;i++){
        if(eventData[i].type=="PullRequestEvent"){
            n++;
        }
    }
    pullRequests.innerText = n;
}

const dataExtract = async (e) => {
    for(let i=0;i<e.length;i++){
        repoNames.push(e[i].name);
        repoStars.push(e[i].stargazers_count);
        repoCommits.push(await fetchCommit(`https://api.github.com/repos/${user}/${repoNames[i]}/commits`));
        repoURL.push(e[i].html_url);
        repoLangURL.push(e[i].languages_url);
        repoDate.push(e[i].created_at);
        repoLang.push(e[i].language);
        repository.push({
            name: repoNames[i],
            stars: repoStars[i],
            commits: repoCommits[i],
            url: repoURL[i],
            lang_url: repoLangURL[i],
            date: repoDate[i]
        });

    }
    console.log("RepoNames",repoNames);        
    console.log("RepoStars",repoStars);        
    console.log("RepoCommits",repoCommits);        
    console.log("RepoURL",repoURL);        
    console.log("RepoLangURL",repoLangURL);        
    console.log("RepoLang",repoLang);        
    console.log("RepoDate",  repoDate);        
    console.log("Repository",repository);   
} 


const languages = async(e) =>{
    let langQuant =new Object();
    console.log(e);
    for(let i=0;i<e.length;i++){
        let n=1;
        for(let j=1;j<e.length;j++){
            if(e[i]==e[j]){
                n++;
            }
        }
        langQuant[e[i]]=n;
    }
    return langQuant;
}

/* const languages = async(e) =>{
    let langObject = await fetchLang(e[0]);
    for(let i=1;i<e.length;i++){
        let tempObject = await fetchLang(e[i]);

        for(let j=0;j<Object.keys(tempObject).length;j++){ //HTML RUBY SHELL
            let n=0;
            for(let z=0;z<Object.keys(langObject).length;z++){ //HTML CSS JS 
                
                if(Object.keys(tempObject)[j]==Object.keys(langObject)[z]){
                    let addition = (Object.values(langObject))[z]+(Object.values(tempObject))[j];
                    langObject[Object.keys(langObject)[z]] = addition;
                    n++;
                }
                
            }
            if(n==0){
                langObject[(Object.keys(tempObject))[j]] = (Object.values(tempObject))[j];
            }
        }
        
        
    }
    return langObject;
}
 */




/* From repos I need:
1. name of the Repositories
2. html_url of the Repository
3. languages_url
4. created_at
5. stargazers_count
 */