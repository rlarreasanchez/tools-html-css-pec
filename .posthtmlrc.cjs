const recipes = require("./src/data/recipes.json");

module.exports = {
	plugins: {
		"posthtml-include": {
			root: "src",
		},
		"posthtml-expressions": {
			locals: {
				recipes: recipes,
			},
		},
	},
};
