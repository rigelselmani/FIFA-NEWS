
var scrapedData = []
var savedData =[]
$("#render-articles").on("click", function () {
    $.ajax("/scrapeData", {
        type: "GET"
    }).then(function (data) {
        $("#results").empty()
        console.log(data)
        scrapedData = data;
        for (var i = 0; i < data.length; i++) {
            var html = $(`<div class="card">
            <div class="card-body" >
              <h5 class="card-title">${data[i].title}</h5>
              <p class="card-text">${data[i].body}</p>
           
              <button id="save-button" value=${i} class="btn btn-info">SAVE</button>
            </div>
          </div> <br>`)
          
            $("#results").append(html)
        }
    })
})

$("#results").on("click", "#save-button", function () {
$(this).text("SAVED")
   var index = this.value
    console.log(scrapedData[index])
    var article = scrapedData[index]
    $.ajax("/saveArticle", {
        type: "POST",
        data:  {title: article.title, body: article.body }
    }).then(function (data) {
        console.log("article is saved")
    })
})

$("#saved-articles").on("click",function(){
    loadSaved()
  
})

function loadSaved() {
    $.ajax("/savedArticles",{
        type:"GET",
    }).then(function(data){
        savedData = data
        $("#results").empty()
        for (var i = 0; i < data.length; i++) {
        var html = $(`<div class="card">
        <div class="card-body" >
          <h5 class="card-title">${data[i].title}</h5>
          <p class="card-text">${data[i].body}</p>
          <button id="delete-button" value=${i} class="btn btn-info">DELETE</button>
          <button id="notes-button" value=${i} class="btn btn-info">NOTES</button>
        </div>
      </div> <br>`)
       
            $("#results").append(html)
        }
    })
  }  

$("#results").on("click", "#delete-button", function () {
    
   var index = this.value;
   var article = savedData[index];
   $.ajax("/deleteArticle",{
       type: "POST",
       data: {
           title: article.title
       }
   }).then(function(){
loadSaved()
   })
})
var updateNoteTitle;
$("#results").on("click","#notes-button",function(){
   
    var index = this.value;
    var article = savedData[index];
    updateNoteTitle = article.title;
    console.log(article)
    $("#exampleModal").modal('toggle'); 
    var modalHeader = $("#note-header")
    var modalNote = $("#note-text")
    modalNote.text(`${article.note}`)
    modalHeader.text(`Notes for: ${article.title}`)
  
})

$("#save-note").on("click",function(){
var updatedNote = $("#note-text").val().trim();
$.ajax("/updateNote", {
type: "POST",
data: {
title: updateNoteTitle,
note: updatedNote
}
}).then(function(data){
console.log("saved")
})
})