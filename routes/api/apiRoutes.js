const axios = require("axios");
const router = require("express").Router();
const articleController = require("../../controllers/articleController");


router.get("/articles", (req, res) => {


	// Save the incoming query object
	let queryObject = req.query;

	// Construct query parameters and URL
	const API_KEY = process.env.API_KEY;
	const QUERY = queryObject.query;
	const START_YEAR = queryObject.begin_date;
	const END_YEAR = queryObject.end_date;

	const QUERY_URL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${API_KEY}&q=${QUERY}&sort=newest&begin_date=${START_YEAR}0101&end_date=${END_YEAR}0101`

	// Fetch data from NYT API
	axios
		.get(QUERY_URL)
		.then(results => {
			res.json(results.data.response);
		
		})
		.catch(err => res.status(422).json(err));

});

router.route("/savedArticles")
  .get(articleController.getSavedArticles)
  .post(articleController.saveArticle);

router.route("/savedArticles/:id")
  .get(articleController.findArticleById)
  .delete(articleController.deleteArticle);

module.exports = router;