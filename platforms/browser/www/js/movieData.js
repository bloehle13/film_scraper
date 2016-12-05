var movieData =
	{ movieName: "",
		title: "",
		actors: "",
		director: "",
		plotSummary: "",
		awards: "",
		genre: "",
		IMDBNumberOfVotes: 0,
		IMDBRating: 0,
		tomatoNumberOfCriticReviews: 0,
		tomatoCriticRating: 0,
		tomatoCriticMeter: 0,
		tomatoNumberOfUserReviews: 0,
		tomatoUserRating: 0,
		tomatoUserMeter: 0,
		nytimesCriticApprovals: 0,
		nytimeNumberOfCritics: 0,
		moviedbPopulatrityRating: 0,
		moviedbVoteAverage: 0,
		moviedbVoteCount: 0
	}

function getMovieData(title) {
	movieData.movieName = title;
	imdbRottenSearch(movieData);

	return movieData;
}

function movieDBSearch(movieData){
	$.getJSON('http://api.themoviedb.org/3/search/movie?api_key=def5f8b6f1de9e4a8a1b2f19b93c9680&query=' + movieData.movieName, function(data){
			movieData.moviedbPopulatrityRating = data.results[0].popularity;
			movieData.moviedbVoteAverage = data.results[0].vote_average;
			movieData.moviedbVoteCount = data.results[0].vote_count;
				updateInfoMovieDB(data);
	});
}

function imdbRottenSearch(movieData){
	var imdbTomatoSearch = 'http://www.omdbapi.com/?t=' + movieData.movieName + '&y=&plot=short&tomatoes=true&r=json';
	$.getJSON( imdbTomatoSearch, function(data) {

		movieData.title = data.Title;
		movieData.actors = data.Actors;
		movieData.director = data.Director;
		movieData.plotSummary = data.Plot;
		movieData.awards = data.Awards;
		movieData.genre = data.Genre;
		movieData.IMDBNumberOfVotes = data.imdbVotes;
		movieData.IMDBRating = data.imdbRating;
		movieData.tomatoNumberOfCriticReviews = data.tomatoReviews;
		movieData.tomatoCriticRating = data.tomatoRating;
		movieData.tomatoCriticMeter = data.tomatoCriticMeter;
		movieData.tomatoNumberOfUserReviews = data.tomatoUserReviews;
		movieData.tomatoUserRating = data.tomatoUserRating;
		movieData.tomatoUserMeter = data.tomatoUserMeter;

	updateInfoIMDB(movieData);
	updateInfoRotTot(data);
	updateCriticRating(getAverageCriticReview(movieData));
	updateFanRating(getAverageAudienceReview(movieData));
	});
}

function getAverageCriticReview(movieData){

    var criticReviewRating =
    parseFloat(movieData.tomatoCriticRating);
		return criticReviewRating*10;
}

function getAverageAudienceReview(movieData){
    var averageAudienceReview =
    (parseFloat(movieData.IMDBRating)*2 +
    (parseFloat(movieData.tomatoUserRating) * 2) +
    parseFloat(movieData.moviedbVoteAverage)) / 3;

		return averageAudienceReview*10;
}

var NewYorkTimesReviews = []

var NYTSearch = function(movieData){

	var nytUrl = "https://api.nytimes.com/svc/movies/v2/reviews/search.json";

	nytUrl += '?' + $.param({
	  'api-key': "64483963a3d84321b85ce91504cd34f2",
	  'query' : movieData.movieName
	});

	$.ajax({
	  url: nytUrl,
	  method: 'GET',
	}).done(function(result) {
	  if(result.results.num_results)
	  	NewYorkTimesReviews = result.results;
	    var picks = 0;
	    var reviews = document.getElementById("nytimes-reviews");
	    for(i=0; i<result.results.length; i++){
	    	picks += result.results[i].critics_pick;
	    	var review = result.results[i];
	    	var thumb = "";

	    	if(review.critics_pick)
	    		thumb = "&#128077; "
	    	else
	    		thumb = "&#128078; "
	    }
	  	movieData.nytimesCriticApprovals = picks;
	  	movieData.nytimesNumberOfCritics = result.results.length;
			updateInfoNYTimes(result);
	}).fail(function(err) {
	  throw err;
	});

}
