let pickedCell = null;
let chosenApi = "";
let activity = "";

const defaultTableBackgroundColor = "#ffffff";
const selectedTableBackgroundColor = "#e5e5e5";

const days = [" ","Monday" , "Tuesday" , "Wednesday", "Thursday" , "Friday" , "Saturday", "Sunday"];
const hours = ["08:40-9:30","09:40-10:30","10:40-11:30","11:40-12:30","12:40-13:30","13:40-14:30","14:40-15:30","15:40-16:30","16:40-17:30" ];

const wildcardApis= ["Choose ...","Bored API", "Poetry DB", "Github Issue"];

const boredApiLink = "http://www.boredapi.com/api/activity/";

const poetyDBAuthorsLink = "https://poetrydb.org/author";
const poetryDBLink = "https://poetrydb.org/";

//format : repository_url": "https://api.github.com/repos/{owner}/{repo}
const githubApiRepoLink = "https://api.github.com/repos/"
const repositories = ["pytorch/pytorch/", "tensorflow/tensorflow/" ,"microsoft/PowerToys/", "atom/atom/", "bitcoin/bitcoin/" ];

const rowNum = hours.length;
const colNum = days.length;

function tableCreate() {
  let body = document.getElementById('kerem_table');
  let center = document.createElement('center');
  let tbl = document.createElement('table');
  // tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
  let tbdy = document.createElement('tbody');

  //create thead
  let thead = document.createElement('thead');
  for (let j = 0; j < colNum; j++) {
    let th = document.createElement('th');
    th.setAttribute("scope","col");
    th.textContent = days[j];
    thead.appendChild(th);
  }
    tbl.appendChild(thead);

  // create tbody
  for (let i = 0; i < rowNum; i++) {
    let tr = document.createElement('tr');
    for (let j = 0; j < colNum; j++) {
      let td = document.createElement('td');
      td.setAttribute("scope","row");
      if (j===0){

          td.textContent = hours[i];
          td.style.fontSize = '16px';
          // let span = document.createElement('span');
          // span.style=
          tr.appendChild(td);
      }
      else{
          td.style.fontSize='11px';
          tr.appendChild(td);
      }
    }
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  center.appendChild(tbl)
  body.appendChild(center);
}
tableCreate();
function formCreate(){
    var myContainer = document.getElementById('my_container');
    var myForm = document.getElementById('kerem_form');

    var formGroup = document.createElement('div');
    formGroup.setAttribute('className','form-group col-md-4');

    var labelActivity = document.createElement('label');
    labelActivity.setAttribute('htmlFor','activity_text');
    labelActivity.innerText='Activity';

    var textArea = document.createElement('textarea');
    textArea.setAttribute('className','form-control');
    textArea.setAttribute('id','activity_text');
    textArea.setAttribute('rows','3');
    textArea.setAttribute('placeholder','Put your plans here');

    formGroup.appendChild(labelActivity);
    formGroup.appendChild(textArea);

    var formGroupWildcard = document.createElement('div');
    formGroupWildcard.setAttribute('className','form-group col-md-4');

    var labelWildcard = document.createElement('label');
    labelWildcard.setAttribute('htmlFor','wildcard_state');
    labelWildcard.innerText='Wildcard Options';

    var select = document.createElement('select');
    select.setAttribute('id','wildcard_state');
    select.setAttribute('className', "form-control");

    for (let i=0 ; i < wildcardApis.length ; i++){
        var option = document.createElement('option');
        option.textContent = wildcardApis[i];
        select.appendChild(option);
    }

    formGroupWildcard.appendChild(labelWildcard);
    formGroupWildcard.appendChild(select);

    var button = document.createElement('button');
    button.setAttribute('type','submit');
    button.setAttribute('className', 'btn btn-primary');
    button.textContent = 'Submit';

    myForm.appendChild(formGroup);
    myForm.appendChild(formGroupWildcard);
    myForm.appendChild(button);
    myContainer.appendChild(myForm);
}
// formCreate();

const form = document.getElementById('kerem_form');
form.addEventListener('submit', submitAdd);

function submitAdd(event) {
    event.preventDefault();
    chosenApi = document.getElementById("wildcard_state").value;
    activity = document.getElementById("activity_text").value;

    if (chosenApi === wildcardApis[1]){
        const jsonPromise = fetchAsync(boredApiLink);
        jsonPromise.then((json) =>
            pickedCell.textContent = json['activity']
        );
    }

    else if (chosenApi === wildcardApis[2]){

        const jsonPromise = fetchAsync(poetryDBLink+'random');
        jsonPromise.then((json) =>{
            const link = poetryDBLink + 'title,author/'+ json[0]['title'] +
                ';' + json[0]['author']
                const linkNoSpace = link.replaceAll(" ","%20")
                console.log(linkNoSpace)

            pickedCell.innerHTML = 'Read the following poem \n title: ' + json[0]['title'] +
                '\n author: ' + json[0]['author'] +
                '\n Poem can be found in the following link: ' +
                link +
                ' <a href='+ linkNoSpace + '> poem link </a> : '
            }
        )
    }

    else if (chosenApi === wildcardApis[3]){
        const randomRepo = getRandomElement(repositories);
        const githubIssueLink = githubApiRepoLink + randomRepo + 'issues'
        const jsonPromise = fetchAsync(githubIssueLink);
        jsonPromise.then((json) =>{
            const randomIssue =  getRandomElement(json);
            pickedCell.innerHTML = "Solve the following github issue from "+ randomRepo +
            " Issue title: " + randomIssue['title'] +
            " Issue link:  <a href=" + randomIssue['url']+ " > issue link </a> "
            }
        );

    }
    else{
        pickedCell.textContent = activity;
    }
    chosenApi = "";
    activity = "";
    $(pickedCell).css("background-color",defaultTableBackgroundColor);
}

$("td").click(function(e){    
    $(pickedCell).css("background-color",defaultTableBackgroundColor);
    pickedCell = this;
    $(pickedCell).css("background-color",selectedTableBackgroundColor);
  e.stopPropagation();

});

async function fetchAsync (url) {
  try{
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }catch (e) {
    throw new Error(`Http fetch error ${e}`)
  }
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}


async function  sendPost(imageUrl){
  url2 = '/post'

  const callback = await $.ajax({
    type: "POST",
    url: url2,
    data: imageUrl,
    processData: false,
    contentType: 'application/octet-stream',
    
  }).done(function(o) {
    console.log('saved');     
  });
  
  console.log("calller response belowww")
  console.log(callback.data.url)
  console.log(window)
  // alert( `You can find the screenshot of your schedule in the following link \n ${callback.data.url} ` )
  alert( callback.data.url )
  return callback; // parses JSON response into native JavaScript objects

}


const takeScreenshotFunc=  function takeScreenshot(){
  const screenshotPlace = document.getElementById("kerem_container")
  html2canvas(screenshotPlace).then(callSendPostFromCanvas)
}

async function callSendPostFromCanvas(canvas){
  const dataUrl =canvas.toDataURL("image/png")

  const response = await sendPost(dataUrl)
  const span = document.getElementById("output")
  const newHTML = " Screenshot link :  <a href=" + response.data.url + " > " + response.data.url +   "</a> "

  span.innerHTML = newHTML

  console.log("resposneee callsendpostfromcanvas")
  console.log(response)  

}

const button_ss = document.getElementById("take-ss")
button_ss.addEventListener('click',takeScreenshotFunc )

