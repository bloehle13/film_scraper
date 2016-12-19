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
	NYTSearch(movieData);
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

		if(data.Title === undefined){
			alert('No movie found. Are you typing in the correct title?');
		}
		else{
			if(data.Title.toLowerCase() !== movieData.movieName.toLowerCase()){
				alert('The title of the movie searched does not match the results. Are you'
				+ ' typing in the correct title?')
			}
		}
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
		if(movieData.title !== undefined){//check if actual movie was found
			var criticReviewRating =
			(parseFloat(movieData.tomatoCriticRating) +
			parseFloat(movieData.IMDBRating))/2;
			return Math.floor(criticReviewRating*10);
		}
		else{
			return 0;
		}
}

function getAverageAudienceReview(movieData){
		if(movieData.title !== undefined){//check if actual movie was found
			var averageAudienceReview =
			(parseFloat(movieData.IMDBRating) +
			(parseFloat(movieData.tomatoUserRating) * 2))/2;
			console.log(movieData.moviedbVoteAverage);
			if(movieData.moviedbVoteAverage != 0){
				averageAudienceReview += movieData.moviedbVoteAverage * (1/3);
			}

			return averageAudienceReview*10;
		}
		else{
			return 0;
		}
}

function NYTSearch(movieData){

	var newYorkTimesReviews = []
	var nytUrl = "https://api.nytimes.com/svc/movies/v2/reviews/search.json";

	nytUrl += '?' + $.param({
	  'api-key': "64483963a3d84321b85ce91504cd34f2",
	  'query' : movieData.movieName
	});

	$.ajax({
	  url: nytUrl,
		data: 'jsonp',
	  method: 'GET',
	}).done(function(result) {
		console.log(result);
	  for(var i = 0; i < result.num_results; i++){
			newYorkTimesReviews[i] = result.results[i];
		}
		updateInfoNYTimes(newYorkTimesReviews);
	}).fail(function(err) {
		updateInfoNYTimes(newYorkTimesReviews);
	});

}
