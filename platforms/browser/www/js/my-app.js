// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$(document).ready(function() {
  var gaugeOptions = {

        credits: {//remove highcharts.com from the chart
          enabled: false
        },

        chart: {
            type: 'solidgauge'
        },

        title: 'Movie_Rating',

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#DF5353'], // red
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#55BF3B'] // green
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    // The speed gauge
    var chartSpeed = Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: 'Critic Rating'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Speed',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                       '<span style="font-size:12px;color:silver">Rating</span></div>'
            },
            tooltip: {
                valueSuffix: ' Rating'
            }
        }]

    }));

    // The RPM gauge
    var chartRpm = Highcharts.chart('container-rpm', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: 'Fan Recommendation'
            }
        },

        series: [{
            name: 'RPM',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.0f}</span><br/>' +
                       '<span style="font-size:12px;color:silver">Percent</span></div>'
            },
            tooltip: {
                valueSuffix: ' Rating'
            }
        }]

    }));

});

//Detects enter key on phone
/**$("#movieTitleInput").on("keypress", function(event){
  var title = $('#movieTitleInput').val();
  var movieData = getMovieData(title);
  alert(movieData.IMBDRating);
  updateCriticRating(movieData.IMDBRating);
});*/

$("#movieTitleInput").on("keypress", function(event){
  if (event.keyCode === 13) {
      searchMovie();
      $("#movieTitleInput").blur();
      return false;
  }
});

var totalSearches = 0; //used to show ads. Every 3 searches = ad

function searchMovie(){
  var title = $('#movieTitleInput').val();
  var movieData = getMovieData(title);
  totalSearches++;
  if(totalSearches % 3 === 0){
    showAd();
  }
  else if(totalSearches % 3 === 1){//arbitrary so that ad is always loaded
    prepareAd();
  }
}

function updateFanRating(value){
  var new_value = value;

  //the value you wish to update and set to guage
  var point = $('#container-rpm').highcharts().series[0].points[0];
  point.update(new_value);
}

function updateCriticRating(value){
  var new_value = value;
  //the value you wish to update and set to guage
  var point = $('#container-speed').highcharts().series[0].points[0];
  point.update(new_value);
}

function updateInfoIMDB(info){
  $('#imdb').text(info.genre);
}

function updateInfoRotTot(data){
  document.getElementById("movieInformation").innerHTML =
			"<b>Title:</b> " + data.Title + "<br>" +
			"<b>Actors:</b> " +data.Actors + "<br>" +
			"<b>Director:</b> " +data.Director + "<br>" +
			"<b>Plot Summary:</b> " +data.Plot + "<br>" +
			"<b>Awards:</b> " +data.Awards + "<br>" +
			"<b>Genre:</b> " +data.Genre + "<br>" +
			"<b>Number of IMDB Votes:</b> " +data.imdbVotes + "<br>" +
			"<b>IMDB Rating:</b> " +data.imdbRating + "<br>" +
			"<b>Number of Tomato Critic Reviews:</b> " +data.tomatoReviews + "<br>" +
			"<b>Tomato Critic Rating:</b> " +data.tomatoRating + "<br>" +
			"<b>Tomato Critic Meter:</b> " +data.tomatoMeter + "<br>" +
			"<b>Number of Tomato User Reviews:</b> " +data.tomatoUserReviews + "<br>"+
			"<b>Tomato User Rating:</b> " +data.tomatoUserRating + "<br>" +
			"<b>Tomato User Meter:</b> " +data.tomatoUserMeter
  ;
}

function updateInfoNYTimes(reviews){//takes in array of reviews
  console.log(reviews.length);
  document.getElementById('nytReviews').innerHTML = ' ';//clear out any reveiws from prior searches
  if(reviews.length === 0){
    document.getElementById('nytReviews').innerHTML = 'No reviews found!';
  }
  else{
    for(i=0;i<reviews.length;i++){
      var review = reviews[i];
          let thumb = "";
          if(review.critics_pick)
            thumb = "&#128077; "
          else
            thumb = "&#128078; "
          document.getElementById('nytReviews').innerHTML += "<p>" +
            "<b>Headline: </b> " + thumb + review.headline + "<br>"+
            "<b>Author: </b> " + review.byline + "<br>" +
            "<b>Published: </b> " + review.publication_date + "<br>"+
            "<b>Summary: </b> " + review.summary_short + "<br>"+
            "<a href='#' onclick='summaryLink(" + '"' + review.link.url + '"' + ")'><b>Read More </b> </a>"+
            "</p>";
      }
  }
}

function summaryLink(link){
  cordova.InAppBrowser.open(link, '_blank', 'location=yes');
  //window.open("http://www.google.com", '_system');
}

$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('About Page');
    }
});
